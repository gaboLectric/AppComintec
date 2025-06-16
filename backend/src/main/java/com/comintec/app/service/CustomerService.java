package com.comintec.app.service;

import com.comintec.app.dto.request.CustomerRequest;
import com.comintec.app.dto.response.CustomerResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CustomerService {
    
    Page<CustomerResponse> findAll(Pageable pageable);
    
    Page<CustomerResponse> search(String searchTerm, Pageable pageable);
    
    CustomerResponse findById(Long id);
    
    CustomerResponse create(CustomerRequest customerRequest, Long userId);
    
    CustomerResponse update(Long id, CustomerRequest customerRequest, Long userId);
    
    void delete(Long id, Long userId);
    
    boolean existsByTaxId(String taxId, Long excludeId);
    
    boolean existsByBusinessName(String businessName, Long excludeId);
}
