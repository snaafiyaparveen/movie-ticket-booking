package com.guvi.movieticket.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "seats", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"show_id", "seat_label"})
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "show_id", nullable = false)
    private Show show;

    /** e.g. "A1", "B5" */
    @Column(name = "seat_label", nullable = false, length = 10)
    private String seatLabel;

    @Column(name = "row_num")
    private Integer rowNumber;

    @Column(name = "col_num")
    private Integer columnNumber;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private SeatStatus status = SeatStatus.AVAILABLE;

    private LocalDateTime lockedUntil;

    private Long lockedByUserId;

    @Version
    private Long version;
}
