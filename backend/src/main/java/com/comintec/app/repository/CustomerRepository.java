package com.comintec.app.repository;

import com.comintec.app.model.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    
    Optional<Customer> findByIdAndActiveTrue(Long id);
    
    Page<Customer> findByActiveTrue(Pageable pageable);
    
    @Query("SELECT c FROM Customer c WHERE " +
           "LOWER(c.businessName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.contactName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.taxId) LIKE LOWER(CONCAT('%', :searchTerm, '%')) AND c.active = true")
    Page<Customer> search(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    @Query("SELECT c FROM Customer c WHERE c.active = true AND c.id IN :ids")
    List<Customer> findAllActiveByIds(@Param("ids") List<Long> ids);
    
    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM Customer c WHERE c.taxId = :taxId AND c.id != :excludeId AND c.active = true")
    boolean existsByTaxId(@Param("taxId") String taxId, @Param("excludeId") Long excludeId);
    
    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM Customer c WHERE c.businessName = :businessName AND c.id != :excludeId AND c.active = true")
    boolean existsByBusinessName(@Param("businessName") String businessName, @Param("excludeId") Long excludeId);
}
