package com.mediaconnect.backend.dto;

public class AnalyticsResponse {
    private Long movieId;
    private String movieTitle;
    private String genre;
    private String language;
    private Long totalWatchers;

    public AnalyticsResponse(Long movieId, String movieTitle, String genre, String language, Long totalWatchers) {
        this.movieId = movieId;
        this.movieTitle = movieTitle;
        this.genre = genre;
        this.language = language;
        this.totalWatchers = totalWatchers;
    }

    public Long getMovieId() {
        return movieId;
    }

    public void setMovieId(Long movieId) {
        this.movieId = movieId;
    }

    public String getMovieTitle() {
        return movieTitle;
    }

    public void setMovieTitle(String movieTitle) {
        this.movieTitle = movieTitle;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public Long getTotalWatchers() {
        return totalWatchers;
    }

    public void setTotalWatchers(Long totalWatchers) {
        this.totalWatchers = totalWatchers;
    }
}
