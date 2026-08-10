package com.guvi.movieticket.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovieResponse {
    private Long id;
    private String title;
    private String genre;
    private String language;
    private Integer durationMinutes;
    private Double rating;
    private String censorRating;
    private String posterUrl;
    private String description;
    private LocalDateTime releaseDate;
    private boolean active;
}
