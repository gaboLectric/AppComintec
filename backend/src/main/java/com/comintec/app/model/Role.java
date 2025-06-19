package com.comintec.app.model;

import lombok.Data;
import jakarta.persistence.*;

@Data
@Entity
@Table(name = "roles")
public class Role {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Enumerated(EnumType.STRING)
    @Column(unique = true, nullable = false)
    private RoleName name;
    
    @Column(length = 255)
    private String description;
    
    public enum RoleName {
        ROLE_ADMIN,
        ROLE_MANAGER,
        ROLE_USER
    }
}
