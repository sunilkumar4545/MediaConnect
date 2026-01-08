package com.mediaconnect.backend.service;

import com.mediaconnect.backend.dto.AuthRequest;
import com.mediaconnect.backend.dto.AuthResponse;
import com.mediaconnect.backend.entity.User;
import com.mediaconnect.backend.repository.UserRepository;
import com.mediaconnect.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Override
    public AuthResponse register(AuthRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER"); // Default role
        user.setSubscriptionStatus("INACTIVE");
        user.setCurrentPlan("NONE");

        // Convert array to comma separated string
        if (request.getGenrePreferences() != null) {
            user.setGenres(String.join(",", request.getGenrePreferences()));
        } else {
            user.setGenres("");
        }

        User savedUser = userRepository.save(user);
        String token = jwtUtil.generateToken(savedUser.getEmail());

        return new AuthResponse(token, savedUser.getRole(), savedUser.getId(), mapToDTO(savedUser));
    }

    @Override
    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        java.util.Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        User user = userOpt.get();

        String token = jwtUtil.generateToken(user.getEmail());

        return new AuthResponse(token, user.getRole(), user.getId(), mapToDTO(user));
    }

    private com.mediaconnect.backend.dto.UserDTO mapToDTO(User user) {
        return new com.mediaconnect.backend.dto.UserDTO(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getGenres(),
                user.getRole(),
                user.getSubscriptionStatus(),
                user.getCurrentPlan(),
                user.getSubscriptionExpiry() != null ? user.getSubscriptionExpiry().toString() : null);
    }
}
