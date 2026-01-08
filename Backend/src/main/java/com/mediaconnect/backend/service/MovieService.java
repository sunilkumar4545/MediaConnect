package com.mediaconnect.backend.service;

import com.mediaconnect.backend.entity.Movie;
import java.util.List;
import java.util.Optional;

public interface MovieService {
    List<Movie> getAllMovies();

    List<Movie> getTrendingMovies();

    List<Movie> getPopularMovies();

    List<Movie> searchMovies(String query);

    List<Movie> filterByGenre(String genre);

    List<Movie> filterByLanguage(String language);

    Movie saveMovie(Movie movie);

    Optional<Movie> getMovieById(Long id);

    void deleteMovie(Long id);

    List<String> getAvailableGenres();

    List<String> getAvailableLanguages();
}
