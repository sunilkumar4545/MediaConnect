package com.mediaconnect.backend.dto;

public class AuthRequest {
    private String email;
    private String password;

    // For Register
    private String fullName;
    private String[] genrePreferences;

    // Getters and Setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String[] getGenrePreferences() {
        return genrePreferences;
    }

    public void setGenrePreferences(String[] genrePreferences) {
        this.genrePreferences = genrePreferences;
    }
}
