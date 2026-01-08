package com.mediaconnect.backend.dto;

public class UserDTO {
    private Long id;
    private String fullName;
    private String email;
    private String genres;
    private String role;
    private String subscriptionStatus;
    private String currentPlan;
    private String subscriptionExpiry;

    // Constructors
    public UserDTO() {
    }

    public UserDTO(Long id, String fullName, String email, String genres, String role, String subscriptionStatus,
            String currentPlan, String subscriptionExpiry) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.genres = genres;
        this.role = role;
        this.subscriptionStatus = subscriptionStatus;
        this.currentPlan = currentPlan;
        this.subscriptionExpiry = subscriptionExpiry;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getGenres() {
        return genres;
    }

    public void setGenres(String genres) {
        this.genres = genres;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getSubscriptionStatus() {
        return subscriptionStatus;
    }

    public void setSubscriptionStatus(String subscriptionStatus) {
        this.subscriptionStatus = subscriptionStatus;
    }

    public String getCurrentPlan() {
        return currentPlan;
    }

    public void setCurrentPlan(String currentPlan) {
        this.currentPlan = currentPlan;
    }

    public String getSubscriptionExpiry() {
        return subscriptionExpiry;
    }

    public void setSubscriptionExpiry(String subscriptionExpiry) {
        this.subscriptionExpiry = subscriptionExpiry;
    }
}
