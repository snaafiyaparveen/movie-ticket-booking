package com.guvi.movieticket.service.impl;

import com.guvi.movieticket.dto.request.TheaterRequest;
import com.guvi.movieticket.dto.response.TheaterResponse;
import com.guvi.movieticket.entity.Theater;
import com.guvi.movieticket.exception.ResourceNotFoundException;
import com.guvi.movieticket.repository.TheaterRepository;
import com.guvi.movieticket.service.TheaterService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TheaterServiceImpl implements TheaterService {

    private final TheaterRepository theaterRepository;

    @Override
    @Transactional
    public TheaterResponse createTheater(TheaterRequest request) {
        Theater theater = Theater.builder()
                .name(request.getName())
                .address(request.getAddress())
                .city(request.getCity())
                .totalRows(request.getTotalRows() != null ? request.getTotalRows() : 8)
                .seatsPerRow(request.getSeatsPerRow() != null ? request.getSeatsPerRow() : 10)
                .active(true)
                .build();
        return toResponse(theaterRepository.save(theater));
    }

    @Override
    @Transactional
    public TheaterResponse updateTheater(Long id, TheaterRequest request) {
        Theater theater = findOrThrow(id);
        theater.setName(request.getName());
        theater.setAddress(request.getAddress());
        theater.setCity(request.getCity());
        if (request.getTotalRows() != null) theater.setTotalRows(request.getTotalRows());
        if (request.getSeatsPerRow() != null) theater.setSeatsPerRow(request.getSeatsPerRow());
        return toResponse(theaterRepository.save(theater));
    }

    @Override
    @Transactional
    public void deleteTheater(Long id) {
        Theater theater = findOrThrow(id);
        theater.setActive(false);
        theaterRepository.save(theater);
    }

    @Override
    public TheaterResponse getTheater(Long id) {
        return toResponse(findOrThrow(id));
    }

    @Override
    public List<TheaterResponse> getAllTheaters() {
        return theaterRepository.findByActiveTrue().stream().map(this::toResponse).collect(Collectors.toList());
    }

    private Theater findOrThrow(Long id) {
        return theaterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Theater not found with id: " + id));
    }

    private TheaterResponse toResponse(Theater t) {
        return TheaterResponse.builder()
                .id(t.getId())
                .name(t.getName())
                .address(t.getAddress())
                .city(t.getCity())
                .totalRows(t.getTotalRows())
                .seatsPerRow(t.getSeatsPerRow())
                .active(t.isActive())
                .build();
    }
}
