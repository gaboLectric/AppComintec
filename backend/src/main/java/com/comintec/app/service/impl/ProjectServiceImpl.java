package com.comintec.app.service.impl;

import com.comintec.app.dto.request.ProjectRequest;
import com.comintec.app.dto.response.ProjectResponse;
import com.comintec.app.exception.ResourceNotFoundException;
import com.comintec.app.mapper.ProjectMapper;
import com.comintec.app.model.Customer;
import com.comintec.app.model.Project;
import com.comintec.app.model.User;
import com.comintec.app.repository.CustomerRepository;
import com.comintec.app.repository.ProjectRepository;
import com.comintec.app.repository.UserRepository;
import com.comintec.app.service.ProjectService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final ProjectMapper projectMapper;

    /* ------------------- Read operations ------------------- */
    @Override
    @Transactional(readOnly = true)
    public Page<ProjectResponse> findAll(Pageable pageable) {
        log.debug("Buscando todos los proyectos paginados");
        return projectRepository.findByActiveTrue(pageable)
                .map(projectMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProjectResponse> search(String searchTerm, Pageable pageable) {
        log.debug("Buscando proyectos con término: {}", searchTerm);
        return projectRepository.search(searchTerm, pageable)
                .map(projectMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectResponse findById(Long id) {
        log.debug("Buscando proyecto con ID: {}", id);
        Project project = projectRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proyecto", "id", id));
        return projectMapper.toResponse(project);
    }

    /* ------------------- Write operations ------------------- */
    @Override
    @Transactional
    public ProjectResponse create(ProjectRequest request, Long userId) {
        log.debug("Creando nuevo proyecto: {}", request.getName());

        // Validar usuario
        User createdBy = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", userId));

        // Validar cliente
        Customer customer = customerRepository.findByIdAndActiveTrue(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", "id", request.getCustomerId()));

        // Mapear y guardar
        Project project = projectMapper.toEntity(request);
        project.setCreatedBy(createdBy);
        project.setCustomer(customer);

        Project saved = projectRepository.save(project);
        log.info("Proyecto creado exitosamente con ID: {}", saved.getId());
        return projectMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public ProjectResponse update(Long id, ProjectRequest request, Long userId) {
        log.debug("Actualizando proyecto con ID: {}", id);

        // Validar usuario
        User updatedBy = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", userId));

        // Obtener proyecto existente
        Project project = projectRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proyecto", "id", id));

        // Si cambia el cliente, obtenerlo
        if (request.getCustomerId() != null && !request.getCustomerId().equals(project.getCustomer().getId())) {
            Customer customer = customerRepository.findByIdAndActiveTrue(request.getCustomerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cliente", "id", request.getCustomerId()));
            project.setCustomer(customer);
        }

        // Actualizar con mapper + updatedBy
        projectMapper.updateEntityWithUser(project, request, updatedBy);

        Project updated = projectRepository.save(project);
        log.info("Proyecto con ID: {} actualizado exitosamente", id);
        return projectMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public void delete(Long id, Long userId) {
        log.debug("Eliminando lógicamente el proyecto con ID: {}", id);

        User deletedBy = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", userId));

        Project project = projectRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proyecto", "id", id));

        project.setActive(false);
        project.setUpdatedBy(deletedBy);
        projectRepository.save(project);

        log.info("Proyecto con ID: {} eliminado lógicamente", id);
    }
}
