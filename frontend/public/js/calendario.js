// public/js/calendario.js
// Gestiona la vista de calendario y los eventos de ejemplo

(function () {
  // --- Datos de ejemplo (sustituir por API REST posteriormente) ---
  const events = [
    { id: 1, date: '2025-05-10', title: 'Revisar solicitudes de material pendientes', type: 'tarea', user: 'Juan', status: 'pending', completed: false },
    { id: 2, date: '2025-05-10', title: 'Actualizar inventario de equipos', type: 'tarea', user: 'María', status: 'approved', completed: true },
    { id: 3, date: '2025-05-11', title: 'Confirmar envío de paquetería #12345', type: 'logística', user: 'Carlos', status: 'pending', completed: false },
    { id: 4, date: '2025-05-11', title: 'Revisar reporte de ventas', type: 'ventas', user: 'Ana', status: 'pending', completed: false },
    { id: 5, date: '2025-05-12', title: 'Preparar presentación de marketing', type: 'marketing', user: 'Roberto', status: 'pending', completed: false }
  ];

  // --- Referencias DOM clave ---
  const calendarTitleEl = document.getElementById('calendarTitle');
  const calendarGridEl = document.getElementById('calendarGrid');
  const todayCountEl = document.getElementById('todayCount');
  const upcomingCountEl = document.getElementById('upcomingCount');
  const overdueCountEl = document.getElementById('overdueCount');
  const todayEventsEl = document.getElementById('todayEvents');
  const upcomingEventsEl = document.getElementById('upcomingEvents');
  const overdueEventsEl = document.getElementById('overdueEvents');
  const eventTypeFilterEl = document.getElementById('eventTypeFilter');
  const userFilterEl = document.getElementById('userFilter');

  // Config inicial
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const today = new Date();
  let currentView = 'month';
  let displayDate = new Date(today);

  // --- Funciones utilitarias ---
  const toISODate = (d) => d.toISOString().split('T')[0];
  const isSameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  const addDays = (date, n) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + n);

  function renderCalendar() {
    if (!calendarGridEl) return;

    // Título Mes/Año
    calendarTitleEl.textContent = `${monthNames[displayDate.getMonth()]} ${displayDate.getFullYear()}`;

    // Limpiar grid
    calendarGridEl.innerHTML = '';

    // Calcula primer día del mes y total días
    const firstDayMonth = new Date(displayDate.getFullYear(), displayDate.getMonth(), 1);
    const firstWeekday = firstDayMonth.getDay(); // 0 domingo
    const daysInMonth = new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 0).getDate();

    // Huecos previos
    for (let i = 0; i < firstWeekday; i++) {
      const empty = document.createElement('div');
      empty.className = 'calendar-day empty';
      calendarGridEl.appendChild(empty);
    }

    // Días del mes
    for (let d = 1; d <= daysInMonth; d++) {
      const cell = document.createElement('div');
      cell.className = 'calendar-day';
      cell.textContent = d;

      const dateObj = new Date(displayDate.getFullYear(), displayDate.getMonth(), d);
      if (isSameDay(dateObj, today)) cell.classList.add('today');

      const dayEvents = events.filter(ev => ev.date === toISODate(dateObj));
      if (dayEvents.length) {
        cell.classList.add('has-events');
        const badge = document.createElement('span');
        badge.className = 'events-badge';
        badge.textContent = dayEvents.length;
        cell.appendChild(badge);
      }

      // Click para seleccionar día
      cell.addEventListener('click', () => openDay(dateObj));
      calendarGridEl.appendChild(cell);
    }
  }

  function openDay(dateObj) {
    // Highlight seleccionado
    calendarGridEl.querySelectorAll('.calendar-day.selected').forEach(el => el.classList.remove('selected'));
    const index = Array.from(calendarGridEl.children).findIndex(el => el.textContent == dateObj.getDate() && !el.classList.contains('empty'));
    if (index > -1) calendarGridEl.children[index].classList.add('selected');

    renderSidebarLists(dateObj);
  }

  function renderSidebarLists(baseDate) {
    // Filtrar eventos
    const todayIso = toISODate(baseDate);
    const todayEvents = events.filter(ev => ev.date === todayIso);
    const upcomingEvents = events.filter(ev => ev.date > todayIso);
    const overdueEvents = events.filter(ev => ev.date < todayIso && !ev.completed);

    populateList(todayEventsEl, todayEvents);
    populateList(upcomingEventsEl, upcomingEvents.slice(0, 20));
    populateList(overdueEventsEl, overdueEvents.slice(0, 20));

    todayCountEl.textContent = todayEvents.length;
    upcomingCountEl.textContent = upcomingEvents.length;
    overdueCountEl.textContent = overdueEvents.length;
  }

  function populateList(container, list) {
    if (!container) return;
    container.innerHTML = '';
    if (!list.length) {
      container.innerHTML = '<div class="empty">Sin eventos</div>';
      return;
    }
    list.forEach(ev => {
      const item = document.createElement('div');
      item.className = 'event-item';
      item.textContent = `${formatDate(ev.date)} - ${ev.title}`;
      container.appendChild(item);
    });
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return `${d.getDate()} ${monthNames[d.getMonth()]}`;
  }

  function changeView(view) {
    currentView = view;
    // En esta versión demo, solo cambia estilo activo
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.classList.toggle('active', btn.textContent.toLowerCase().includes(view))
    });
  }

  function navigateCalendar(direction) {
    if (direction === 'prev') displayDate.setMonth(displayDate.getMonth() - 1);
    else if (direction === 'next') displayDate.setMonth(displayDate.getMonth() + 1);
    renderCalendar();
  }

  function goToToday() {
    displayDate = new Date(today);
    renderCalendar();
  }

  // --- Filtros (demo) ---
  function applyFilters() {
    // TODO: filtrar events array según selects.
    console.log('Filtros cambiados', eventTypeFilterEl.value, userFilterEl.value);
  }

  // --- Modales (demo) ---
  function openModal(id) {
    const m = document.getElementById(id);
    if (m) m.style.display = 'block';
  }
  function closeModal(id) {
    const m = document.getElementById(id);
    if (m) m.style.display = 'none';
  }

  function saveEvent() {
    // TODO: tomar datos del formulario y agregar a events[]
    alert('Función guardar evento (no implementada)');
    closeModal('newEventModal');
  }

  function markEventCompleted() {
    alert('Marcar completado (no implementado)');
  }
  function editEventFromDetails() {
    alert('Editar evento (no implementado)');
  }

  // --- Init ---
  document.addEventListener('DOMContentLoaded', () => {
    // Poblar selects de filtro
    const types = [...new Set(events.map(e => e.type))];
    types.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t; opt.textContent = t.charAt(0).toUpperCase() + t.slice(1);
      eventTypeFilterEl.appendChild(opt);
    });
    const users = [...new Set(events.map(e => e.user))];
    users.forEach(u => {
      const opt = document.createElement('option');
      opt.value = u; opt.textContent = u;
      userFilterEl.appendChild(opt);
    });

    renderCalendar();
    openDay(today);
  });

  // Exponer API global para los onclick inline
  window.calendarioManager = {
    changeView,
    navigateCalendar,
    goToToday,
    openModal,
    closeModal,
    applyFilters,
    saveEvent,
    markEventCompleted,
    editEventFromDetails
  };
})();
