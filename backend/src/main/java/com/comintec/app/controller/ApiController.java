package com.comintec.app.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ApiController {
    
    @GetMapping("/saludo")
    public String saludar() {
        return "¡Hola desde el backend de Spring Boot!";
    }
}
