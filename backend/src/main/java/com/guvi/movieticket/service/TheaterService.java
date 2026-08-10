package com.guvi.movieticket.service;

import com.guvi.movieticket.dto.request.TheaterRequest;
import com.guvi.movieticket.dto.response.TheaterResponse;

import java.util.List;

public interface TheaterService {
    TheaterResponse createTheater(TheaterRequest request);
    TheaterResponse updateTheater(Long id, TheaterRequest request);
    void deleteTheater(Long id);
    TheaterResponse getTheater(Long id);
    List<TheaterResponse> getAllTheaters();
}
