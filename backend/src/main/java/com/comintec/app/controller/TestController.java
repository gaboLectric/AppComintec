package com.comintec.app.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/public")
    public String publicEndpoint() {
        return "This is a public endpoint. No authentication required.";
    }

    @GetMapping("/private")
    public String privateEndpoint() {
        return "This is a private endpoint. Authentication is required.";
    }
}
