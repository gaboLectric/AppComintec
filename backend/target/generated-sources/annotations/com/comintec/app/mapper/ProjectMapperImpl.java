package com.comintec.app.mapper;

import com.comintec.app.dto.request.ProjectRequest;
import com.comintec.app.dto.response.ProjectResponse;
import com.comintec.app.model.Customer;
import com.comintec.app.model.Project;
import com.comintec.app.model.User;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-06-19T22:48:55-0600",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.42.0.v20250514-1000, environment: Java 21.0.7 (Eclipse Adoptium)"
)
@Component
public class ProjectMapperImpl implements ProjectMapper {

    @Override
    public Project toEntity(ProjectRequest request) {
        if ( request == null ) {
            return null;
        }

        Project.ProjectBuilder project = Project.builder();

        project.description( request.getDescription() );
        project.endDate( request.getEndDate() );
        project.name( request.getName() );
        project.startDate( request.getStartDate() );
        project.status( request.getStatus() );
        project.totalAmount( request.getTotalAmount() );

        project.active( true );

        return project.build();
    }

    @Override
    public ProjectResponse toResponse(Project project) {
        if ( project == null ) {
            return null;
        }

        ProjectResponse.ProjectResponseBuilder projectResponse = ProjectResponse.builder();

        projectResponse.customerId( projectCustomerId( project ) );
        projectResponse.customerName( projectCustomerBusinessName( project ) );
        projectResponse.createdById( projectCreatedById( project ) );
        projectResponse.createdByUsername( projectCreatedByUsername( project ) );
        projectResponse.active( project.getActive() );
        projectResponse.createdAt( project.getCreatedAt() );
        projectResponse.description( project.getDescription() );
        projectResponse.endDate( project.getEndDate() );
        projectResponse.id( project.getId() );
        projectResponse.name( project.getName() );
        projectResponse.startDate( project.getStartDate() );
        projectResponse.status( project.getStatus() );
        projectResponse.totalAmount( project.getTotalAmount() );
        projectResponse.updatedAt( project.getUpdatedAt() );

        return projectResponse.build();
    }

    @Override
    public void updateEntity(Project project, ProjectRequest request) {
        if ( request == null ) {
            return;
        }

        if ( request.getDescription() != null ) {
            project.setDescription( request.getDescription() );
        }
        if ( request.getEndDate() != null ) {
            project.setEndDate( request.getEndDate() );
        }
        if ( request.getName() != null ) {
            project.setName( request.getName() );
        }
        if ( request.getStartDate() != null ) {
            project.setStartDate( request.getStartDate() );
        }
        if ( request.getStatus() != null ) {
            project.setStatus( request.getStatus() );
        }
        if ( request.getTotalAmount() != null ) {
            project.setTotalAmount( request.getTotalAmount() );
        }
    }

    private Long projectCustomerId(Project project) {
        if ( project == null ) {
            return null;
        }
        Customer customer = project.getCustomer();
        if ( customer == null ) {
            return null;
        }
        Long id = customer.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String projectCustomerBusinessName(Project project) {
        if ( project == null ) {
            return null;
        }
        Customer customer = project.getCustomer();
        if ( customer == null ) {
            return null;
        }
        String businessName = customer.getBusinessName();
        if ( businessName == null ) {
            return null;
        }
        return businessName;
    }

    private Long projectCreatedById(Project project) {
        if ( project == null ) {
            return null;
        }
        User createdBy = project.getCreatedBy();
        if ( createdBy == null ) {
            return null;
        }
        Long id = createdBy.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String projectCreatedByUsername(Project project) {
        if ( project == null ) {
            return null;
        }
        User createdBy = project.getCreatedBy();
        if ( createdBy == null ) {
            return null;
        }
        String username = createdBy.getUsername();
        if ( username == null ) {
            return null;
        }
        return username;
    }
}
