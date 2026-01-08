package com.mediaconnect.backend.controller;

import com.mediaconnect.backend.dto.AnalyticsResponse;
import com.mediaconnect.backend.dto.UserDTO;
import com.mediaconnect.backend.entity.Movie;
import com.mediaconnect.backend.service.UserService;
import com.mediaconnect.backend.service.WatchHistoryService;
import com.mediaconnect.backend.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private MovieService movieService;

    @Autowired
    private WatchHistoryService watchHistoryService;

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        System.out.println("AdminController: Received request for all users");
        List<UserDTO> users = userService.getAllUsers();
        System.out.println("AdminController: Returning " + users.size() + " users");
        return ResponseEntity.ok(users);
    }

    @GetMapping("/movies")
    public ResponseEntity<List<Movie>> getAllMovies() {
        System.out.println("AdminController: Received request for all movies");
        List<Movie> movies = movieService.getAllMovies();
        System.out.println("AdminController: Returning " + movies.size() + " movies");
        return ResponseEntity.ok(movies);
    }

    @PostMapping("/movies")
    public ResponseEntity<Movie> createMovie(@RequestBody Movie movie) {
        return ResponseEntity.ok(movieService.saveMovie(movie));
    }

    @PutMapping("/movies/{id}")
    public ResponseEntity<Movie> updateMovie(@PathVariable Long id, @RequestBody Movie movieDetails) {
        java.util.Optional<Movie> movieOpt = movieService.getMovieById(id);
        if (movieOpt.isPresent()) {
            Movie existingMovie = movieOpt.get();
            existingMovie.setTitle(movieDetails.getTitle());
            existingMovie.setReleaseYear(movieDetails.getReleaseYear());
            existingMovie.setDuration(movieDetails.getDuration());
            existingMovie.setGenres(movieDetails.getGenres());
            existingMovie.setLanguage(movieDetails.getLanguage());
            existingMovie.setPosterUrl(movieDetails.getPosterUrl());
            existingMovie.setDescription(movieDetails.getDescription());
            existingMovie.setVideoPath(movieDetails.getVideoPath());

            Movie updatedMovie = movieService.saveMovie(existingMovie);
            return ResponseEntity.ok(updatedMovie);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/movies/{id}")
    public ResponseEntity<Void> deleteMovie(@PathVariable Long id) {
        movieService.deleteMovie(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/analytics")
    public ResponseEntity<List<AnalyticsResponse>> getEngagementAnalytics() {
        System.out.println("AdminController: Received request for analytics");
        List<AnalyticsResponse> data = watchHistoryService.getEngagementAnalytics();
        System.out.println("AdminController: Returning " + data.size() + " analytics records");
        return ResponseEntity.ok(data);
    }
}
