package com.comintec.app.service.impl;

import com.comintec.app.security.JwtTokenProvider;
import com.comintec.app.dto.JwtAuthenticationResponse;
import com.comintec.app.dto.LoginRequest;
import com.comintec.app.model.User;
import com.comintec.app.repository.UserRepository;
import com.comintec.app.service.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;

    public AuthServiceImpl(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            JwtTokenProvider tokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.tokenProvider = tokenProvider;
    }

    @Override
    public JwtAuthenticationResponse authenticateUser(LoginRequest loginRequest) {
        logger.info("Iniciando autenticación para usuario: {}", loginRequest.getUsername());
        
        try {
            // 1. Intentar autenticar con el AuthenticationManager
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
                )
            );
            
            // 2. Si la autenticación es exitosa, establecer el contexto de seguridad
            SecurityContextHolder.getContext().setAuthentication(authentication);
            logger.info("Autenticación exitosa para usuario: {}", loginRequest.getUsername());
            
            // 3. Generar el token JWT
            String jwt = tokenProvider.generateToken(authentication);
            logger.debug("Token JWT generado para usuario: {}", loginRequest.getUsername());
            
            // 4. Obtener información adicional del usuario
            User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado después de autenticación exitosa"));
            
            // 5. Retornar la respuesta con el token
            return new JwtAuthenticationResponse(
                jwt,
                user.getUsername()
            );
            
        } catch (AuthenticationException e) {
            logger.error("Error de autenticación para usuario: " + loginRequest.getUsername(), e);
            throw new BadCredentialsException("Credenciales inválidas");
        } catch (Exception e) {
            logger.error("Error inesperado durante la autenticación", e);
            throw new RuntimeException("Error durante la autenticación", e);
        }
    }
}
