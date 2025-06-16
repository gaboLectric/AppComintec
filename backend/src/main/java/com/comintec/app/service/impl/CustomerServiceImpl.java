package com.comintec.app.service.impl;

import com.comintec.app.dto.request.CustomerRequest;
import com.comintec.app.dto.response.CustomerResponse;
import com.comintec.app.exception.ResourceNotFoundException;
import com.comintec.app.mapper.CustomerMapper;
import com.comintec.app.model.Customer;
import com.comintec.app.model.User;
import com.comintec.app.repository.CustomerRepository;
import com.comintec.app.repository.UserRepository;
import com.comintec.app.service.CustomerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final CustomerMapper customerMapper;

    @Override
    @Transactional(readOnly = true)
    public Page<CustomerResponse> findAll(Pageable pageable) {
        log.debug("Buscando todos los clientes paginados");
        return customerRepository.findByActiveTrue(pageable)
                .map(customerMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CustomerResponse> search(String searchTerm, Pageable pageable) {
        log.debug("Buscando clientes con término: {}", searchTerm);
        return customerRepository.search(searchTerm, pageable)
                .map(customerMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerResponse findById(Long id) {
        log.debug("Buscando cliente con ID: {}", id);
        Customer customer = customerRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", "id", id));
        return customerMapper.toResponse(customer);
    }

    @Override
    @Transactional
    public CustomerResponse create(CustomerRequest customerRequest, Long userId) {
        log.debug("Creando nuevo cliente: {}", customerRequest.getBusinessName());
        
        // Validar que el usuario existe
        User createdBy = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", userId));
        
        // Validar que no exista un cliente con el mismo RFC (si se proporciona)
        if (customerRequest.getTaxId() != null && !customerRequest.getTaxId().isEmpty() && 
            customerRepository.existsByTaxId(customerRequest.getTaxId(), 0L)) {
            throw new IllegalArgumentException("Ya existe un cliente con el RFC: " + customerRequest.getTaxId());
        }
        
        // Validar que no exista un cliente con el mismo nombre de negocio
        if (customerRepository.existsByBusinessName(customerRequest.getBusinessName(), 0L)) {
            throw new IllegalArgumentException("Ya existe un cliente con el nombre de negocio: " + customerRequest.getBusinessName());
        }
        
        // Mapear DTO a entidad
        Customer customer = customerMapper.toEntity(customerRequest);
        customer.setCreatedBy(createdBy);
        
        // Guardar en la base de datos
        Customer savedCustomer = customerRepository.save(customer);
        log.info("Cliente creado exitosamente con ID: {}", savedCustomer.getId());
        
        return customerMapper.toResponse(savedCustomer);
    }

    @Override
    @Transactional
    public CustomerResponse update(Long id, CustomerRequest customerRequest, Long userId) {
        log.debug("Actualizando cliente con ID: {}", id);
        
        // Validar que el usuario existe
        User updatedBy = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", userId));
        
        // Buscar el cliente existente
        Customer existingCustomer = customerRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", "id", id));
        
        // Validar que no exista otro cliente con el mismo RFC (si se está actualizando)
        if (customerRequest.getTaxId() != null && !customerRequest.getTaxId().isEmpty() && 
            customerRepository.existsByTaxId(customerRequest.getTaxId(), id)) {
            throw new IllegalArgumentException("Ya existe otro cliente con el RFC: " + customerRequest.getTaxId());
        }
        
        // Validar que no exista otro cliente con el mismo nombre de negocio
        if (!existingCustomer.getBusinessName().equals(customerRequest.getBusinessName()) && 
            customerRepository.existsByBusinessName(customerRequest.getBusinessName(), id)) {
            throw new IllegalArgumentException("Ya existe otro cliente con el nombre de negocio: " + customerRequest.getBusinessName());
        }
        
        // Actualizar la entidad con los nuevos datos
        customerMapper.updateEntityWithUser(existingCustomer, customerRequest, updatedBy);
        
        // Guardar los cambios
        Customer updatedCustomer = customerRepository.save(existingCustomer);
        log.info("Cliente con ID: {} actualizado exitosamente", id);
        
        return customerMapper.toResponse(updatedCustomer);
    }

    @Override
    @Transactional
    public void delete(Long id, Long userId) {
        log.debug("Eliminando lógicamente el cliente con ID: {}", id);
        
        // Buscar el cliente existente
        Customer customer = customerRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", "id", id));
        
        // Validar que el usuario existe
        User deletedBy = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", userId));
        
        // Eliminación lógica
        customer.setActive(false);
        customer.setUpdatedBy(deletedBy);
        customerRepository.save(customer);
        
        log.info("Cliente con ID: {} eliminado lógicamente", id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByTaxId(String taxId, Long excludeId) {
        if (taxId == null || taxId.isEmpty()) {
            return false;
        }
        return customerRepository.existsByTaxId(taxId, excludeId != null ? excludeId : 0L);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByBusinessName(String businessName, Long excludeId) {
        if (businessName == null || businessName.isEmpty()) {
            return false;
        }
        return customerRepository.existsByBusinessName(businessName, excludeId != null ? excludeId : 0L);
    }
}
