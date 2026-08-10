package com.guvi.movieticket.service;

import com.guvi.movieticket.dto.request.BookingRequest;
import com.guvi.movieticket.dto.response.BookingResponse;

import java.util.List;

public interface BookingService {
    BookingResponse createBooking(BookingRequest request, Long userId);
    BookingResponse cancelBooking(Long bookingId, Long userId);
    List<BookingResponse> getBookingHistory(Long userId);
    BookingResponse getBooking(Long bookingId, Long userId);
    void expireStaleBookings();
}
