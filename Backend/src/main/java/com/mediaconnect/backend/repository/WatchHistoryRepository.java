package com.mediaconnect.backend.repository;

import com.mediaconnect.backend.entity.WatchHistory;
import com.mediaconnect.backend.dto.AnalyticsResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WatchHistoryRepository extends JpaRepository<WatchHistory, Long> {
    Optional<WatchHistory> findByUserIdAndMovieId(Long userId, Long movieId);

    List<WatchHistory> findByUserIdOrderByLastWatchedDesc(Long userId);

    // Top 5 recently watched for "Continue Watching"
    List<WatchHistory> findTop5ByUserIdOrderByLastWatchedDesc(Long userId);

    @Query("SELECT new com.mediaconnect.backend.dto.AnalyticsResponse(" +
            "m.id, m.title, m.genres, m.language, COUNT(DISTINCT wh.user.id)) " +
            "FROM WatchHistory wh JOIN wh.movie m " +
            "GROUP BY m.id, m.title, m.genres, m.language " +
            "ORDER BY COUNT(DISTINCT wh.user.id) DESC")
    List<AnalyticsResponse> findEngagementAnalytics();

    void deleteByMovieId(Long movieId);
}
