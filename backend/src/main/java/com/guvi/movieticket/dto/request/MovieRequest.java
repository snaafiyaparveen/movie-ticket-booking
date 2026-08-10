package com.guvi.movieticket.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MovieRequest {

    @NotBlank
    private String title;

    private String genre;
    private String language;

    @NotNull
    @Positive
    private Integer durationMinutes;

    private Double rating;
    private String censorRating;
    private String posterUrl;
    private String description;
    private LocalDateTime releaseDate;
}
