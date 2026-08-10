package com.guvi.movieticket.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "movies")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 100)
    private String genre;

    @Column(length = 20)
    private String language;

    /** Duration in minutes */
    @Column(nullable = false)
    private Integer durationMinutes;

    /** Rating out of 10, e.g. 8.5 */
    private Double rating;

    @Column(length = 20)
    private String censorRating; // U, U/A, A

    @Column(length = 500)
    private String posterUrl;

    @Column(length = 2000)
    private String description;

    private LocalDateTime releaseDate;

    @Builder.Default
    private boolean active = true;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
