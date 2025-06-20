package com.comintec.app.controller;

import com.comintec.app.dto.request.ProjectRequest;
import com.comintec.app.dto.response.ProjectResponse;
import com.comintec.app.service.ProjectService;
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
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/projects")
@Tag(name = "Proyectos / Ventas", description = "API para la gestión de proyectos/ventas")
public class ProjectController {

    private final ProjectService projectService;

    /* ---------------------- GET LIST ----------------------- */
    @GetMapping
    @Operation(summary = "Obtener todos los proyectos paginados")
    @ApiResponse(responseCode = "200", description = "Lista de proyectos obtenida exitosamente")
    public ResponseEntity<Page<ProjectResponse>> getAllProjects(@PageableDefault(size = 20) Pageable pageable) {
        log.info("Solicitando lista de proyectos paginada");
        Page<ProjectResponse> projects = projectService.findAll(pageable);
        return ResponseEntity.ok(projects);
    }

    /* ---------------------- SEARCH ----------------------- */
    @GetMapping("/search")
    @Operation(summary = "Buscar proyectos por término de búsqueda")
    @ApiResponse(responseCode = "200", description = "Proyectos encontrados exitosamente")
    public ResponseEntity<Page<ProjectResponse>> searchProjects(
            @RequestParam String query,
            @PageableDefault(size = 20) Pageable pageable) {
        log.info("Buscando proyectos con término: {}", query);
        Page<ProjectResponse> projects = projectService.search(query, pageable);
        return ResponseEntity.ok(projects);
    }

    /* ---------------------- GET BY ID ----------------------- */
    @GetMapping("/{id}")
    @Operation(summary = "Obtener un proyecto por ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Proyecto encontrado exitosamente"),
            @ApiResponse(responseCode = "404", description = "Proyecto no encontrado",
                    content = @Content(schema = @Schema(implementation = Void.class)))
    })
    public ResponseEntity<ProjectResponse> getProjectById(
            @Parameter(description = "ID del proyecto a buscar") @PathVariable Long id) {
        log.info("Solicitando proyecto con ID: {}", id);
        ProjectResponse project = projectService.findById(id);
        return ResponseEntity.ok(project);
    }

    /* ---------------------- CREATE ----------------------- */
    @PostMapping
    @Operation(summary = "Crear un nuevo proyecto")
    @ApiResponse(responseCode = "201", description = "Proyecto creado exitosamente")
    public ResponseEntity<ProjectResponse> createProject(
            @Valid @RequestBody ProjectRequest projectRequest,
            @AuthenticationPrincipal UserDetails userDetails) {
        log.info("Creando nuevo proyecto: {}", projectRequest.getName());
        Long userId = Long.parseLong(userDetails.getUsername());
        ProjectResponse created = projectService.create(projectRequest, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /* ---------------------- UPDATE ----------------------- */
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un proyecto existente")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Proyecto actualizado exitosamente"),
            @ApiResponse(responseCode = "404", description = "Proyecto no encontrado",
                    content = @Content(schema = @Schema(implementation = Void.class)))
    })
    public ResponseEntity<ProjectResponse> updateProject(
            @Parameter(description = "ID del proyecto a actualizar") @PathVariable Long id,
            @Valid @RequestBody ProjectRequest projectRequest,
            @AuthenticationPrincipal UserDetails userDetails) {
        log.info("Actualizando proyecto con ID: {}", id);
        Long userId = Long.parseLong(userDetails.getUsername());
        ProjectResponse updated = projectService.update(id, projectRequest, userId);
        return ResponseEntity.ok(updated);
    }

    /* ---------------------- DELETE ----------------------- */
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar un proyecto (eliminación lógica)")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Proyecto eliminado exitosamente"),
            @ApiResponse(responseCode = "404", description = "Proyecto no encontrado",
                    content = @Content(schema = @Schema(implementation = Void.class)))
    })
    public ResponseEntity<Void> deleteProject(
            @Parameter(description = "ID del proyecto a eliminar") @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        log.info("Eliminando proyecto con ID: {}", id);
        Long userId = Long.parseLong(userDetails.getUsername());
        projectService.delete(id, userId);
        return ResponseEntity.noContent().build();
    }
}
