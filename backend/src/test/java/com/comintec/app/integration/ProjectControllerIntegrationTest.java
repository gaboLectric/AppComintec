package com.comintec.app.integration;

import com.comintec.app.dto.request.CustomerRequest;
import com.comintec.app.dto.request.ProjectRequest;
import com.comintec.app.model.Role;
import com.comintec.app.model.User;
import com.comintec.app.repository.RoleRepository;
import com.comintec.app.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for ProjectController using MockMvc and H2.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ProjectControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private com.comintec.app.service.CustomerService customerService;

    private Long customerId;

    @BeforeEach
    void setup() {
        if (!roleRepository.findByName(Role.RoleName.ROLE_ADMIN).isPresent()) {
            Role role = new Role();
            role.setName(Role.RoleName.ROLE_ADMIN);
            role.setDescription("Admin");
            roleRepository.save(role);
        }

        // ensure user with id 1 exists (username="1") for @WithMockUser
        if (!userRepository.findById(1L).isPresent()) {
            User admin = new User();
            admin.setId(1L); // set manually for consistency
            admin.setUsername("1");
            admin.setPassword("pass");
            admin.setActive(true);
            admin.setRoles(new HashSet<>(roleRepository.findAll()));
            userRepository.save(admin);
        }

        // create customer if not yet
        if (customerId == null) {
            CustomerRequest cr = new CustomerRequest();
            cr.setBusinessName("Cliente Ctrl");
            cr.setTaxId("CTRL123");
            cr.setContactName("Ctrl");
            cr.setEmail("ctrl@test.com");
            customerId = customerService.create(cr, 1L).getId();
        }
    }

    @Test
    @WithMockUser(username = "1", roles = {"ADMIN"})
    void createProject_thenGetById() throws Exception {
        ProjectRequest req = new ProjectRequest();
        req.setName("Proyecto Ctrl");
        req.setDescription("desc");
        req.setTotalAmount(BigDecimal.valueOf(1234.56));
        req.setCustomerId(customerId);
        req.setStartDate(LocalDate.now());

        // create
        String json = objectMapper.writeValueAsString(req);
        String location = mockMvc.perform(post("/api/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getHeader("Location");

        // fallback to get id if Location header not set
        long id;
        if (location != null && location.matches(".*/api/projects/\\d+")) {
            id = Long.parseLong(location.substring(location.lastIndexOf('/') + 1));
        } else {
            // request list and pick first
            String resp = mockMvc.perform(get("/api/projects?size=1"))
                    .andReturn().getResponse().getContentAsString();
            id = objectMapper.readTree(resp).get("content").get(0).get("id").asLong();
        }

        // get by id
        mockMvc.perform(get("/api/projects/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Proyecto Ctrl"))
                .andExpect(jsonPath("$.customerId").value(customerId));
    }
}
