package com.mediaconnect.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "watch_history")
public class WatchHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;

    private int progressSeconds; // Where the user left off

    private LocalDateTime lastWatched;

    public WatchHistory() {
    }

    public WatchHistory(User user, Movie movie, int progressSeconds) {
        this.user = user;
        this.movie = movie;
        this.progressSeconds = progressSeconds;
        this.lastWatched = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Movie getMovie() {
        return movie;
    }

    public void setMovie(Movie movie) {
        this.movie = movie;
    }

    public int getProgressSeconds() {
        return progressSeconds;
    }

    public void setProgressSeconds(int progressSeconds) {
        this.progressSeconds = progressSeconds;
    }

    public LocalDateTime getLastWatched() {
        return lastWatched;
    }

    public void setLastWatched(LocalDateTime lastWatched) {
        this.lastWatched = lastWatched;
    }
}
