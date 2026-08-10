package com.guvi.movieticket.service.impl;

import com.guvi.movieticket.dto.request.MovieRequest;
import com.guvi.movieticket.dto.response.MovieResponse;
import com.guvi.movieticket.entity.Movie;
import com.guvi.movieticket.exception.ResourceNotFoundException;
import com.guvi.movieticket.repository.MovieRepository;
import com.guvi.movieticket.service.MovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MovieServiceImpl implements MovieService {

    private final MovieRepository movieRepository;

    @Override
    @Transactional
    public MovieResponse createMovie(MovieRequest request) {
        Movie movie = Movie.builder()
                .title(request.getTitle())
                .genre(request.getGenre())
                .language(request.getLanguage())
                .durationMinutes(request.getDurationMinutes())
                .rating(request.getRating())
                .censorRating(request.getCensorRating())
                .posterUrl(request.getPosterUrl())
                .description(request.getDescription())
                .releaseDate(request.getReleaseDate())
                .active(true)
                .build();
        return toResponse(movieRepository.save(movie));
    }

    @Override
    @Transactional
    public MovieResponse updateMovie(Long id, MovieRequest request) {
        Movie movie = findMovieOrThrow(id);
        movie.setTitle(request.getTitle());
        movie.setGenre(request.getGenre());
        movie.setLanguage(request.getLanguage());
        movie.setDurationMinutes(request.getDurationMinutes());
        movie.setRating(request.getRating());
        movie.setCensorRating(request.getCensorRating());
        movie.setPosterUrl(request.getPosterUrl());
        movie.setDescription(request.getDescription());
        movie.setReleaseDate(request.getReleaseDate());
        return toResponse(movieRepository.save(movie));
    }

    @Override
    @Transactional
    public void deleteMovie(Long id) {
        Movie movie = findMovieOrThrow(id);
        movie.setActive(false); // soft delete to preserve booking history integrity
        movieRepository.save(movie);
    }

    @Override
    public MovieResponse getMovie(Long id) {
        return toResponse(findMovieOrThrow(id));
    }

    @Override
    public List<MovieResponse> getAllMovies() {
        return movieRepository.findByActiveTrue().stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<MovieResponse> searchMovies(String title, String genre) {
        List<Movie> movies;
        if (StringUtils.hasText(title)) {
            movies = movieRepository.findByTitleContainingIgnoreCaseAndActiveTrue(title);
        } else if (StringUtils.hasText(genre)) {
            movies = movieRepository.findByGenreIgnoreCaseAndActiveTrue(genre);
        } else {
            movies = movieRepository.findByActiveTrue();
        }
        return movies.stream().map(this::toResponse).collect(Collectors.toList());
    }

    private Movie findMovieOrThrow(Long id) {
        return movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + id));
    }

    private MovieResponse toResponse(Movie m) {
        return MovieResponse.builder()
                .id(m.getId())
                .title(m.getTitle())
                .genre(m.getGenre())
                .language(m.getLanguage())
                .durationMinutes(m.getDurationMinutes())
                .rating(m.getRating())
                .censorRating(m.getCensorRating())
                .posterUrl(m.getPosterUrl())
                .description(m.getDescription())
                .releaseDate(m.getReleaseDate())
                .active(m.isActive())
                .build();
    }
}
