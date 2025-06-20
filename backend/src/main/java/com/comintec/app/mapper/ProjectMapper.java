package com.comintec.app.mapper;

import com.comintec.app.dto.request.ProjectRequest;
import com.comintec.app.dto.response.ProjectResponse;
import com.comintec.app.model.Project;
import com.comintec.app.model.User;
import org.mapstruct.*;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ProjectMapper {

    /* -------------  ENTITY <-> DTO -------------- */

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "active", constant = "true")
    Project toEntity(ProjectRequest request);

    @Mapping(source = "customer.id", target = "customerId")
    @Mapping(source = "customer.businessName", target = "customerName")
    @Mapping(source = "createdBy.id", target = "createdById")
    @Mapping(source = "createdBy.username", target = "createdByUsername")
    ProjectResponse toResponse(Project project);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "active", ignore = true)
    void updateEntity(@MappingTarget Project project, ProjectRequest request);

    default void updateEntityWithUser(Project project, ProjectRequest request, User user) {
        updateEntity(project, request);
        project.setUpdatedBy(user);
    }
}
