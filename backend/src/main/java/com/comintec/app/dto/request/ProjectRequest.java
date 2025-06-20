package com.comintec.app.dto.request;

import com.comintec.app.model.enums.ProjectStatus;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO para creación / actualización de proyectos del módulo de Ventas.
 */
@Data
public class ProjectRequest {

    @NotBlank(message = "El nombre del proyecto es obligatorio")
    @Size(max = 200, message = "El nombre del proyecto no puede tener más de 200 caracteres")
    private String name;

    @Size(max = 2000, message = "La descripción no puede tener más de 2000 caracteres")
    private String description;

    private ProjectStatus status; // Opcional – por defecto NEW

    @DecimalMin(value = "0.0", inclusive = false, message = "El monto total debe ser mayor a 0")
    private BigDecimal totalAmount;

    private LocalDate startDate;

    private LocalDate endDate;

    @NotNull(message = "Se requiere el ID del cliente")
    private Long customerId;
}
