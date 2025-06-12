package com.comintec.app.security;

import com.google.gson.Gson;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationEntryPoint.class);

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                       AuthenticationException authException) throws IOException, ServletException {
        
        logger.error("Error de autenticación: {}", authException.getMessage());
        
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        
        String message = "Acceso no autorizado";
        
        // Proporcionar mensajes más descriptivos basados en el tipo de excepción
        if (authException.getCause() != null) {
            message = authException.getCause().getMessage();
        } else if (authException.getMessage() != null) {
            if (authException.getMessage().contains("Full authentication")) {
                message = "Se requiere autenticación completa para acceder a este recurso";
            } else if (authException.getMessage().contains("Bad credentials")) {
                message = "Usuario o contraseña incorrectos";
            } else if (authException.getMessage().contains("JWT")) {
                message = "Token JWT inválido o expirado";
            }
        }
        
        final Map<String, Object> body = new HashMap<>();
        body.put("status", HttpServletResponse.SC_UNAUTHORIZED);
        body.put("error", "Unauthorized");
        body.put("message", message);
        body.put("path", request.getRequestURI());
        body.put("timestamp", new Date());
        
        try {
            final Gson gson = new Gson();
            String jsonResponse = gson.toJson(body);
            response.getWriter().write(jsonResponse);
            response.getWriter().flush();
        } catch (IOException e) {
            logger.error("Error al escribir la respuesta de error de autenticación", e);
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error interno del servidor");
        }
    }
}
