package com.guvi.movieticket.controller;

import com.guvi.movieticket.dto.request.PaymentRequest;
import com.guvi.movieticket.dto.response.PaymentResponse;
import com.guvi.movieticket.security.UserPrincipal;
import com.guvi.movieticket.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<PaymentResponse> pay(@Valid @RequestBody PaymentRequest request,
                                                @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(paymentService.processPayment(request, principal.getId()));
    }
}
