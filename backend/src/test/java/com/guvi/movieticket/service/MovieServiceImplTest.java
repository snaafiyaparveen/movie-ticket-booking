package com.guvi.movieticket.service;

import com.guvi.movieticket.dto.request.MovieRequest;
import com.guvi.movieticket.dto.response.MovieResponse;
import com.guvi.movieticket.entity.Movie;
import com.guvi.movieticket.exception.ResourceNotFoundException;
import com.guvi.movieticket.repository.MovieRepository;
import com.guvi.movieticket.service.impl.MovieServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MovieServiceImplTest {

    @Mock
    private MovieRepository movieRepository;

    @InjectMocks
    private MovieServiceImpl movieService;

    private Movie sampleMovie;

    @BeforeEach
    void setUp() {
        sampleMovie = Movie.builder()
                .id(1L)
                .title("Inception")
                .genre("Sci-Fi")
                .durationMinutes(148)
                .rating(8.8)
                .active(true)
                .build();
    }

    @Test
    void createMovie_savesAndReturnsMovie() {
        MovieRequest request = new MovieRequest();
        request.setTitle("Inception");
        request.setGenre("Sci-Fi");
        request.setDurationMinutes(148);
        request.setRating(8.8);

        when(movieRepository.save(any(Movie.class))).thenReturn(sampleMovie);

        MovieResponse response = movieService.createMovie(request);

        assertNotNull(response);
        assertEquals("Inception", response.getTitle());
        assertEquals(148, response.getDurationMinutes());
        verify(movieRepository, times(1)).save(any(Movie.class));
    }

    @Test
    void getMovie_whenNotFound_throwsResourceNotFoundException() {
        when(movieRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> movieService.getMovie(99L));
    }

    @Test
    void getAllMovies_returnsActiveMoviesOnly() {
        when(movieRepository.findByActiveTrue()).thenReturn(List.of(sampleMovie));

        List<MovieResponse> result = movieService.getAllMovies();

        assertEquals(1, result.size());
        assertEquals("Inception", result.get(0).getTitle());
    }

    @Test
    void deleteMovie_softDeletesByMarkingInactive() {
        when(movieRepository.findById(1L)).thenReturn(Optional.of(sampleMovie));
        when(movieRepository.save(any(Movie.class))).thenReturn(sampleMovie);

        movieService.deleteMovie(1L);

        assertFalse(sampleMovie.isActive());
        verify(movieRepository).save(sampleMovie);
    }
}
