package com.guvi.movieticket.repository;

import com.guvi.movieticket.entity.Booking;
import com.guvi.movieticket.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("""
        SELECT DISTINCT b
        FROM Booking b
        JOIN FETCH b.show s
        JOIN FETCH s.movie
        JOIN FETCH s.theater
        LEFT JOIN FETCH b.seats
        WHERE b.user.id = :userId
        ORDER BY b.bookingTime DESC
    """)
    List<Booking> findByUserIdOrderByBookingTimeDesc(@Param("userId") Long userId);

    @Query("""
        SELECT b
        FROM Booking b
        JOIN FETCH b.show s
        JOIN FETCH s.movie
        JOIN FETCH s.theater
        LEFT JOIN FETCH b.seats
        WHERE b.id = :id
    """)
    Optional<Booking> findByIdWithDetails(@Param("id") Long id);

    Optional<Booking> findByBookingReference(String bookingReference);

    List<Booking> findByStatusAndBookingTimeBefore(
            BookingStatus status,
            LocalDateTime time
    );
}