package com.comintec.app.mapper;

import com.comintec.app.dto.request.CustomerRequest;
import com.comintec.app.dto.response.CustomerResponse;
import com.comintec.app.model.Customer;
import com.comintec.app.model.User;
import org.mapstruct.*;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CustomerMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "active", constant = "true")
    Customer toEntity(CustomerRequest customerRequest);

    @Mapping(source = "createdBy.id", target = "createdById")
    @Mapping(source = "createdBy.username", target = "createdByUsername")
    CustomerResponse toResponse(Customer customer);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "active", ignore = true)
    void updateEntity(@MappingTarget Customer customer, CustomerRequest customerRequest);
    
    default void updateEntityWithUser(Customer customer, CustomerRequest customerRequest, User user) {
        updateEntity(customer, customerRequest);
        customer.setUpdatedBy(user);
    }
}
