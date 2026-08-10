package com.guvi.movieticket.config;

import com.guvi.movieticket.service.BookingService;
import com.guvi.movieticket.service.SeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ScheduledTasks {

    private final SeatService seatService;
    private final BookingService bookingService;

    @Scheduled(fixedRate = 60_000)
    public void releaseExpiredSeatLocks() {
        seatService.releaseExpiredLocks();
    }

    @Scheduled(fixedRate = 120_000)
    public void expireStaleBookings() {
        bookingService.expireStaleBookings();
    }
}
