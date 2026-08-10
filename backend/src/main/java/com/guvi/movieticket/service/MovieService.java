package com.guvi.movieticket.service;

import com.guvi.movieticket.dto.request.MovieRequest;
import com.guvi.movieticket.dto.response.MovieResponse;

import java.util.List;

public interface MovieService {
    MovieResponse createMovie(MovieRequest request);
    MovieResponse updateMovie(Long id, MovieRequest request);
    void deleteMovie(Long id);
    MovieResponse getMovie(Long id);
    List<MovieResponse> getAllMovies();
    List<MovieResponse> searchMovies(String title, String genre);
}
