package com.guvi.movieticket.config;

import com.guvi.movieticket.entity.Role;
import com.guvi.movieticket.entity.User;
import com.guvi.movieticket.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail("admin@movieticket.com")) {
            User admin = User.builder()
                    .fullName("System Admin")
                    .email("admin@movieticket.com")
                    .password(passwordEncoder.encode("Admin@123"))
                    .roles(Set.of(Role.ROLE_ADMIN, Role.ROLE_USER))
                    .enabled(true)
                    .build();
            userRepository.save(admin);
            log.info("Seeded default admin account -> admin@movieticket.com / Admin@123");
        }
    }
}
