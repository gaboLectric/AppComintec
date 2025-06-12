package com.comintec.app.service;

import com.comintec.app.dto.JwtAuthenticationResponse;
import com.comintec.app.dto.LoginRequest;

public interface AuthService {
    JwtAuthenticationResponse authenticateUser(LoginRequest loginRequest);
}
