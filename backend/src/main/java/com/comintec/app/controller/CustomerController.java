package com.comintec.app.controller;

import com.comintec.app.dto.request.CustomerRequest;
import com.comintec.app.dto.response.CustomerResponse;
import com.comintec.app.service.CustomerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/customers")
@Tag(name = "Clientes", description = "API para la gestión de clientes")
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping
    @Operation(summary = "Obtener todos los clientes paginados")
    @ApiResponse(responseCode = "200", description = "Lista de clientes obtenida exitosamente")
    public ResponseEntity<Page<CustomerResponse>> getAllCustomers(
            @PageableDefault(size = 20) Pageable pageable) {
        log.info("Solicitando lista de clientes paginada");
        Page<CustomerResponse> customers = customerService.findAll(pageable);
        return ResponseEntity.ok(customers);
    }

    @GetMapping("/search")
    @Operation(summary = "Buscar clientes por término de búsqueda")
    @ApiResponse(responseCode = "200", description = "Clientes encontrados exitosamente")
    public ResponseEntity<Page<CustomerResponse>> searchCustomers(
            @RequestParam String query,
            @PageableDefault(size = 20) Pageable pageable) {
        log.info("Buscando clientes con término: {}", query);
        Page<CustomerResponse> customers = customerService.search(query, pageable);
        return ResponseEntity.ok(customers);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener un cliente por ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Cliente encontrado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Cliente no encontrado", 
                   content = @Content(schema = @Schema(implementation = Void.class)))
    })
    public ResponseEntity<CustomerResponse> getCustomerById(
            @Parameter(description = "ID del cliente a buscar") @PathVariable Long id) {
        log.info("Solicitando cliente con ID: {}", id);
        CustomerResponse customer = customerService.findById(id);
        return ResponseEntity.ok(customer);
    }

    @PostMapping
    @Operation(summary = "Crear un nuevo cliente")
    @ApiResponse(responseCode = "201", description = "Cliente creado exitosamente")
    public ResponseEntity<CustomerResponse> createCustomer(
            @Valid @RequestBody CustomerRequest customerRequest,
            @AuthenticationPrincipal UserDetails userDetails) {
        log.info("Creando nuevo cliente: {}", customerRequest.getBusinessName());
        Long userId = Long.parseLong(userDetails.getUsername());
        CustomerResponse createdCustomer = customerService.create(customerRequest, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCustomer);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un cliente existente")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Cliente actualizado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Cliente no encontrado", 
                   content = @Content(schema = @Schema(implementation = Void.class)))
    })
    public ResponseEntity<CustomerResponse> updateCustomer(
            @Parameter(description = "ID del cliente a actualizar") @PathVariable Long id,
            @Valid @RequestBody CustomerRequest customerRequest,
            @AuthenticationPrincipal UserDetails userDetails) {
        log.info("Actualizando cliente con ID: {}", id);
        Long userId = Long.parseLong(userDetails.getUsername());
        CustomerResponse updatedCustomer = customerService.update(id, customerRequest, userId);
        return ResponseEntity.ok(updatedCustomer);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar un cliente (eliminación lógica)")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Cliente eliminado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Cliente no encontrado", 
                   content = @Content(schema = @Schema(implementation = Void.class)))
    })
    public ResponseEntity<Void> deleteCustomer(
            @Parameter(description = "ID del cliente a eliminar") @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        log.info("Eliminando cliente con ID: {}", id);
        Long userId = Long.parseLong(userDetails.getUsername());
        customerService.delete(id, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/check/tax-id")
    @Operation(summary = "Verificar si ya existe un cliente con el RFC proporcionado")
    @ApiResponse(responseCode = "200", description = "Verificación exitosa")
    public ResponseEntity<Boolean> checkTaxIdExists(
            @RequestParam String taxId,
            @RequestParam(required = false) Long excludeId) {
        log.debug("Verificando si existe cliente con RFC: {}", taxId);
        boolean exists = customerService.existsByTaxId(taxId, excludeId);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/check/business-name")
    @Operation(summary = "Verificar si ya existe un cliente con el nombre de negocio proporcionado")
    @ApiResponse(responseCode = "200", description = "Verificación exitosa")
    public ResponseEntity<Boolean> checkBusinessNameExists(
            @RequestParam String businessName,
            @RequestParam(required = false) Long excludeId) {
        log.debug("Verificando si existe cliente con nombre de negocio: {}", businessName);
        boolean exists = customerService.existsByBusinessName(businessName, excludeId);
        return ResponseEntity.ok(exists);
    }
}
