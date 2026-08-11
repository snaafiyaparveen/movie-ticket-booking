package com.guvi.movieticket.config;

import com.guvi.movieticket.entity.Role;
import com.guvi.movieticket.entity.User;
import com.guvi.movieticket.repository.UserRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EntityManager entityManager;

    @Override
    public void run(String... args) {

        try {
            String database = (String) entityManager
                    .createNativeQuery("SELECT DATABASE()")
                    .getSingleResult();

            log.info("========== CONNECTED DATABASE: {} ==========", database);

            List<?> tables = entityManager
                    .createNativeQuery("SHOW TABLES")
                    .getResultList();

            log.info("========== TABLES ==========");
            tables.forEach(t -> log.info("TABLE -> {}", t));

        } catch (Exception e) {
            log.error("Could not inspect database", e);
        }

        try {
            if (!userRepository.existsByEmail("admin@movieticket.com")) {

                User admin = User.builder()
                        .fullName("System Admin")
                        .email("admin@movieticket.com")
                        .password(passwordEncoder.encode("Admin@123"))
                        .roles(Set.of(Role.ROLE_ADMIN, Role.ROLE_USER))
                        .enabled(true)
                        .build();

                userRepository.save(admin);

                log.info("Admin account created.");
            } else {
                log.info("Admin already exists.");
            }

        } catch (Exception e) {
            log.error("Failed while creating admin user", e);
        }
    }
}