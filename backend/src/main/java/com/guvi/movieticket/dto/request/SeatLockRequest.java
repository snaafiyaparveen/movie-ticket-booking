package com.guvi.movieticket.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class SeatLockRequest {

    @NotNull
    private Long showId;

    @NotEmpty(message = "Select at least one seat")
    private List<String> seatLabels;
}
