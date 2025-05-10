document.addEventListener('DOMContentLoaded', function() {
  // Elementos del DOM
  const currentDateElement = document.getElementById('currentDate');
  const currentMonthElement = document.getElementById('currentMonth');
  const prevMonthBtn = document.getElementById('prevMonth');
  const nextMonthBtn = document.getElementById('nextMonth');
  const calendarGrid = document.getElementById('calendarGrid');
  const taskList = document.getElementById('taskList');
  const materialRequestsTable = document.getElementById('dashboardMaterialRequestsTable');
  
  // Verificar si los elementos existen
  if (!currentDateElement || !currentMonthElement || !prevMonthBtn || !nextMonthBtn || !calendarGrid || !taskList || !materialRequestsTable) {
    console.error('Elementos del DOM no encontrados');
    return;
  }
  
  // Fecha actual
  let currentDate = new Date();
  let displayMonth = new Date(currentDate);
  let selectedDate = null;
  
  // Nombres de los meses en español
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  
  // Datos de ejemplo (en producción vendrían de una API)
  const tasks = [
    { id: 1, date: '2025-05-10', text: 'Revisar solicitudes de material pendientes', completed: false },
    { id: 2, date: '2025-05-10', text: 'Actualizar inventario de equipos', completed: true },
    { id: 3, date: '2025-05-11', text: 'Confirmar envío de paquetería #12345', completed: false },
    { id: 4, date: '2025-05-11', text: 'Revisar reporte de ventas', completed: false },
    { id: 5, date: '2025-05-12', text: 'Preparar presentación de marketing', completed: false }
  ];

  const materialRequests = [
    { id: 1, folio: 'SOL-2025-001', date: '2025-05-10', requester: 'Juan Pérez', description: 'Herramientas para mantenimiento', status: 'approved' },
    { id: 2, folio: 'SOL-2025-002', date: '2025-05-10', requester: 'María García', description: 'Materiales de oficina', status: 'pending' },
    { id: 3, folio: 'SOL-2025-003', date: '2025-05-11', requester: 'Carlos Rodríguez', description: 'Equipo de seguridad', status: 'rejected' },
    { id: 4, folio: 'SOL-2025-004', date: '2025-05-11', requester: 'Ana López', description: 'Componentes electrónicos', status: 'pending' },
    { id: 5, folio: 'SOL-2025-005', date: '2025-05-12', requester: 'Roberto Martínez', description: 'Refacciones para maquinaria', status: 'approved' }
  ];

  // Inicializar calendario
  updateCalendar();
  updateTasksForDate(currentDate);
  updateMaterialRequestsForDate(currentDate);
  
  // Eventos de botones
  if (prevMonthBtn) {
    prevMonthBtn.addEventListener('click', function() {
      displayMonth.setMonth(displayMonth.getMonth() - 1);
      updateCalendar();
    });
  }

  if (nextMonthBtn) {
    nextMonthBtn.addEventListener('click', function() {
      displayMonth.setMonth(displayMonth.getMonth() + 1);
      updateCalendar();
    });
  }

  // Evento para selección de día
  if (calendarGrid) {
    calendarGrid.addEventListener('click', function(e) {
      if (e.target.classList.contains('calendar-day') && !e.target.classList.contains('empty')) {
        // Desmarcar el día anterior si existe
        if (selectedDate) {
          const prevSelectedDay = document.querySelector('.calendar-day.selected');
          if (prevSelectedDay) {
            prevSelectedDay.classList.remove('selected');
          }
        }

        // Marcar el día seleccionado visualmente
        e.target.classList.add('selected');
        
        // Actualizar la fecha seleccionada
        const day = parseInt(e.target.textContent);
        selectedDate = new Date(displayMonth.getFullYear(), displayMonth.getMonth(), day);
        
        // Actualizar tareas y solicitudes para la fecha seleccionada
        updateTasksForDate(selectedDate);
        updateMaterialRequestsForDate(selectedDate);
      }
    });
  }
  
  // Función para actualizar el calendario
  function updateCalendar() {
    // Actualizar fecha actual mostrada
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    if (currentDateElement) {
      currentDateElement.textContent = currentDate.toLocaleDateString('es-ES', options);
    }
    
    // Actualizar mes y año mostrados
    if (currentMonthElement) {
      currentMonthElement.textContent = `${monthNames[displayMonth.getMonth()]} ${displayMonth.getFullYear()}`;
    }
    
    // Limpiar los días anteriores del calendario (pero mantener los encabezados de los días de la semana)
    const weekdayHeaders = Array.from(calendarGrid.querySelectorAll('.calendar-weekday'));
    calendarGrid.innerHTML = '';
    weekdayHeaders.forEach(header => calendarGrid.appendChild(header));
    
    // Obtener el primer día del mes
    const firstDay = new Date(displayMonth.getFullYear(), displayMonth.getMonth(), 1);
    // Obtener el primer día de la semana (0 = Domingo, 1 = Lunes, etc.)
    const firstDayOfWeek = firstDay.getDay();
    
    // Agregar celdas vacías para los días previos
    for (let i = 0; i < firstDayOfWeek; i++) {
      const emptyDay = document.createElement('div');
      emptyDay.className = 'calendar-day empty';
      calendarGrid.appendChild(emptyDay);
    }
    
    // Determinar cuántos días hay en el mes actual
    const lastDay = new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Agregar los días del mes
    for (let i = 1; i <= daysInMonth; i++) {
      const dayElement = document.createElement('div');
      dayElement.className = 'calendar-day';
      dayElement.textContent = i;
      
      // Verificar si es hoy
      const dayDate = new Date(displayMonth.getFullYear(), displayMonth.getMonth(), i);
      if (isSameDay(dayDate, currentDate)) {
        dayElement.classList.add('today');
      }
      
      // Verificar si es de otro mes (para futuras implementaciones)
      if (displayMonth.getMonth() !== currentDate.getMonth() || 
          displayMonth.getFullYear() !== currentDate.getFullYear()) {
        dayElement.classList.add('other-month');
      }

      // Verificar si hay tareas o solicitudes para este día
      const hasTasks = tasks.some(task => task.date === dayDate.toISOString().split('T')[0]);
      const hasRequests = materialRequests.some(request => request.date === dayDate.toISOString().split('T')[0]);
      
      if (hasTasks || hasRequests) {
        dayElement.classList.add('has-events');
        const eventsCount = hasTasks ? tasks.filter(task => task.date === dayDate.toISOString().split('T')[0]).length : 0;
        const requestsCount = hasRequests ? materialRequests.filter(request => request.date === dayDate.toISOString().split('T')[0]).length : 0;
        const totalEvents = eventsCount + requestsCount;
        
        const eventsBadge = document.createElement('span');
        eventsBadge.className = 'events-badge';
        eventsBadge.textContent = totalEvents;
        dayElement.appendChild(eventsBadge);
      }
      
      calendarGrid.appendChild(dayElement);
    }
  }

  // Función para actualizar las tareas según la fecha
  function updateTasksForDate(date) {
    if (!taskList) return;
    
    const tasksForDate = tasks.filter(task => task.date === date.toISOString().split('T')[0]);
    taskList.innerHTML = '';
    
    tasksForDate.forEach(task => {
      const taskItem = document.createElement('div');
      taskItem.className = 'task-item' + (task.completed ? ' task-completed' : '');
      
      const checkbox = document.createElement('div');
      checkbox.className = 'task-checkbox';
      const checkboxInput = document.createElement('input');
      checkboxInput.type = 'checkbox';
      checkboxInput.checked = task.completed;
      checkbox.appendChild(checkboxInput);
      
      const taskText = document.createElement('span');
      taskText.className = 'task-text';
      taskText.textContent = task.text;
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'task-delete';
      deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
      
      taskItem.appendChild(checkbox);
      taskItem.appendChild(taskText);
      taskItem.appendChild(deleteBtn);
      
      taskList.appendChild(taskItem);
    });
  }

  // Función para actualizar las solicitudes de material según la fecha
  function updateMaterialRequestsForDate(date) {
    if (!materialRequestsTable) return;
    // Solo mostrar solicitudes pendientes del día seleccionado
    const requestsForDate = materialRequests.filter(request => request.date === date.toISOString().split('T')[0] && request.status === 'pending');
    materialRequestsTable.innerHTML = '';
    
    requestsForDate.forEach(request => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${request.folio}</td>
        <td>${formatDate(request.date)}</td>
        <td>${request.requester}</td>
        <td>${request.description}</td>
        <td>${getStatusText(request.status)}</td>
      `;
      materialRequestsTable.appendChild(row);
    });
  }

  // Función para formatear la fecha
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
  }

  // Función para obtener el texto del estado
  function getStatusText(status) {
    const statusMap = {
      'pending': 'Pendiente',
      'approved': 'Aprobada',
      'rejected': 'Rechazada'
    };
    return statusMap[status] || 'Desconocido';
  }

  // Función para verificar si dos fechas son el mismo día
  function isSameDay(date1, date2) {
    return date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear();
  }
});