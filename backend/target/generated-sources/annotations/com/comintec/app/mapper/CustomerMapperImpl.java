package com.comintec.app.mapper;

import com.comintec.app.dto.request.CustomerRequest;
import com.comintec.app.dto.response.CustomerResponse;
import com.comintec.app.model.Customer;
import com.comintec.app.model.User;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-06-16T20:34:50-0600",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.15 (Ubuntu)"
)
@Component
public class CustomerMapperImpl implements CustomerMapper {

    @Override
    public Customer toEntity(CustomerRequest customerRequest) {
        if ( customerRequest == null ) {
            return null;
        }

        Customer.CustomerBuilder customer = Customer.builder();

        customer.businessName( customerRequest.getBusinessName() );
        customer.taxId( customerRequest.getTaxId() );
        customer.contactName( customerRequest.getContactName() );
        customer.phone( customerRequest.getPhone() );
        customer.email( customerRequest.getEmail() );
        customer.address( customerRequest.getAddress() );
        customer.city( customerRequest.getCity() );
        customer.state( customerRequest.getState() );
        customer.postalCode( customerRequest.getPostalCode() );
        customer.country( customerRequest.getCountry() );
        customer.notes( customerRequest.getNotes() );

        customer.active( true );

        return customer.build();
    }

    @Override
    public CustomerResponse toResponse(Customer customer) {
        if ( customer == null ) {
            return null;
        }

        CustomerResponse.CustomerResponseBuilder customerResponse = CustomerResponse.builder();

        customerResponse.createdById( customerCreatedById( customer ) );
        customerResponse.createdByUsername( customerCreatedByUsername( customer ) );
        customerResponse.id( customer.getId() );
        customerResponse.businessName( customer.getBusinessName() );
        customerResponse.taxId( customer.getTaxId() );
        customerResponse.contactName( customer.getContactName() );
        customerResponse.phone( customer.getPhone() );
        customerResponse.email( customer.getEmail() );
        customerResponse.address( customer.getAddress() );
        customerResponse.city( customer.getCity() );
        customerResponse.state( customer.getState() );
        customerResponse.postalCode( customer.getPostalCode() );
        customerResponse.country( customer.getCountry() );
        customerResponse.active( customer.getActive() );
        customerResponse.notes( customer.getNotes() );
        customerResponse.createdAt( customer.getCreatedAt() );
        customerResponse.updatedAt( customer.getUpdatedAt() );

        return customerResponse.build();
    }

    @Override
    public void updateEntity(Customer customer, CustomerRequest customerRequest) {
        if ( customerRequest == null ) {
            return;
        }

        if ( customerRequest.getBusinessName() != null ) {
            customer.setBusinessName( customerRequest.getBusinessName() );
        }
        if ( customerRequest.getTaxId() != null ) {
            customer.setTaxId( customerRequest.getTaxId() );
        }
        if ( customerRequest.getContactName() != null ) {
            customer.setContactName( customerRequest.getContactName() );
        }
        if ( customerRequest.getPhone() != null ) {
            customer.setPhone( customerRequest.getPhone() );
        }
        if ( customerRequest.getEmail() != null ) {
            customer.setEmail( customerRequest.getEmail() );
        }
        if ( customerRequest.getAddress() != null ) {
            customer.setAddress( customerRequest.getAddress() );
        }
        if ( customerRequest.getCity() != null ) {
            customer.setCity( customerRequest.getCity() );
        }
        if ( customerRequest.getState() != null ) {
            customer.setState( customerRequest.getState() );
        }
        if ( customerRequest.getPostalCode() != null ) {
            customer.setPostalCode( customerRequest.getPostalCode() );
        }
        if ( customerRequest.getCountry() != null ) {
            customer.setCountry( customerRequest.getCountry() );
        }
        if ( customerRequest.getNotes() != null ) {
            customer.setNotes( customerRequest.getNotes() );
        }
    }

    private Long customerCreatedById(Customer customer) {
        if ( customer == null ) {
            return null;
        }
        User createdBy = customer.getCreatedBy();
        if ( createdBy == null ) {
            return null;
        }
        Long id = createdBy.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String customerCreatedByUsername(Customer customer) {
        if ( customer == null ) {
            return null;
        }
        User createdBy = customer.getCreatedBy();
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
