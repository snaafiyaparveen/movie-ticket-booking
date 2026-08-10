package com.guvi.movieticket.repository;

import com.guvi.movieticket.entity.Theater;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TheaterRepository extends JpaRepository<Theater, Long> {
    List<Theater> findByActiveTrue();
    List<Theater> findByCityIgnoreCaseAndActiveTrue(String city);
}
