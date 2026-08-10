package com.guvi.movieticket.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "theaters")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Theater {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 250)
    private String address;

    @Column(length = 100)
    private String city;

    /** Number of rows in the seat layout, e.g. 8 */
    @Builder.Default
    private Integer totalRows = 8;

    /** Number of seats per row, e.g. 10 */
    @Builder.Default
    private Integer seatsPerRow = 10;

    @Builder.Default
    private boolean active = true;
}
