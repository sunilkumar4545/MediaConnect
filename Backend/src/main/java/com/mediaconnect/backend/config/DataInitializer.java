package com.mediaconnect.backend.config;

import com.mediaconnect.backend.entity.Movie;
import com.mediaconnect.backend.entity.User;
import com.mediaconnect.backend.repository.MovieRepository;
import com.mediaconnect.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 1. Create Admin
        if (!userRepository.existsByEmail("admin@mediaconnect.com")) {
            User admin = new User();
            admin.setEmail("admin@mediaconnect.com");
            admin.setFullName("Admin User");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ADMIN");
            admin.setGenres("All");
            userRepository.save(admin);
        }

    }
}
