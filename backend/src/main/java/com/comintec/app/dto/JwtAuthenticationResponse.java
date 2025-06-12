package com.comintec.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtAuthenticationResponse {
    private String accessToken;
    private String tokenType = "Bearer";
    private String username;
    private String fullName;
    
    public JwtAuthenticationResponse(String accessToken, String username, String fullName) {
        this.accessToken = accessToken;
        this.username = username;
        this.fullName = fullName;
    }
}
