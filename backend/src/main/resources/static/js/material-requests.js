import { validateRequiredFields, showFieldError, clearFieldErrors } from './form-validation.js';

document.addEventListener('DOMContentLoaded', function() {
  // Elementos del DOM
  const materialRequestsTable = document.getElementById('materialRequestsTable');
  const form = document.getElementById('materialRequestForm');
  const submitBtn = document.getElementById('submitRequest');
  
  // Datos de solicitudes (normalmente vendrían de una API)
  const materialRequests = [
    {
      id: 1,
      folio: 'SOL-2023-001',
      date: new Date('2023-12-15'),
      requester: 'Juan Pérez',
      description: 'Herramientas para mantenimiento',
      status: 'approved'
    },
    {
      id: 2,
      folio: 'SOL-2023-002',
      date: new Date('2023-12-18'),
      requester: 'María García',
      description: 'Materiales de oficina',
      status: 'pending'
    },
    {
      id: 3,
      folio: 'SOL-2023-003',
      date: new Date('2023-12-20'),
      requester: 'Carlos Rodríguez',
      description: 'Equipo de seguridad',
      status: 'rejected'
    },
    {
      id: 4,
      folio: 'SOL-2024-001',
      date: new Date('2024-01-05'),
      requester: 'Ana López',
      description: 'Componentes electrónicos',
      status: 'pending'
    },
    {
      id: 5,
      folio: 'SOL-2024-002',
      date: new Date('2024-01-10'),
      requester: 'Roberto Martínez',
      description: 'Refacciones para maquinaria',
      status: 'approved'
    }
  ];
  
  // Renderizar solicitudes
  renderMaterialRequests();
  
  // Función para renderizar las solicitudes de material
  function renderMaterialRequests() {
    // Limpiar tabla
    materialRequestsTable.innerHTML = '';
    
    // Crear filas para cada solicitud
    materialRequests.forEach(request => {
      const row = document.createElement('tr');
      
      // Folio
      const folioCell = document.createElement('td');
      folioCell.textContent = request.folio;
      
      // Fecha
      const dateCell = document.createElement('td');
      dateCell.textContent = formatDate(request.date);
      
      // Solicitante
      const requesterCell = document.createElement('td');
      requesterCell.textContent = request.requester;
      
      // Descripción
      const descriptionCell = document.createElement('td');
      descriptionCell.textContent = request.description;
      
      // Estado
      const statusCell = document.createElement('td');
      const statusBadge = document.createElement('span');
      statusBadge.className = `material-status material-status-${request.status}`;
      
      // Texto del estado en español
      let statusText = '';
      switch (request.status) {
        case 'pending':
          statusText = 'Pendiente';
          break;
        case 'approved':
          statusText = 'Aprobada';
          break;
        case 'rejected':
          statusText = 'Rechazada';
          break;
        default:
          statusText = request.status;
      }
      
      statusBadge.textContent = statusText;
      statusCell.appendChild(statusBadge);
      
      // Añadir celdas a la fila
      row.appendChild(folioCell);
      row.appendChild(dateCell);
      row.appendChild(requesterCell);
      row.appendChild(descriptionCell);
      row.appendChild(statusCell);
      
      // Añadir fila a la tabla
      materialRequestsTable.appendChild(row);
    });
  }
  
  // Función para formatear fechas en español
  function formatDate(date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  }
  
  if (form && submitBtn) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      clearFieldErrors('#materialRequestForm');
      const valid = validateRequiredFields('#materialRequestForm', showFieldError);
      if (!valid) {
        const errorMsg = document.getElementById('quantityError');
        if (errorMsg) errorMsg.style.display = 'inline';
        submitBtn.disabled = false;
        return;
      }
      // Indicador de carga
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner"></span> Enviando...';
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Enviar solicitud';
        // Aquí iría la lógica real de envío
      }, 1200);
    });
  }
});