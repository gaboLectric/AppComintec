document.addEventListener('DOMContentLoaded', function() {
  // Elementos del DOM
  const currentDateElement = document.getElementById('currentDate');
  const currentMonthElement = document.getElementById('currentMonth');
  const prevMonthBtn = document.getElementById('prevMonth');
  const nextMonthBtn = document.getElementById('nextMonth');
  const calendarGrid = document.getElementById('calendarGrid');
  
  // Fecha actual
  let currentDate = new Date();
  let displayMonth = new Date(currentDate);
  
  // Nombres de los meses en español
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  
  // Inicializar calendario
  updateCalendar();
  
  // Eventos de botones
  prevMonthBtn.addEventListener('click', function() {
    displayMonth.setMonth(displayMonth.getMonth() - 1);
    updateCalendar();
  });
  
  nextMonthBtn.addEventListener('click', function() {
    displayMonth.setMonth(displayMonth.getMonth() + 1);
    updateCalendar();
  });
  
  // Función para actualizar el calendario
  function updateCalendar() {
    // Actualizar fecha actual mostrada
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    currentDateElement.textContent = currentDate.toLocaleDateString('es-ES', options);
    
    // Actualizar mes y año mostrados
    currentMonthElement.textContent = `${monthNames[displayMonth.getMonth()]} ${displayMonth.getFullYear()}`;
    
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
      
      calendarGrid.appendChild(dayElement);
    }
  }
  
  // Función para verificar si dos fechas son el mismo día
  function isSameDay(date1, date2) {
    return date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear();
  }
});