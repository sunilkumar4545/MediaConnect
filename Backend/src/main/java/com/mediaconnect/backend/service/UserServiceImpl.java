package com.mediaconnect.backend.service;

import com.mediaconnect.backend.dto.UserDTO;
import com.mediaconnect.backend.entity.User;
import com.mediaconnect.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public java.util.List<UserDTO> getAllUsers() {
        java.util.List<User> users = userRepository.findAll();
        java.util.List<UserDTO> userDTOs = new java.util.ArrayList<>();
        for (User user : users) {
            userDTOs.add(mapToDTO(user));
        }
        return userDTOs;
    }

    @Override
    public UserDTO getUserByEmail(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            checkSubscriptionStatus(user);
            return mapToDTO(user);
        }
        return null;
    }

    @Override
    public UserDTO updateUser(String email, UserDTO userDTO) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();

            // Update Full Name
            if (userDTO.getFullName() != null && !userDTO.getFullName().isEmpty()) {
                user.setFullName(userDTO.getFullName());
            }

            // Update Genres if provided
            if (userDTO.getGenres() != null) {
                user.setGenres(userDTO.getGenres());
            }

            // Update Email if changed
            if (userDTO.getEmail() != null && !userDTO.getEmail().isEmpty()
                    && !userDTO.getEmail().equals(user.getEmail())) {
                // Check if new email is already taken
                if (userRepository.existsByEmail(userDTO.getEmail())) {
                    throw new RuntimeException("Email already in use");
                }
                user.setEmail(userDTO.getEmail());
            }

            userRepository.save(user);
            return mapToDTO(user);
        }
        return null;
    }

    @Override
    public UserDTO subscribe(String email, String plan) {
        System.out.println("UserService: subscribing " + email + " to " + plan);
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setCurrentPlan(plan);
            user.setSubscriptionStatus("ACTIVE");
            user.setSubscriptionExpiry(java.time.LocalDateTime.now().plusDays(30));
            System.out
                    .println("UserService: Saving user with ACTIVE status and expiry: " + user.getSubscriptionExpiry());
            userRepository.save(user);
            return mapToDTO(user);
        }
        System.out.println("UserService: User not found for email: " + email);
        return null;
    }

    private void checkSubscriptionStatus(User user) {
        if ("ACTIVE".equals(user.getSubscriptionStatus())) {
            if (user.getSubscriptionExpiry() != null
                    && user.getSubscriptionExpiry().isBefore(java.time.LocalDateTime.now())) {
                user.setSubscriptionStatus("INACTIVE");
                userRepository.save(user);
            }
        }
    }

    private UserDTO mapToDTO(User user) {
        return new UserDTO(
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
