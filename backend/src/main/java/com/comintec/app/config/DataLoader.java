package com.comintec.app.config;

import com.comintec.app.model.Role;
import com.comintec.app.model.User;
// Using inner Role.RoleName enum
import com.comintec.app.repository.RoleRepository;
import com.comintec.app.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.HashSet;

@Slf4j
@Component
@RequiredArgsConstructor
@Profile("!test") // No ejecutar en pruebas
public class DataLoader {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    @Transactional
    public void loadData() {
        // Cargar roles si no existen
        if (roleRepository.count() == 0) {
            log.info("Cargando roles iniciales...");
            
            Role adminRole = new Role();
            adminRole.setName(Role.RoleName.ROLE_ADMIN);
            adminRole.setDescription("Administrador del sistema");
            
            Role userRole = new Role();
            userRole.setName(Role.RoleName.ROLE_USER);
            userRole.setDescription("Usuario estándar");
            
            roleRepository.saveAll(Arrays.asList(adminRole, userRole));
            log.info("Roles cargados exitosamente");
        }

        // Cargar usuario administrador si no existe
        if (userRepository.count() == 0) {
            log.info("Cargando usuario administrador...");
            
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFullName("Administrador del Sistema");
            admin.setEmail("admin@comintec.com");
            admin.setActive(true);
            
            // Asignar rol de administrador
            Role adminRole = roleRepository.findByName(Role.RoleName.ROLE_ADMIN)
                    .orElseThrow(() -> new RuntimeException("Rol de administrador no encontrado"));
            admin.setRoles(new HashSet<>(Arrays.asList(adminRole)));
            
            userRepository.save(admin);
            log.info("Usuario administrador creado con éxito");
        }
    }
}
