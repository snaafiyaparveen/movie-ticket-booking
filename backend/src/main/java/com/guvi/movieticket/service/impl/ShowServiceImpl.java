package com.guvi.movieticket.service.impl;

import com.guvi.movieticket.dto.request.ShowRequest;
import com.guvi.movieticket.dto.response.ShowResponse;
import com.guvi.movieticket.entity.Movie;
import com.guvi.movieticket.entity.Show;
import com.guvi.movieticket.entity.Theater;
import com.guvi.movieticket.exception.ResourceNotFoundException;
import com.guvi.movieticket.repository.MovieRepository;
import com.guvi.movieticket.repository.ShowRepository;
import com.guvi.movieticket.repository.TheaterRepository;
import com.guvi.movieticket.service.ShowService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShowServiceImpl implements ShowService {

    private final ShowRepository showRepository;
    private final MovieRepository movieRepository;
    private final TheaterRepository theaterRepository;

    @Override
    @Transactional
    public ShowResponse createShow(ShowRequest request) {
        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + request.getMovieId()));
        Theater theater = theaterRepository.findById(request.getTheaterId())
                .orElseThrow(() -> new ResourceNotFoundException("Theater not found with id: " + request.getTheaterId()));

        Show show = Show.builder()
                .movie(movie)
                .theater(theater)
                .showTime(request.getShowTime())
                .price(request.getPrice())
                .screenType(request.getScreenType() != null ? request.getScreenType() : "2D")
                .active(true)
                .build();

        return toResponse(showRepository.save(show));
    }

    @Override
    @Transactional
    public void deleteShow(Long id) {
        Show show = findOrThrow(id);
        show.setActive(false);
        showRepository.save(show);
    }

    @Override
    @Transactional(readOnly = true)
    public ShowResponse getShow(Long id) {
        return toResponse(findOrThrow(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ShowResponse> getShowsForMovie(Long movieId) {
        return showRepository.findByMovieIdAndActiveTrue(movieId)
                .stream()
                .sorted(Comparator.comparing(Show::getShowTime))
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ShowResponse> getAllShows() {
        return showRepository.findAll()
                .stream()
                .filter(Show::isActive)
                .sorted(Comparator.comparing(Show::getShowTime))
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private Show findOrThrow(Long id) {
        return showRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Show not found with id: " + id));
    }

    private ShowResponse toResponse(Show s) {
        return ShowResponse.builder()
                .id(s.getId())
                .movieId(s.getMovie().getId())
                .movieTitle(s.getMovie().getTitle())
                .moviePosterUrl(s.getMovie().getPosterUrl())
                .theaterId(s.getTheater().getId())
                .theaterName(s.getTheater().getName())
                .theaterCity(s.getTheater().getCity())
                .showTime(s.getShowTime())
                .price(s.getPrice())
                .screenType(s.getScreenType())
                .build();
    }
}
