package com.comintec.app.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.Set;

public class UserRequest {
    @NotBlank(message = "El nombre de usuario es obligatorio")
    @Size(max = 50)
    private String username;

    @Size(min = 6, max = 100)
    private String password;

    private Boolean active = true;

    private Set<String> roles;

    // Getters y setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    public Set<String> getRoles() { return roles; }
    public void setRoles(Set<String> roles) { this.roles = roles; }
}
