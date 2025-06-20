package com.comintec.app.service;

import com.comintec.app.dto.request.ProjectRequest;
import com.comintec.app.dto.response.ProjectResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProjectService {
    Page<ProjectResponse> findAll(Pageable pageable);

    Page<ProjectResponse> search(String searchTerm, Pageable pageable);

    ProjectResponse findById(Long id);

    ProjectResponse create(ProjectRequest request, Long userId);

    ProjectResponse update(Long id, ProjectRequest request, Long userId);

    void delete(Long id, Long userId);
}
