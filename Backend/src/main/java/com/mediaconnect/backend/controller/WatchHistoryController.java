package com.mediaconnect.backend.controller;

import com.mediaconnect.backend.entity.WatchHistory;
import com.mediaconnect.backend.service.WatchHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/watch-history")
public class WatchHistoryController {

    @Autowired
    private WatchHistoryService watchHistoryService;

    @Autowired
    private com.mediaconnect.backend.repository.UserRepository userRepository;

    @PostMapping("/save")
    public ResponseEntity<?> saveProgress(@RequestBody Map<String, Object> payload) {
        Long userId = Long.valueOf(payload.get("userId").toString());
        Long movieId = Long.valueOf(payload.get("movieId").toString());
        int seconds = Integer.parseInt(payload.get("seconds").toString());

        watchHistoryService.saveProgress(userId, movieId, seconds);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user/{userId}")
    public List<WatchHistory> getUserHistory(@PathVariable Long userId) {
        return watchHistoryService.getUserHistory(userId);
    }

    @GetMapping("/me")
    public ResponseEntity<List<WatchHistory>> getMyHistory() {
        org.springframework.security.core.Authentication authentication = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication();
        String email = authentication.getName();

        java.util.Optional<com.mediaconnect.backend.entity.User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            return ResponseEntity.ok(watchHistoryService.getUserHistory(userOpt.get().getId()));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/progress")
    public ResponseEntity<?> getProgress(@RequestParam Long userId, @RequestParam Long movieId) {
        WatchHistory history = watchHistoryService.getProgress(userId, movieId);
        if (history != null) {
            return ResponseEntity.ok(history);
        }
        return ResponseEntity.notFound().build();
    }

}
