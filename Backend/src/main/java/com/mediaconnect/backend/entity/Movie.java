package com.mediaconnect.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "movies")
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private int releaseYear; // 'year' is a reserved keyword in some DBs
    private String duration; // e.g. "2h 15m"
    private String genres; // Comma separated, e.g. "Action,Sci-Fi"
    private String language; // e.g. "English"
    private String posterUrl; // URL to image

    @Column(length = 1000)
    private String description; // Short summary of the movie

    private String videoPath; // Stores relative path: /videos/filename.mp4

    // Simple popularity metric for now
    private int views;

    public Movie() {
    }

    public Movie(String title, int releaseYear, String duration, String genres, String language, String posterUrl,
            String description, String videoPath) {
        this.title = title;
        this.releaseYear = releaseYear;
        this.duration = duration;
        this.genres = genres;
        this.language = language;
        this.posterUrl = posterUrl;
        this.description = description;
        this.videoPath = videoPath;
        this.views = 0;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getReleaseYear() {
        return releaseYear;
    }

    public void setReleaseYear(int releaseYear) {
        this.releaseYear = releaseYear;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getGenres() {
        return genres;
    }

    public void setGenres(String genres) {
        this.genres = genres;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getPosterUrl() {
        return posterUrl;
    }

    public void setPosterUrl(String posterUrl) {
        this.posterUrl = posterUrl;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getVideoPath() {
        return videoPath;
    }

    public void setVideoPath(String videoPath) {
        this.videoPath = videoPath;
    }

    public int getViews() {
        return views;
    }

    public void setViews(int views) {
        this.views = views;
    }
}
