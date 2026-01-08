package com.mediaconnect.backend.controller;

import com.mediaconnect.backend.entity.Movie;
import com.mediaconnect.backend.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    @Autowired
    private MovieService movieService;

    @GetMapping
    public List<Movie> getAllMovies() {
        return movieService.getAllMovies();
    }

    @GetMapping("/{id}")
    public org.springframework.http.ResponseEntity<Movie> getMovieById(@PathVariable Long id) {
        java.util.Optional<Movie> movie = movieService.getMovieById(id);
        if (movie.isPresent()) {
            return org.springframework.http.ResponseEntity.ok(movie.get());
        } else {
            return org.springframework.http.ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/trending")
    public List<Movie> getTrending() {
        return movieService.getTrendingMovies();
    }

    @GetMapping("/popular")
    public List<Movie> getPopular() {
        return movieService.getPopularMovies();
    }

    @GetMapping("/search")
    public List<Movie> search(@RequestParam String query) {
        return movieService.searchMovies(query);
    }

    @GetMapping("/filter/genre")
    public List<Movie> filterByGenre(@RequestParam String genre) {
        return movieService.filterByGenre(genre);
    }

    @GetMapping("/filter/language")
    public List<Movie> filterByLanguage(@RequestParam String language) {
        return movieService.filterByLanguage(language);
    }

    @GetMapping("/filters/genres")
    public List<String> getAvailableGenres() {
        return movieService.getAvailableGenres();
    }

    @GetMapping("/filters/languages")
    public List<String> getAvailableLanguages() {
        return movieService.getAvailableLanguages();
    }
}
