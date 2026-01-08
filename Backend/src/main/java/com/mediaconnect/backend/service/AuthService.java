package com.mediaconnect.backend.service;

import com.mediaconnect.backend.dto.AuthRequest;
import com.mediaconnect.backend.dto.AuthResponse;

public interface AuthService {
    AuthResponse register(AuthRequest request);

    AuthResponse login(AuthRequest request);
}
