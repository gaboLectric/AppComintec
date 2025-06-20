package com.comintec.app.mapper;

import com.comintec.app.dto.request.CustomerRequest;
import com.comintec.app.dto.response.CustomerResponse;
import com.comintec.app.model.Customer;
import com.comintec.app.model.User;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-06-19T22:48:55-0600",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.42.0.v20250514-1000, environment: Java 21.0.7 (Eclipse Adoptium)"
)
@Component
public class CustomerMapperImpl implements CustomerMapper {

    @Override
    public Customer toEntity(CustomerRequest customerRequest) {
        if ( customerRequest == null ) {
            return null;
        }

        Customer.CustomerBuilder customer = Customer.builder();

        customer.address( customerRequest.getAddress() );
        customer.businessName( customerRequest.getBusinessName() );
        customer.city( customerRequest.getCity() );
        customer.contactName( customerRequest.getContactName() );
        customer.country( customerRequest.getCountry() );
        customer.email( customerRequest.getEmail() );
        customer.notes( customerRequest.getNotes() );
        customer.phone( customerRequest.getPhone() );
        customer.postalCode( customerRequest.getPostalCode() );
        customer.state( customerRequest.getState() );
        customer.taxId( customerRequest.getTaxId() );

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
        customerResponse.active( customer.getActive() );
        customerResponse.address( customer.getAddress() );
        customerResponse.businessName( customer.getBusinessName() );
        customerResponse.city( customer.getCity() );
        customerResponse.contactName( customer.getContactName() );
        customerResponse.country( customer.getCountry() );
        customerResponse.createdAt( customer.getCreatedAt() );
        customerResponse.email( customer.getEmail() );
        customerResponse.id( customer.getId() );
        customerResponse.notes( customer.getNotes() );
        customerResponse.phone( customer.getPhone() );
        customerResponse.postalCode( customer.getPostalCode() );
        customerResponse.state( customer.getState() );
        customerResponse.taxId( customer.getTaxId() );
        customerResponse.updatedAt( customer.getUpdatedAt() );

        return customerResponse.build();
    }

    @Override
    public void updateEntity(Customer customer, CustomerRequest customerRequest) {
        if ( customerRequest == null ) {
            return;
        }

        if ( customerRequest.getAddress() != null ) {
            customer.setAddress( customerRequest.getAddress() );
        }
        if ( customerRequest.getBusinessName() != null ) {
            customer.setBusinessName( customerRequest.getBusinessName() );
        }
        if ( customerRequest.getCity() != null ) {
            customer.setCity( customerRequest.getCity() );
        }
        if ( customerRequest.getContactName() != null ) {
            customer.setContactName( customerRequest.getContactName() );
        }
        if ( customerRequest.getCountry() != null ) {
            customer.setCountry( customerRequest.getCountry() );
        }
        if ( customerRequest.getEmail() != null ) {
            customer.setEmail( customerRequest.getEmail() );
        }
        if ( customerRequest.getNotes() != null ) {
            customer.setNotes( customerRequest.getNotes() );
        }
        if ( customerRequest.getPhone() != null ) {
            customer.setPhone( customerRequest.getPhone() );
        }
        if ( customerRequest.getPostalCode() != null ) {
            customer.setPostalCode( customerRequest.getPostalCode() );
        }
        if ( customerRequest.getState() != null ) {
            customer.setState( customerRequest.getState() );
        }
        if ( customerRequest.getTaxId() != null ) {
            customer.setTaxId( customerRequest.getTaxId() );
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
