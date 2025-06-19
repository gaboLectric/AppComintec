package com.comintec.app.dto.response;

import java.util.Set;

public class UserResponse {
    private Long id;
    private String username;
    private Boolean active;
    private Set<String> roles;
    private Long departmentId; // ID del departamento asignado (null para admins)
    private Boolean isManager; // true si es manager del departamento

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    public Set<String> getRoles() { return roles; }
    public void setRoles(Set<String> roles) { this.roles = roles; }
    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }
    public Boolean getIsManager() { return isManager; }
    public void setIsManager(Boolean isManager) { this.isManager = isManager; }
}
