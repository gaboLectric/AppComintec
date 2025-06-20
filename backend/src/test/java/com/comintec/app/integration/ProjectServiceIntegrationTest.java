package com.comintec.app.integration;

import com.comintec.app.dto.request.CustomerRequest;
import com.comintec.app.dto.request.ProjectRequest;
import com.comintec.app.dto.response.CustomerResponse;
import com.comintec.app.dto.response.ProjectResponse;
import com.comintec.app.model.Role;
import com.comintec.app.model.User;
import com.comintec.app.repository.RoleRepository;
import com.comintec.app.repository.UserRepository;
import com.comintec.app.service.CustomerService;
import com.comintec.app.service.ProjectService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Integration tests for ProjectService using an in-memory H2 database.
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
class ProjectServiceIntegrationTest {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    private Long userId;
    private Long customerId;

    @BeforeEach
    void setUp() {
        // Create role and user
        Role adminRole = new Role();
        adminRole.setName(Role.RoleName.ROLE_ADMIN);
        adminRole.setDescription("Integration admin role");
        roleRepository.save(adminRole);

        User admin = new User();
        admin.setUsername("1"); // we use "1" as username to match parsing in service/controller
        admin.setPassword("pass");
        admin.setActive(true);
        admin.setRoles(new HashSet<>());
        admin.addRole(adminRole);
        userRepository.save(admin);
        userId = admin.getId();

        // Create customer via service layer to keep mapping consistent
        CustomerRequest customerRequest = new CustomerRequest();
        customerRequest.setBusinessName("Cliente Integracion");
        customerRequest.setTaxId("INTG123");
        customerRequest.setContactName("Tester");
        customerRequest.setEmail("test@int.com");
        CustomerResponse customerResp = customerService.create(customerRequest, userId);
        customerId = customerResp.getId();
    }

    @Test
    void createAndRetrieveProject_successFlow() {
        // Create project
        ProjectRequest request = new ProjectRequest();
        request.setName("Proyecto Integracion");
        request.setDescription("Proyecto de prueba integracion");
        request.setTotalAmount(new BigDecimal("15000.50"));
        request.setStartDate(LocalDate.now());
        request.setEndDate(LocalDate.now().plusDays(10));
        request.setCustomerId(customerId);

        ProjectResponse created = projectService.create(request, userId);
        assertNotNull(created);
        assertEquals("Proyecto Integracion", created.getName());
        assertEquals(customerId, created.getCustomerId());

        // Retrieve by id
        ProjectResponse fetched = projectService.findById(created.getId());
        assertEquals(created.getId(), fetched.getId());
        assertEquals(created.getName(), fetched.getName());
    }
}
