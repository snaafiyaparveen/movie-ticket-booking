package com.guvi.movieticket.service.impl;

import com.guvi.movieticket.dto.request.SeatLockRequest;
import com.guvi.movieticket.dto.response.SeatResponse;
import com.guvi.movieticket.entity.Seat;
import com.guvi.movieticket.entity.SeatStatus;
import com.guvi.movieticket.entity.Show;
import com.guvi.movieticket.exception.ResourceNotFoundException;
import com.guvi.movieticket.exception.SeatUnavailableException;
import com.guvi.movieticket.repository.SeatRepository;
import com.guvi.movieticket.repository.ShowRepository;
import com.guvi.movieticket.service.SeatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SeatServiceImpl implements SeatService {

    private final SeatRepository seatRepository;
    private final ShowRepository showRepository;

    @Value("${app.seat-lock.ttl-seconds:300}")
    private long lockTtlSeconds;

    private static final String ROW_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    @Override
    @Transactional
    public List<SeatResponse> getSeatsForShow(Long showId) {
        Show show = showRepository.findById(showId)
                .orElseThrow(() -> new ResourceNotFoundException("Show not found with id: " + showId));

        List<Seat> seats = seatRepository.findByShowId(showId);
        if (seats.isEmpty()) {
            seats = generateSeatsForShow(show);
        } else {
            releaseIfExpired(seats);
        }

        return seats.stream()
                .sorted((a, b) -> {
                    int r = a.getRowNumber().compareTo(b.getRowNumber());
                    return r != 0 ? r : a.getColumnNumber().compareTo(b.getColumnNumber());
                })
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private List<Seat> generateSeatsForShow(Show show) {
        int rows = show.getTheater().getTotalRows();
        int cols = show.getTheater().getSeatsPerRow();
        List<Seat> seats = new ArrayList<>();

        for (int r = 0; r < rows; r++) {
            char rowLetter = ROW_LETTERS.charAt(r % ROW_LETTERS.length());
            for (int c = 1; c <= cols; c++) {
                seats.add(Seat.builder()
                        .show(show)
                        .seatLabel(rowLetter + String.valueOf(c))
                        .rowNumber(r + 1)
                        .columnNumber(c)
                        .status(SeatStatus.AVAILABLE)
                        .build());
            }
        }
        return seatRepository.saveAll(seats);
    }

    private void releaseIfExpired(List<Seat> seats) {
        LocalDateTime now = LocalDateTime.now();
        List<Seat> toRelease = seats.stream()
                .filter(s -> s.getStatus() == SeatStatus.LOCKED
                        && s.getLockedUntil() != null
                        && s.getLockedUntil().isBefore(now))
                .collect(Collectors.toList());

        for (Seat s : toRelease) {
            s.setStatus(SeatStatus.AVAILABLE);
            s.setLockedUntil(null);
            s.setLockedByUserId(null);
        }
        if (!toRelease.isEmpty()) {
            seatRepository.saveAll(toRelease);
        }
    }

    @Override
    @Transactional
    public List<SeatResponse> lockSeats(SeatLockRequest request, Long userId) {
        List<Seat> seats = new ArrayList<>();
        for (String label : request.getSeatLabels()) {
            Seat seat = seatRepository.findByShowIdAndSeatLabel(request.getShowId(), label)
                    .orElseThrow(() -> new ResourceNotFoundException("Seat " + label + " not found for this show"));
            seats.add(seat);
        }

        // Re-check under pessimistic lock to avoid race conditions with concurrent requests.
        List<Long> ids = seats.stream().map(Seat::getId).collect(Collectors.toList());
        List<Seat> lockedRows = seatRepository.findAllByIdForUpdate(ids);

        LocalDateTime now = LocalDateTime.now();
        for (Seat seat : lockedRows) {
            boolean expired = seat.getStatus() == SeatStatus.LOCKED
                    && seat.getLockedUntil() != null && seat.getLockedUntil().isBefore(now);

            if (seat.getStatus() == SeatStatus.BOOKED
                    || (seat.getStatus() == SeatStatus.LOCKED && !expired && !userId.equals(seat.getLockedByUserId()))) {
                throw new SeatUnavailableException("Seat " + seat.getSeatLabel() + " is no longer available");
            }
            seat.setStatus(SeatStatus.LOCKED);
            seat.setLockedUntil(now.plusSeconds(lockTtlSeconds));
            seat.setLockedByUserId(userId);
        }

        List<Seat> saved = seatRepository.saveAll(lockedRows);
        return saved.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void releaseLock(Long showId, List<String> seatLabels, Long userId) {
        for (String label : seatLabels) {
            seatRepository.findByShowIdAndSeatLabel(showId, label).ifPresent(seat -> {
                if (seat.getStatus() == SeatStatus.LOCKED && userId.equals(seat.getLockedByUserId())) {
                    seat.setStatus(SeatStatus.AVAILABLE);
                    seat.setLockedUntil(null);
                    seat.setLockedByUserId(null);
                    seatRepository.save(seat);
                }
            });
        }
    }

    @Override
    @Transactional
    public void releaseExpiredLocks() {
        List<Seat> expired = seatRepository.findByStatusAndLockedUntilBefore(SeatStatus.LOCKED, LocalDateTime.now());
        for (Seat s : expired) {
            s.setStatus(SeatStatus.AVAILABLE);
            s.setLockedUntil(null);
            s.setLockedByUserId(null);
        }
        if (!expired.isEmpty()) {
            seatRepository.saveAll(expired);
            log.info("Released {} expired seat locks", expired.size());
        }
    }

    private SeatResponse toResponse(Seat s) {
        return SeatResponse.builder()
                .id(s.getId())
                .seatLabel(s.getSeatLabel())
                .rowNumber(s.getRowNumber())
                .columnNumber(s.getColumnNumber())
                .status(s.getStatus())
                .build();
    }
}
