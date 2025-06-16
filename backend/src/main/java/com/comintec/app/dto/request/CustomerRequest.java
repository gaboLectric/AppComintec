package com.comintec.app.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CustomerRequest {
    
    @NotBlank(message = "El nombre de la empresa es obligatorio")
    @Size(max = 200, message = "El nombre de la empresa no puede tener más de 200 caracteres")
    private String businessName;
    
    @Size(max = 50, message = "El RFC no puede tener más de 50 caracteres")
    private String taxId;
    
    @Size(max = 100, message = "El nombre del contacto no puede tener más de 100 caracteres")
    private String contactName;
    
    @Pattern(regexp = "^[0-9+\\-\\s()]*$", message = "Número de teléfono no válido")
    @Size(max = 20, message = "El teléfono no puede tener más de 20 caracteres")
    private String phone;
    
    @Email(message = "El correo electrónico no es válido")
    @Size(max = 100, message = "El correo electrónico no puede tener más de 100 caracteres")
    private String email;
    
    @Size(max = 500, message = "La dirección no puede tener más de 500 caracteres")
    private String address;
    
    @Size(max = 100, message = "La ciudad no puede tener más de 100 caracteres")
    private String city;
    
    @Size(max = 100, message = "El estado no puede tener más de 100 caracteres")
    private String state;
    
    @Size(max = 20, message = "El código postal no puede tener más de 20 caracteres")
    private String postalCode;
    
    @Size(max = 100, message = "El país no puede tener más de 100 caracteres")
    private String country = "México";
    
    private String notes;
}
