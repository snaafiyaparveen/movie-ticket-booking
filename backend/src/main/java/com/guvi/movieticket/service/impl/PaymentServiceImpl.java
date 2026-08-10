package com.guvi.movieticket.service.impl;

import com.guvi.movieticket.dto.request.PaymentRequest;
import com.guvi.movieticket.dto.response.PaymentResponse;
import com.guvi.movieticket.entity.*;
import com.guvi.movieticket.exception.BadRequestException;
import com.guvi.movieticket.exception.ResourceNotFoundException;
import com.guvi.movieticket.repository.BookingRepository;
import com.guvi.movieticket.repository.PaymentRepository;
import com.guvi.movieticket.repository.SeatRepository;
import com.guvi.movieticket.service.PaymentService;
import com.guvi.movieticket.util.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final SeatRepository seatRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public PaymentResponse processPayment(PaymentRequest request, Long userId) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getUser().getId().equals(userId)) {
            throw new BadRequestException("This booking does not belong to you");
        }
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BadRequestException("Booking is not awaiting payment (current status: " + booking.getStatus() + ")");
        }

        // --- Simulated payment gateway call (Razorpay/Stripe/Cashfree) ---
        // In production, replace this block with a real gateway SDK call and verify its response.
        String transactionId = "TXN-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase();
        PaymentStatus resultStatus = PaymentStatus.SUCCESS;
        // --- end simulation ---

        Payment payment = Payment.builder()
                .booking(booking)
                .amount(booking.getTotalAmount())
                .method(request.getMethod())
                .transactionId(transactionId)
                .status(resultStatus)
                .paidAt(LocalDateTime.now())
                .build();
        Payment savedPayment = paymentRepository.save(payment);

        if (resultStatus == PaymentStatus.SUCCESS) {
            booking.setStatus(BookingStatus.CONFIRMED);
            for (Seat seat : booking.getSeats()) {
                seat.setStatus(SeatStatus.BOOKED);
                seat.setLockedUntil(null);
            }
            seatRepository.saveAll(booking.getSeats());
            bookingRepository.save(booking);
            notificationService.sendBookingConfirmation(booking);
        }

        return toResponse(savedPayment);
    }

    private PaymentResponse toResponse(Payment p) {
        return PaymentResponse.builder()
                .id(p.getId())
                .bookingId(p.getBooking().getId())
                .bookingReference(p.getBooking().getBookingReference())
                .amount(p.getAmount())
                .method(p.getMethod())
                .transactionId(p.getTransactionId())
                .status(p.getStatus())
                .paidAt(p.getPaidAt())
                .build();
    }
}
