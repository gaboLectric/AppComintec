package com.comintec.app.service.impl;

import com.comintec.app.dto.request.UserRequest;
import com.comintec.app.dto.response.UserResponse;
import com.comintec.app.model.Role;
import com.comintec.app.model.User;
import com.comintec.app.repository.RoleRepository;
import com.comintec.app.repository.UserRepository;
import com.comintec.app.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.persistence.EntityManager;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    @Autowired
    private EntityManager entityManager;

    @Override
    @Transactional
    public UserResponse createUser(UserRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setActive(request.getActive() != null ? request.getActive() : true);
        if (request.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        Set<Role> roles = new HashSet<>();
        if (request.getRoles() != null) {
            for (String roleName : request.getRoles()) {
                Role role = roleRepository.findByName(Role.RoleName.valueOf(roleName))
                        .orElseThrow(() -> new EntityNotFoundException("Rol no encontrado: " + roleName));
                roles.add(role);
            }
        }
        user.setRoles(roles);
        user = userRepository.save(user);
        return toResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateUser(Long id, UserRequest request) {
        logger.info("[DEBUG] Payload recibido para updateUser: username={}, active={}, roles={}", request.getUsername(), request.getActive(), request.getRoles());
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));
        user.setActive(request.getActive() != null ? request.getActive() : user.getActive());
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        if (request.getRoles() != null) {
            // Limpiar roles actuales
            user.getRoles().clear();
            userRepository.save(user);
            entityManager.flush(); // Forzar sincronización con la base de datos
            // Asignar nuevos roles uno a uno para evitar ciclos
            for (String roleName : request.getRoles()) {
                logger.info("[DEBUG] Procesando roleName: {}", roleName);
                Role role = roleRepository.findByName(Role.RoleName.valueOf(roleName))
                        .orElseThrow(() -> new EntityNotFoundException("Rol no encontrado: " + roleName));
                user.getRoles().add(role);
            }
        }
        user = userRepository.save(user);
        return toResponse(user);
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));
        return toResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(this::toResponse);
    }

    private UserResponse toResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setActive(user.getActive());
        response.setRoles(user.getRoles().stream().map(r -> r.getName().name()).collect(Collectors.toSet()));
        return response;
    }
}
