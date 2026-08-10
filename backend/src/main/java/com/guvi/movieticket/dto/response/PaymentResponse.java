package com.guvi.movieticket.dto.response;

import com.guvi.movieticket.entity.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
    private Long id;
    private Long bookingId;
    private String bookingReference;
    private BigDecimal amount;
    private String method;
    private String transactionId;
    private PaymentStatus status;
    private LocalDateTime paidAt;
}
