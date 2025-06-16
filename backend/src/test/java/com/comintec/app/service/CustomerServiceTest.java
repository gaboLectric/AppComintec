package com.comintec.app.service;

import com.comintec.app.dto.request.CustomerRequest;
import com.comintec.app.dto.response.CustomerResponse;
import com.comintec.app.exception.ResourceNotFoundException;
import com.comintec.app.mapper.CustomerMapper;
import com.comintec.app.model.Customer;
import com.comintec.app.model.User;
import com.comintec.app.repository.CustomerRepository;
import com.comintec.app.repository.UserRepository;
import com.comintec.app.service.CustomerService;
import com.comintec.app.service.impl.CustomerServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomerServiceTest {

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CustomerMapper customerMapper;

    @InjectMocks
    private CustomerServiceImpl customerService;

    private Customer customer;
    private CustomerResponse customerResponse;
    private CustomerRequest customerRequest;
    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setActive(true);

        customer = new Customer();
        customer.setId(1L);
        customer.setBusinessName("Test Business");
        customer.setTaxId("TST123456");
        customer.setContactName("Test Contact");
        customer.setPhone("1234567890");
        customer.setEmail("test@example.com");
        customer.setAddress("123 Test St");
        customer.setCity("Test City");
        customer.setState("Test State");
        customer.setPostalCode("12345");
        customer.setCountry("Test Country");
        customer.setActive(true);
        customer.setCreatedAt(LocalDateTime.now());
        customer.setCreatedBy(user);

        customerResponse = new CustomerResponse();
        customerResponse.setId(1L);
        customerResponse.setBusinessName("Test Business");
        customerResponse.setTaxId("TST123456");
        customerResponse.setContactName("Test Contact");
        customerResponse.setPhone("1234567890");
        customerResponse.setEmail("test@example.com");
        customerResponse.setAddress("123 Test St");
        customerResponse.setCity("Test City");
        customerResponse.setState("Test State");
        customerResponse.setPostalCode("12345");
        customerResponse.setCountry("Test Country");
        customerResponse.setActive(true);
        customerResponse.setCreatedAt(LocalDateTime.now());
        customerResponse.setCreatedById(1L);
        customerResponse.setCreatedByUsername("testuser");

        customerRequest = new CustomerRequest();
        customerRequest.setBusinessName("Test Business");
        customerRequest.setTaxId("TST123456");
        customerRequest.setContactName("Test Contact");
        customerRequest.setPhone("1234567890");
        customerRequest.setEmail("test@example.com");
        customerRequest.setAddress("123 Test St");
        customerRequest.setCity("Test City");
        customerRequest.setState("Test State");
        customerRequest.setPostalCode("12345");
        customerRequest.setCountry("Test Country");
    }

    @Test
    void findAll_ShouldReturnPageOfCustomers() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        Page<Customer> customerPage = new PageImpl<>(Collections.singletonList(customer), pageable, 1);
        when(customerRepository.findByActiveTrue(any(Pageable.class))).thenReturn(customerPage);
        when(customerMapper.toResponse(any(Customer.class))).thenReturn(customerResponse);

        // Act
        Page<CustomerResponse> result = customerService.findAll(pageable);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(customerResponse, result.getContent().get(0));
        verify(customerRepository, times(1)).findByActiveTrue(any(Pageable.class));
    }

    @Test
    void findById_WhenCustomerExists_ShouldReturnCustomer() {
        // Arrange
        when(customerRepository.findByIdAndActiveTrue(anyLong())).thenReturn(Optional.of(customer));
        when(customerMapper.toResponse(any(Customer.class))).thenReturn(customerResponse);

        // Act
        CustomerResponse result = customerService.findById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(customerResponse.getId(), result.getId());
        verify(customerRepository, times(1)).findByIdAndActiveTrue(anyLong());
    }

    @Test
    void findById_WhenCustomerNotExists_ShouldThrowException() {
        // Arrange
        when(customerRepository.findByIdAndActiveTrue(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> customerService.findById(1L));
        verify(customerRepository, times(1)).findByIdAndActiveTrue(anyLong());
    }

    @Test
    void create_WithValidData_ShouldReturnCreatedCustomer() {
        // Arrange
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(user));
        when(customerRepository.existsByTaxId(anyString(), anyLong())).thenReturn(false);
        when(customerRepository.existsByBusinessName(anyString(), anyLong())).thenReturn(false);
        when(customerMapper.toEntity(any(CustomerRequest.class))).thenReturn(customer);
        when(customerRepository.save(any(Customer.class))).thenReturn(customer);
        when(customerMapper.toResponse(any(Customer.class))).thenReturn(customerResponse);

        // Act
        CustomerResponse result = customerService.create(customerRequest, 1L);

        // Assert
        assertNotNull(result);
        assertEquals(customerResponse.getId(), result.getId());
        verify(customerRepository, times(1)).save(any(Customer.class));
    }

    @Test
    void update_WithValidData_ShouldReturnUpdatedCustomer() {
        // Arrange
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(user));
        when(customerRepository.findByIdAndActiveTrue(anyLong())).thenReturn(Optional.of(customer));
        when(customerRepository.existsByTaxId(anyString(), anyLong())).thenReturn(false);
        when(customerRepository.existsByBusinessName(anyString(), anyLong())).thenReturn(false);
        when(customerRepository.save(any(Customer.class))).thenReturn(customer);
        when(customerMapper.toResponse(any(Customer.class))).thenReturn(customerResponse);

        // Act
        CustomerResponse result = customerService.update(1L, customerRequest, 1L);

        // Assert
        assertNotNull(result);
        assertEquals(customerResponse.getId(), result.getId());
        verify(customerRepository, times(1)).save(any(Customer.class));
    }

    @Test
    void delete_WhenCustomerExists_ShouldMarkAsInactive() {
        // Arrange
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(user));
        when(customerRepository.findByIdAndActiveTrue(anyLong())).thenReturn(Optional.of(customer));
        when(customerRepository.save(any(Customer.class))).thenReturn(customer);

        // Act
        customerService.delete(1L, 1L);

        // Assert
        assertFalse(customer.getActive());
        verify(customerRepository, times(1)).save(any(Customer.class));
    }
}
