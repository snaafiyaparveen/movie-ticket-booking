package com.guvi.movieticket.service;

import com.guvi.movieticket.dto.request.SeatLockRequest;
import com.guvi.movieticket.dto.response.SeatResponse;

import java.util.List;

public interface SeatService {
    /** Ensures seats exist for a show (lazily generated from the theater layout). */
    List<SeatResponse> getSeatsForShow(Long showId);

    /** Temporarily locks the given seats for the current user (checkout hold, TTL-based). */
    List<SeatResponse> lockSeats(SeatLockRequest request, Long userId);

    /** Releases a user's lock on seats they decided not to book. */
    void releaseLock(Long showId, List<String> seatLabels, Long userId);

    /** Scheduled job: releases expired locks back to AVAILABLE. */
    void releaseExpiredLocks();
}
