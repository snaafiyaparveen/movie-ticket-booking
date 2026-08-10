package com.guvi.movieticket;

import com.guvi.movieticket.dto.request.SeatLockRequest;
import com.guvi.movieticket.entity.*;
import com.guvi.movieticket.exception.SeatUnavailableException;
import com.guvi.movieticket.repository.SeatRepository;
import com.guvi.movieticket.repository.ShowRepository;
import com.guvi.movieticket.service.impl.SeatServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SeatServiceImplTest {

    @Mock
    private SeatRepository seatRepository;

    @Mock
    private ShowRepository showRepository;

    @InjectMocks
    private SeatServiceImpl seatService;

    private Seat bookedSeat;

    @BeforeEach
    void setUp() {
        Theater theater = Theater.builder().id(1L).name("PVR").totalRows(5).seatsPerRow(10).build();
        Movie movie = Movie.builder().id(1L).title("Dune").durationMinutes(150).build();
        Show show = Show.builder().id(1L).movie(movie).theater(theater).price(BigDecimal.valueOf(250))
                .showTime(LocalDateTime.now().plusHours(2)).build();

        bookedSeat = Seat.builder().id(1L).show(show).seatLabel("A1").rowNumber(1).columnNumber(1)
                .status(SeatStatus.BOOKED).build();
    }

    @Test
    void lockSeats_whenSeatAlreadyBooked_throwsSeatUnavailableException() {
        when(seatRepository.findByShowIdAndSeatLabel(1L, "A1")).thenReturn(Optional.of(bookedSeat));
        when(seatRepository.findAllByIdForUpdate(anyList())).thenReturn(List.of(bookedSeat));

        SeatLockRequest request = new SeatLockRequest();
        request.setShowId(1L);
        request.setSeatLabels(List.of("A1"));

        assertThrows(SeatUnavailableException.class, () -> seatService.lockSeats(request, 42L));
    }
}
