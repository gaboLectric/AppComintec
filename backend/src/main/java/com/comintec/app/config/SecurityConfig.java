package com.comintec.app.config;

import com.comintec.app.security.IpAuthenticationFilter;
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
    private final IpAuthenticationFilter ipAuthenticationFilter;

    public SecurityConfig(UserDetailsService userDetailsService, 
                         JwtAuthenticationEntryPoint unauthorizedHandler,
                         JwtAuthenticationFilter jwtAuthenticationFilter,
                         IpAuthenticationFilter ipAuthenticationFilter) {
        this.userDetailsService = userDetailsService;
        this.unauthorizedHandler = unauthorizedHandler;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.ipAuthenticationFilter = ipAuthenticationFilter;
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
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .exceptionHandling(exception -> exception
                .authenticationEntryPoint(unauthorizedHandler)
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth
                // Permitir acceso a recursos estáticos y páginas de autenticación
                .requestMatchers(
                    "/",
                    "/index.html",
                    "/html/index.html",
                    "/main.html",
                    "/html/main.html",
                    "/usuarios.html",
                    "/html/usuarios.html",
                    "/css/**",
                    "/js/**",
                    "/assets/**",
                    "/static/**",
                    "/vite.svg",
                    "/favicon.ico"
                ).permitAll()
                // Permitir acceso a la autenticación
                .requestMatchers(
                    "/api/auth/**"
                ).permitAll()
                // Permitir acceso a archivos estáticos comunes
                .requestMatchers(
                    "/*.css",
                    "/*.js",
                    "/*.map",
                    "/*.png",
                    "/*.jpg",
                    "/*.jpeg",
                    "/*.gif",
                    "/*.ico",
                    "/*.svg",
                    "/*.woff",
                    "/*.woff2",
                    "/*.ttf",
                    "/*.eot"
                ).permitAll()
                // Permitir acceso a endpoints de autenticación y documentación
                .requestMatchers(
                    "/api/auth/**",
                    "/error",
                    "/v3/api-docs/**",
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/h2-console/**",
                    "/actuator/health"
                ).permitAll()
                // Endpoints protegidos
                .requestMatchers("/api/secure/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/secure/user/**").hasAnyRole("USER", "ADMIN")
                // Todas las demás solicitudes requieren autenticación
                .anyRequest().authenticated()
            )
            // Add IP filter before JWT filter
            .addFilterBefore(ipAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

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
        // Allow frontend and development servers
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",   // React default port
            "http://localhost:5173",   // Vite default dev server
            "http://localhost:8080"    // Backend
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList(
            "Authorization", 
            "Content-Type", 
            "x-auth-token", 
            "Accept",
            "X-Requested-With",
            "Cache-Control"
        ));
        configuration.setExposedHeaders(Arrays.asList(
            "x-auth-token",
            "Authorization"
        ));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
