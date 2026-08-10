package com.guvi.movieticket.service;

import com.guvi.movieticket.dto.request.ShowRequest;
import com.guvi.movieticket.dto.response.ShowResponse;

import java.util.List;

public interface ShowService {
    ShowResponse createShow(ShowRequest request);
    void deleteShow(Long id);
    ShowResponse getShow(Long id);
    List<ShowResponse> getShowsForMovie(Long movieId);
    List<ShowResponse> getAllShows();
}
