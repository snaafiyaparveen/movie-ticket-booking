package com.guvi.movieticket.repository;

import com.guvi.movieticket.entity.Show;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ShowRepository extends JpaRepository<Show, Long> {

    List<Show> findByMovieIdAndActiveTrue(Long movieId);

    List<Show> findByTheaterIdAndActiveTrue(Long theaterId);

    List<Show> findByMovieIdAndTheaterIdAndShowTimeBetweenAndActiveTrue(
            Long movieId, Long theaterId, LocalDateTime start, LocalDateTime end);

    List<Show> findByMovieIdAndShowTimeBetweenAndActiveTrue(
            Long movieId, LocalDateTime start, LocalDateTime end);
}
