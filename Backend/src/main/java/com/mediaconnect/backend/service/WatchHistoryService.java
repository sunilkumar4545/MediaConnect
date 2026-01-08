package com.mediaconnect.backend.service;

import com.mediaconnect.backend.dto.AnalyticsResponse;
import com.mediaconnect.backend.entity.WatchHistory;
import java.util.List;

public interface WatchHistoryService {
    void saveProgress(Long userId, Long movieId, int seconds);

    List<WatchHistory> getUserHistory(Long userId);

    WatchHistory getProgress(Long userId, Long movieId);

    List<AnalyticsResponse> getEngagementAnalytics();
}
