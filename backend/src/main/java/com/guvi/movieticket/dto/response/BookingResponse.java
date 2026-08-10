package com.guvi.movieticket.dto.response;

import com.guvi.movieticket.entity.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private Long id;
    private String bookingReference;
    private String movieTitle;
    private String theaterName;
    private LocalDateTime showTime;
    private List<String> seatLabels;
    private BigDecimal totalAmount;
    private BookingStatus status;
    private LocalDateTime bookingTime;
}
