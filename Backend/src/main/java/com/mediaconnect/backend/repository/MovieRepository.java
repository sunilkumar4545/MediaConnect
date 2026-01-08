package com.mediaconnect.backend.repository;

import com.mediaconnect.backend.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {

    // Find by title containing (search)
    List<Movie> findByTitleContainingIgnoreCase(String title);

    // Filter by genre
    List<Movie> findByGenresContainingIgnoreCase(String genre);

    // Filter by language
    List<Movie> findByLanguageIgnoreCase(String language);

    // Trending (Top 5 by views)
    @Query(value = "SELECT * FROM movies ORDER BY views DESC LIMIT 5", nativeQuery = true)
    List<Movie> findTop5ByOrderByViewsDesc();

    // Popular (Top 10 by views)
    @Query(value = "SELECT * FROM movies ORDER BY views DESC LIMIT 10", nativeQuery = true)
    List<Movie> findTop10ByOrderByViewsDesc();

    // Get all distinct genres (returns all genre strings, we'll split them in
    // service)
    @Query(value = "SELECT DISTINCT genres FROM movies WHERE genres IS NOT NULL AND genres != ''", nativeQuery = true)
    List<String> findDistinctGenres();

    // Get all distinct languages
    @Query(value = "SELECT DISTINCT language FROM movies WHERE language IS NOT NULL AND language != ''", nativeQuery = true)
    List<String> findDistinctLanguages();
}
