package com.comintec.app.controller;

import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;

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
    
    @GetMapping(value = "/main-html", produces = MediaType.TEXT_HTML_VALUE)
    public String getMainHtml() throws Exception {
        ClassPathResource htmlFile = new ClassPathResource("static/html/main.html");
        return StreamUtils.copyToString(htmlFile.getInputStream(), StandardCharsets.UTF_8);
    }
}
