package com.mediaconnect.backend.service;

import com.mediaconnect.backend.entity.Movie;
import com.mediaconnect.backend.entity.User;
import com.mediaconnect.backend.entity.WatchHistory;
import com.mediaconnect.backend.repository.MovieRepository;
import com.mediaconnect.backend.repository.UserRepository;
import com.mediaconnect.backend.repository.WatchHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.mediaconnect.backend.dto.AnalyticsResponse;

@Service
public class WatchHistoryServiceImpl implements WatchHistoryService {

    @Autowired
    private WatchHistoryRepository watchHistoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MovieRepository movieRepository;

    @Override
    public void saveProgress(Long userId, Long movieId, int seconds) {
        Optional<WatchHistory> existing = watchHistoryRepository.findByUserIdAndMovieId(userId, movieId);

        if (existing.isPresent()) {
            WatchHistory history = existing.get();
            history.setProgressSeconds(seconds);
            history.setLastWatched(LocalDateTime.now());
            watchHistoryRepository.save(history);
        } else {
            java.util.Optional<User> userOpt = userRepository.findById(userId);
            java.util.Optional<Movie> movieOpt = movieRepository.findById(movieId);

            if (userOpt.isPresent() && movieOpt.isPresent()) {
                WatchHistory history = new WatchHistory(userOpt.get(), movieOpt.get(), seconds);
                watchHistoryRepository.save(history);
            } else {
                throw new RuntimeException("User or Movie not found");
            }
        }
    }

    @Override
    public List<WatchHistory> getUserHistory(Long userId) {
        return watchHistoryRepository.findByUserIdOrderByLastWatchedDesc(userId);
    }

    @Override
    public WatchHistory getProgress(Long userId, Long movieId) {
        java.util.Optional<WatchHistory> historyOpt = watchHistoryRepository.findByUserIdAndMovieId(userId, movieId);
        if (historyOpt.isPresent()) {
            return historyOpt.get();
        }
        return null;
    }

    @Override
    public List<AnalyticsResponse> getEngagementAnalytics() {
        return watchHistoryRepository.findEngagementAnalytics();
    }
}
