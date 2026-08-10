package com.guvi.movieticket.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PaymentRequest {

    @NotNull
    private Long bookingId;

    @NotBlank
    private String method; // CARD, UPI, NETBANKING, WALLET

    // Simulated card/UPI details (not persisted in real form) - used only to simulate gateway response
    private String cardOrUpiRef;
}
