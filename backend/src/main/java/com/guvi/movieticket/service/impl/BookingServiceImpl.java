package com.guvi.movieticket.service.impl;

import com.guvi.movieticket.dto.request.BookingRequest;
import com.guvi.movieticket.dto.response.BookingResponse;
import com.guvi.movieticket.entity.*;
import com.guvi.movieticket.exception.BadRequestException;
import com.guvi.movieticket.exception.ResourceNotFoundException;
import com.guvi.movieticket.exception.SeatUnavailableException;
import com.guvi.movieticket.repository.BookingRepository;
import com.guvi.movieticket.repository.SeatRepository;
import com.guvi.movieticket.repository.ShowRepository;
import com.guvi.movieticket.repository.UserRepository;
import com.guvi.movieticket.service.BookingService;
import com.guvi.movieticket.util.BookingReferenceGenerator;
import com.guvi.movieticket.util.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final SeatRepository seatRepository;
    private final ShowRepository showRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public BookingResponse createBooking(BookingRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Show show = showRepository.findById(request.getShowId())
                .orElseThrow(() -> new ResourceNotFoundException("Show not found"));

        List<Seat> seats = seatRepository.findAllByIdForUpdate(request.getSeatIds());
        if (seats.size() != request.getSeatIds().size()) {
            throw new ResourceNotFoundException("One or more seats could not be found");
        }

        for (Seat seat : seats) {
            boolean heldByThisUser = seat.getStatus() == SeatStatus.LOCKED && userId.equals(seat.getLockedByUserId());
            if (!heldByThisUser) {
                throw new SeatUnavailableException("Seat " + seat.getSeatLabel() + " is not held by you or has expired. Please re-select.");
            }
        }

        BigDecimal total = show.getPrice().multiply(BigDecimal.valueOf(seats.size()));

        Booking booking = Booking.builder()
                .bookingReference(BookingReferenceGenerator.generate())
                .user(user)
                .show(show)
                .seats(seats)
                .totalAmount(total)
                .status(BookingStatus.PENDING)
                .bookingTime(LocalDateTime.now())
                .build();

        Booking saved = bookingRepository.save(booking);

        // Seats remain LOCKED (now tied to this pending booking) until payment succeeds or booking expires.
        return toResponse(saved);
    }

    @Override
    @Transactional
    public BookingResponse cancelBooking(Long bookingId, Long userId) {
        Booking booking = getOwnedBookingOrThrow(bookingId, userId);

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancelledAt(LocalDateTime.now());

        for (Seat seat : booking.getSeats()) {
            seat.setStatus(SeatStatus.AVAILABLE);
            seat.setLockedUntil(null);
            seat.setLockedByUserId(null);
        }
        seatRepository.saveAll(booking.getSeats());
        Booking saved = bookingRepository.save(booking);

        notificationService.sendBookingCancellation(saved);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getBookingHistory(Long userId) {
        return bookingRepository.findByUserIdOrderByBookingTimeDesc(userId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponse getBooking(Long bookingId, Long userId) {
        return toResponse(getOwnedBookingOrThrow(bookingId, userId));
    }

    @Override
    @Transactional
    public void expireStaleBookings() {
        LocalDateTime cutoff = LocalDateTime.now().minusMinutes(15);
        List<Booking> stale = bookingRepository.findByStatusAndBookingTimeBefore(BookingStatus.PENDING, cutoff);
        for (Booking booking : stale) {
            booking.setStatus(BookingStatus.EXPIRED);
            for (Seat seat : booking.getSeats()) {
                if (seat.getStatus() == SeatStatus.LOCKED) {
                    seat.setStatus(SeatStatus.AVAILABLE);
                    seat.setLockedUntil(null);
                    seat.setLockedByUserId(null);
                }
            }
            seatRepository.saveAll(booking.getSeats());
        }
        if (!stale.isEmpty()) {
            bookingRepository.saveAll(stale);
        }
    }

    private Booking getOwnedBookingOrThrow(Long bookingId, Long userId) {
        Booking booking = bookingRepository.findByIdWithDetails(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        if (!booking.getUser().getId().equals(userId)) {
            throw new BadRequestException("This booking does not belong to you");
        }
        return booking;
    }

    private BookingResponse toResponse(Booking b) {
        return BookingResponse.builder()
                .id(b.getId())
                .bookingReference(b.getBookingReference())
                .movieTitle(b.getShow().getMovie().getTitle())
                .theaterName(b.getShow().getTheater().getName())
                .showTime(b.getShow().getShowTime())
                .seatLabels(b.getSeats().stream().map(Seat::getSeatLabel).collect(Collectors.toList()))
                .totalAmount(b.getTotalAmount())
                .status(b.getStatus())
                .bookingTime(b.getBookingTime())
                .build();
    }
}
