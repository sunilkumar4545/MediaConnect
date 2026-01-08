package com.mediaconnect.backend.controller;

import com.mediaconnect.backend.dto.UserDTO;
import com.mediaconnect.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName(); // In CustomUserDetailsService, username is email

        UserDTO userDTO = userService.getUserByEmail(email);
        if (userDTO != null) {
            return ResponseEntity.ok(userDTO);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/me")
    public ResponseEntity<UserDTO> updateCurrentUser(@RequestBody UserDTO userDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        UserDTO updatedUser = userService.updateUser(email, userDTO);
        if (updatedUser != null) {
            return ResponseEntity.ok(updatedUser);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribe(@RequestBody java.util.Map<String, String> payload) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            String plan = payload.get("plan");

            if (plan == null || plan.isEmpty()) {
                return ResponseEntity.badRequest().body("Plan is required.");
            }

            // Simple validation for known plans (optional but good practice)
            if (!plan.equals("BASIC") && !plan.equals("STANDARD") && !plan.equals("PREMIUM")) {
                // We allow it for flexibility but logging a warning might be good,
                // or we strict reject. Let's strict reject to be "Correct".
                return ResponseEntity.badRequest().body("Invalid plan type.");
            }

            System.out.println("Processing subscription for: " + email + " Plan: " + plan);

            UserDTO updatedUser = userService.subscribe(email, plan);
            if (updatedUser != null) {
                return ResponseEntity.ok(updatedUser);
            }
            return ResponseEntity.badRequest().body("Failed to update subscription. User not found.");
        } catch (Exception e) {
            System.err.println("Error during subscription: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Internal Error: " + e.getMessage());
        }
    }
}
