package com.comintec.app.config;

import com.comintec.app.security.JwtAuthenticationEntryPoint;
import com.comintec.app.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final UserDetailsService userDetailsService;
    private final JwtAuthenticationEntryPoint unauthorizedHandler;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(UserDetailsService userDetailsService, 
                         JwtAuthenticationEntryPoint unauthorizedHandler,
                         JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.userDetailsService = userDetailsService;
        this.unauthorizedHandler = unauthorizedHandler;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // Asegurarnos de que usamos BCrypt con fuerza 10 (valor por defecto)
        return new BCryptPasswordEncoder(10);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // Configuración básica
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // Configuración de autorización
        http.authorizeHttpRequests(auth -> 
            auth
                // Permitir acceso sin autenticación a los endpoints públicos
                .requestMatchers(
                    "/",
                    "/*.html",
                    "/*.css",
                    "/*.js",
                    "/favicon.ico",
                    "/vite.svg",
                    "/static/**",
                    "/resources/**",
                    "/public/**",
                    "/webjars/**",
                    "/css/**",
                    "/js/**",
                    "/assets/**",
                    "/html/**"
                ).permitAll()
                .requestMatchers(
                    "/api/auth/**"
                ).permitAll()
                // Permitir acceso a la consola H2 solo en desarrollo
                .requestMatchers(
                    "/h2-console/**"
                ).permitAll()
                .requestMatchers(
                    "/api/test/public/**",
                    "/api/secure/public",
                    "/error"
                ).permitAll()
                // Endpoints protegidos
                .requestMatchers("/api/secure/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/secure/user/**").hasAnyRole("USER", "ADMIN")
                // Todas las demás solicitudes requieren autenticación
                .anyRequest().authenticated()
        );

        // Asegurarse de que el filtro JWT se ejecute antes del filtro de autenticación de nombre de usuario y contraseña
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        // Configurar autenticación
        http.authenticationProvider(authenticationProvider());
        
        // Configuración para la consola H2 (solo para desarrollo)
        http.headers(headers -> headers
            .frameOptions(frameOption -> frameOption.sameOrigin())
            .cacheControl(cache -> {})
            .contentTypeOptions(contentType -> {})
        );
        
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Allow Vite dev server and any other necessary origins
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:5173",  // Vite default dev server
            "http://localhost:5175",  // Vite dev server (alternative port)
            "http://localhost:8080"   // Backend itself
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "x-auth-token", "Accept"));
        configuration.setExposedHeaders(Collections.singletonList("x-auth-token"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
