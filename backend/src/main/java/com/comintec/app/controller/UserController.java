package com.comintec.app.controller;

import com.comintec.app.dto.request.UserRequest;
import com.comintec.app.dto.response.UserResponse;
import com.comintec.app.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
@Tag(name = "Usuarios", description = "API para la gestión de usuarios")
public class UserController {
    private final UserService userService;

    @GetMapping
    @Operation(summary = "Obtener todos los usuarios paginados")
    @ApiResponse(responseCode = "200", description = "Lista de usuarios obtenida exitosamente")
    public ResponseEntity<Page<UserResponse>> getAllUsers(@PageableDefault(size = 20) Pageable pageable) {
        log.info("Solicitando lista de usuarios paginada");
        Page<UserResponse> users = userService.getAllUsers(pageable);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener un usuario por ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Usuario encontrado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado", content = @Content(schema = @Schema(implementation = Void.class)))
    })
    public ResponseEntity<UserResponse> getUserById(@Parameter(description = "ID del usuario a buscar") @PathVariable Long id) {
        log.info("Solicitando usuario con ID: {}", id);
        UserResponse user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @PostMapping
    @Operation(summary = "Crear un nuevo usuario")
    @ApiResponse(responseCode = "201", description = "Usuario creado exitosamente")
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody UserRequest userRequest) {
        log.info("Creando nuevo usuario: {}", userRequest.getUsername());
        UserResponse createdUser = userService.createUser(userRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un usuario existente")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Usuario actualizado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado", content = @Content(schema = @Schema(implementation = Void.class)))
    })
    public ResponseEntity<UserResponse> updateUser(@Parameter(description = "ID del usuario a actualizar") @PathVariable Long id,
                                                   @Valid @RequestBody UserRequest userRequest) {
        log.info("Actualizando usuario con ID: {}", id);
        UserResponse updatedUser = userService.updateUser(id, userRequest);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar un usuario")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Usuario eliminado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado", content = @Content(schema = @Schema(implementation = Void.class)))
    })
    public ResponseEntity<Void> deleteUser(@Parameter(description = "ID del usuario a eliminar") @PathVariable Long id) {
        log.info("Eliminando usuario con ID: {}", id);
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
