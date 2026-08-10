package com.guvi.movieticket.dto.response;

import com.guvi.movieticket.entity.SeatStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeatResponse {
    private Long id;
    private String seatLabel;
    private Integer rowNumber;
    private Integer columnNumber;
    private SeatStatus status;
}
