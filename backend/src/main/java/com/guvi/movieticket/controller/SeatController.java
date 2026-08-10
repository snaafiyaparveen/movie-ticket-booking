package com.guvi.movieticket.controller;

import com.guvi.movieticket.dto.request.SeatLockRequest;
import com.guvi.movieticket.dto.response.ApiResponse;
import com.guvi.movieticket.dto.response.SeatResponse;
import com.guvi.movieticket.security.UserPrincipal;
import com.guvi.movieticket.service.SeatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/seats")
@RequiredArgsConstructor
public class SeatController {

    private final SeatService seatService;

    @GetMapping("/show/{showId}")
    public ResponseEntity<List<SeatResponse>> getSeatsForShow(@PathVariable Long showId) {
        return ResponseEntity.ok(seatService.getSeatsForShow(showId));
    }

    @PostMapping("/lock")
    public ResponseEntity<List<SeatResponse>> lockSeats(@Valid @RequestBody SeatLockRequest request,
                                                          @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(seatService.lockSeats(request, principal.getId()));
    }

    @PostMapping("/release")
    public ResponseEntity<ApiResponse> releaseLock(@RequestBody Map<String, Object> body,
                                                     @AuthenticationPrincipal UserPrincipal principal) {
        Long showId = Long.valueOf(body.get("showId").toString());
        @SuppressWarnings("unchecked")
        List<String> seatLabels = (List<String>) body.get("seatLabels");
        seatService.releaseLock(showId, seatLabels, principal.getId());
        return ResponseEntity.ok(ApiResponse.of(true, "Seat lock released"));
    }
}
