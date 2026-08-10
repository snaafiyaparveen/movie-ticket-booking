package com.guvi.movieticket.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ShowRequest {

    @NotNull
    private Long movieId;

    @NotNull
    private Long theaterId;

    @NotNull
    private LocalDateTime showTime;

    @NotNull
    @Positive
    private BigDecimal price;

    private String screenType;
}
