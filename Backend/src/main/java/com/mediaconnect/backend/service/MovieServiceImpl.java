package com.mediaconnect.backend.service;

import com.mediaconnect.backend.entity.Movie;
import com.mediaconnect.backend.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mediaconnect.backend.repository.WatchHistoryRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class MovieServiceImpl implements MovieService {

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private WatchHistoryRepository watchHistoryRepository;

    @Override
    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    @Override
    public List<Movie> getTrendingMovies() {
        return movieRepository.findTop5ByOrderByViewsDesc();
    }

    @Override
    public List<Movie> getPopularMovies() {
        return movieRepository.findTop10ByOrderByViewsDesc();
    }

    @Override
    public List<Movie> searchMovies(String query) {
        return movieRepository.findByTitleContainingIgnoreCase(query);
    }

    @Override
    public List<Movie> filterByGenre(String genre) {
        return movieRepository.findByGenresContainingIgnoreCase(genre);
    }

    @Override
    public List<Movie> filterByLanguage(String language) {
        return movieRepository.findByLanguageIgnoreCase(language);
    }

    @Override
    public Movie saveMovie(Movie movie) {
        return movieRepository.save(movie);
    }

    @Override
    public Optional<Movie> getMovieById(Long id) {
        return movieRepository.findById(id);
    }

    @Override
    @Transactional
    public void deleteMovie(Long id) {
        // Delete associated watch history first to avoid FK constraint violations
        watchHistoryRepository.deleteByMovieId(id);
        movieRepository.deleteById(id);
    }

    @Override
    public List<String> getAvailableGenres() {
        List<String> genreStrings = movieRepository.findDistinctGenres();
        // Split comma-separated genres and collect unique values
        return genreStrings.stream()
                .flatMap(genres -> java.util.Arrays.stream(genres.split(",")))
                .map(String::trim)
                .filter(genre -> !genre.isEmpty())
                .distinct()
                .sorted()
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    public List<String> getAvailableLanguages() {
        return movieRepository.findDistinctLanguages().stream()
                .sorted()
                .collect(java.util.stream.Collectors.toList());
    }
}
