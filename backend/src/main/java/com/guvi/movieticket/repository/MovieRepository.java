package com.guvi.movieticket.repository;

import com.guvi.movieticket.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MovieRepository extends JpaRepository<Movie, Long> {
    List<Movie> findByActiveTrue();
    List<Movie> findByGenreIgnoreCaseAndActiveTrue(String genre);
    List<Movie> findByTitleContainingIgnoreCaseAndActiveTrue(String title);
}
