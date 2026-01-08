package com.mediaconnect.backend.dto;

public class AuthResponse {
    private String token;
    private String role;
    private Long userId;
    private UserDTO user;

    public AuthResponse(String token, String role, Long userId, UserDTO user) {
        this.token = token;
        this.role = role;
        this.userId = userId;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public String getRole() {
        return role;
    }

    public Long getUserId() {
        return userId;
    }

    public UserDTO getUser() {
        return user;
    }
}
