package com.guvi.movieticket.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TheaterRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String address;

    private String city;
    private Integer totalRows;
    private Integer seatsPerRow;
}
