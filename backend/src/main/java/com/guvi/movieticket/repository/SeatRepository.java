package com.guvi.movieticket.repository;

import com.guvi.movieticket.entity.Seat;
import com.guvi.movieticket.entity.SeatStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface SeatRepository extends JpaRepository<Seat, Long> {

    List<Seat> findByShowId(Long showId);

    List<Seat> findByShowIdAndStatus(Long showId, SeatStatus status);

    Optional<Seat> findByShowIdAndSeatLabel(Long showId, String seatLabel);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select s from Seat s where s.id in :ids")
    List<Seat> findAllByIdForUpdate(@Param("ids") List<Long> ids);

    List<Seat> findByStatusAndLockedUntilBefore(SeatStatus status, LocalDateTime time);
}
