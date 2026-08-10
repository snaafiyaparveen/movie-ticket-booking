package com.guvi.movieticket.service;

import com.guvi.movieticket.dto.request.LoginRequest;
import com.guvi.movieticket.dto.request.RegisterRequest;
import com.guvi.movieticket.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
