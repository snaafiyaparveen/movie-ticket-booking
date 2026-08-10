package com.guvi.movieticket.util;

import com.guvi.movieticket.entity.Booking;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final JavaMailSender mailSender;

    @Value("${app.notifications.enabled:false}")
    private boolean notificationsEnabled;

    @Value("${app.mail.from:noreply@movieticket.com}")
    private String fromAddress;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");

    public void sendBookingConfirmation(Booking booking) {
        String subject = "Booking Confirmed - " + booking.getBookingReference();
        String body = buildBookingBody(booking, "Your booking is confirmed! Enjoy the show.");
        send(booking.getUser().getEmail(), subject, body);
    }

    public void sendBookingCancellation(Booking booking) {
        String subject = "Booking Cancelled - " + booking.getBookingReference();
        String body = buildBookingBody(booking, "Your booking has been cancelled.");
        send(booking.getUser().getEmail(), subject, body);
    }

    private String buildBookingBody(Booking booking, String headline) {
        String seats = booking.getSeats().stream()
                .map(s -> s.getSeatLabel())
                .collect(Collectors.joining(", "));

        return headline + "\n\n" +
                "Booking Reference: " + booking.getBookingReference() + "\n" +
                "Movie: " + booking.getShow().getMovie().getTitle() + "\n" +
                "Theater: " + booking.getShow().getTheater().getName() + "\n" +
                "Show Time: " + booking.getShow().getShowTime().format(FORMATTER) + "\n" +
                "Seats: " + seats + "\n" +
                "Total Amount: Rs. " + booking.getTotalAmount() + "\n\n" +
                "Thank you for booking with Movie Ticket Booking System.";
    }

    private void send(String to, String subject, String body) {
        if (!notificationsEnabled) {
            log.info("[NOTIFICATION - SIMULATED EMAIL]\nTo: {}\nSubject: {}\n{}\n", to, subject, body);
            return;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromAddress);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            log.info("Email sent to {}", to);
        } catch (Exception ex) {
            log.error("Failed to send email to {}: {}", to, ex.getMessage());
        }
    }
}
