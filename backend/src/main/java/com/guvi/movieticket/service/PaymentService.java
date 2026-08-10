package com.guvi.movieticket.service;

import com.guvi.movieticket.dto.request.PaymentRequest;
import com.guvi.movieticket.dto.response.PaymentResponse;

public interface PaymentService {
    /** Simulates a payment gateway confirmation and finalizes the booking. */
    PaymentResponse processPayment(PaymentRequest request, Long userId);
}
