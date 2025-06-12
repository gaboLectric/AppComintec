package com.comintec.app.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

import org.springframework.util.StringUtils;

@Component
public class JwtTokenProvider {

    private static final Logger logger = LoggerFactory.getLogger(JwtTokenProvider.class);

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration-ms}")
    private long jwtExpirationInMs;
    
    @Value("${jwt.issuer}")
    private String jwtIssuer;

    public String generateToken(Authentication authentication) {
        try {
            if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
                logger.error("Cannot generate token: authentication is null or principal is not UserDetails");
                throw new IllegalArgumentException("Invalid authentication object");
            }

            UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();
            Date now = new Date();
            Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

            logger.debug("Generating JWT token for user: {}", userPrincipal.getUsername());
            
            String token = Jwts.builder()
                    .setSubject(userPrincipal.getUsername())
                    .setIssuer(jwtIssuer)
                    .setIssuedAt(now)
                    .setExpiration(expiryDate)
                    .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                    .compact();
                    
            logger.debug("Generated JWT token for user: {}, expires at: {}", userPrincipal.getUsername(), expiryDate);
            return token;
            
        } catch (Exception ex) {
            logger.error("Error generating JWT token: {}", ex.getMessage(), ex);
            throw new RuntimeException("Error generating JWT token", ex);
        }
    }
    
    private Key getSigningKey() {
        try {
            // Asegurarse de que la clave tenga al menos 512 bits (64 bytes) para HS512
            byte[] keyBytes = jwtSecret.getBytes();
            
            // Si la clave es demasiado corta, lanzar una excepción clara
            if (keyBytes.length * 8 < 512) { // 512 bits = 64 bytes
                throw new IllegalArgumentException("La clave secreta JWT debe tener al menos 64 caracteres (512 bits) para HS512");
            }
            
            // Usar la clave directamente si es lo suficientemente larga
            return Keys.hmacShaKeyFor(keyBytes);
        } catch (Exception ex) {
            logger.error("Error al generar la clave de firma JWT: {}", ex.getMessage(), ex);
            throw new RuntimeException("Error al configurar la clave secreta JWT", ex);
        }
    }

    public String getUsernameFromJWT(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return claims.getSubject();
        } catch (JwtException | IllegalArgumentException e) {
            logger.error("Error extracting username from JWT token: {}", e.getMessage());
            return null;
        }
    }

    public boolean validateToken(String authToken) {
        if (!StringUtils.hasText(authToken)) {
            logger.warn("JWT token is null or empty");
            return false;
        }

        try {
            Jws<Claims> claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(authToken);
                
            // Verificar que el token no haya expirado
            Date expiration = claims.getBody().getExpiration();
            if (expiration.before(new Date())) {
                logger.warn("JWT token is expired: {}", expiration);
                return false;
            }
            
            // Verificar que el emisor sea el correcto
            String issuer = claims.getBody().getIssuer();
            if (!jwtIssuer.equals(issuer)) {
                logger.warn("JWT token has invalid issuer: {}", issuer);
                return false;
            }
            
            logger.debug("JWT token validated successfully for subject: {}", claims.getBody().getSubject());
            return true;
            
        } catch (SecurityException ex) {
            logger.error("Invalid JWT signature: {}", ex.getMessage());
        } catch (MalformedJwtException ex) {
            logger.error("Invalid JWT token: {}", ex.getMessage());
        } catch (ExpiredJwtException ex) {
            logger.warn("JWT token is expired: {}", ex.getMessage());
        } catch (UnsupportedJwtException ex) {
            logger.error("JWT token is unsupported: {}", ex.getMessage());
        } catch (IllegalArgumentException ex) {
            logger.error("JWT claims string is empty: {}", ex.getMessage());
        } catch (JwtException ex) {
            logger.error("JWT validation failed: {}", ex.getMessage());
        } catch (Exception ex) {
            logger.error("Unexpected error validating JWT token: {}", ex.getMessage(), ex);
        }
        return false;
    }
}
