document.addEventListener('DOMContentLoaded', function() {
  // Elementos del DOM
  const areaStatesContainer = document.getElementById('areaStates');
  const areaLockBtn = document.getElementById('areaLockBtn');
  
  // Estado de la aplicación
  let isLocked = false;
  let areas = [
    { id: 'almacen', name: 'Almacén', status: 'review', update: 'Inventario en revisión.', lastUpdate: '3/4/2025, 8:20:00 a.m.' },
    { id: 'administracion', name: 'Administración', status: 'completed', update: 'Proceso finalizado correctamente.', lastUpdate: '3/4/2025, 8:18:00 a.m.' },
    { id: 'compras', name: 'Compras', status: 'pending', update: 'Pedidos pendientes de confirmación.', lastUpdate: '3/4/2025, 8:15:00 a.m.' },
    { id: 'ventas', name: 'Ventas', status: 'review', update: 'Facturas en revisión.', lastUpdate: '3/4/2025, 8:10:00 a.m.' },
    { id: 'metrologia', name: 'Metrología', status: 'completed', update: 'Calibraciones completadas.', lastUpdate: '3/4/2025, 8:02:00 a.m.' },
    { id: 'informes', name: 'Informes', status: 'pending', update: 'Generación de informes pendiente.', lastUpdate: '3/4/2025, 7:59:00 a.m.' },
    { id: 'marketing', name: 'Marketing', status: 'pending', update: 'Campañas en planificación.', lastUpdate: '3/4/2025, 7:50:00 a.m.' },
    { id: 'calidad', name: 'Calidad', status: 'completed', update: 'Auditorías terminadas.', lastUpdate: '3/4/2025, 7:45:00 a.m.' }
  ];
  
  // Mapeo de iconos y estados
  const statusIcons = {
    pending: '⏳',
    review: '🔍',
    completed: '✅'
  };
  
  // Inicializar panel de áreas
  renderAreas();
  
  // Eventos
  areaLockBtn.addEventListener('click', toggleLock);
  
  // Función para renderizar las áreas
  function renderAreas() {
    areaStatesContainer.innerHTML = '';
    areas.forEach((area, idx) => {
      const isEditing = area.editing;
      const areaCard = document.createElement('div');
      areaCard.className = 'bg-white dark:bg-gray-800 rounded-xl shadow p-5 flex flex-col gap-2 relative border border-gray-200 dark:border-gray-700';
      areaCard.dataset.id = area.id;

      // Header: nombre y estado
      const header = document.createElement('div');
      header.className = 'flex items-center justify-between mb-2';
      const title = document.createElement('h3');
      title.className = 'font-mono font-bold text-lg text-gray-800 dark:text-gray-100';
      title.textContent = area.name;
      // Estado badge
      const statusBadge = document.createElement('span');
      statusBadge.className = {
        pending: 'bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-xs font-semibold',
        review: 'bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs font-semibold',
        completed: 'bg-green-200 text-green-800 px-2 py-1 rounded text-xs font-semibold'
      }[area.status];
      statusBadge.textContent = area.status === 'pending' ? 'Pendiente' : area.status === 'review' ? 'Revisión' : 'Completada';
      header.appendChild(title);
      header.appendChild(statusBadge);

      // Botón editar (ahora abajo a la derecha)
      const editBtn = document.createElement('button');
      editBtn.className = 'edit-pencil-btn fixed-pencil-btn bg-white shadow-lg rounded-full w-10 h-10 flex items-center justify-center transition-all duration-200 hover:scale-110 hover:bg-blue-100 hover:shadow-xl border border-gray-200';
      editBtn.innerHTML = '<i class="fas fa-pen text-lg text-gray-400 hover:text-blue-500 transition-colors duration-200"></i>';
      editBtn.title = 'Editar actualización';

      // Mini formulario de edición
      if (isEditing) {
        // Formulario
        const form = document.createElement('form');
        form.className = 'flex flex-col gap-3 p-3 border border-blue-300 rounded-lg bg-blue-50 animate-fade-in shadow-md';
        form.onsubmit = e => {
          e.preventDefault();
          areas[idx].status = form.status.value;
          areas[idx].update = form.update.value;
          areas[idx].lastUpdate = new Date().toLocaleString('es-MX');
          delete areas[idx].editing;
          renderAreas();
        };
        // Estado select
        const select = document.createElement('select');
        select.name = 'status';
        select.className = 'font-mono border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white transition-all duration-200';
        ['pending','review','completed'].forEach(st => {
          const opt = document.createElement('option');
          opt.value = st;
          opt.textContent = st === 'pending' ? 'Pendiente' : st === 'review' ? 'Revisión' : 'Completada';
          if (area.status === st) opt.selected = true;
          select.appendChild(opt);
        });
        // Texto actualización
        const textarea = document.createElement('textarea');
        textarea.name = 'update';
        textarea.className = 'font-mono border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white transition-all duration-200';
        textarea.rows = 3;
        textarea.value = area.update;
        // Botones
        const btns = document.createElement('div');
        btns.className = 'flex gap-2 mt-2';
        const saveBtn = document.createElement('button');
        saveBtn.type = 'submit';
        saveBtn.className = 'bg-blue-500 hover:bg-blue-600 text-white font-mono font-semibold px-4 py-2 rounded shadow transition-all duration-200';
        saveBtn.textContent = 'Guardar Cambios';
        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.className = 'bg-gray-200 hover:bg-gray-300 text-gray-600 font-mono font-semibold px-4 py-2 rounded shadow transition-all duration-200';
        cancelBtn.textContent = 'Cancelar';
        cancelBtn.onclick = () => {
          delete areas[idx].editing;
          renderAreas();
        };
        btns.appendChild(saveBtn);
        btns.appendChild(cancelBtn);
        // Agregar al form
        form.appendChild(select);
        form.appendChild(textarea);
        form.appendChild(btns);
        areaCard.appendChild(header);
        areaCard.appendChild(form);
      } else {
        // Texto de actualización (no editable)
        const updateDiv = document.createElement('div');
        updateDiv.className = 'font-mono text-orange-500 text-base break-words min-h-[32px] animate-fade-in';
        updateDiv.textContent = area.update;
        // Fecha de última actualización
        const dateDiv = document.createElement('div');
        dateDiv.className = 'text-xs text-gray-400 mt-1';
        dateDiv.textContent = `Última actualización: ${area.lastUpdate}`;
        // Quitar los botones de estado de la parte de abajo
        areaCard.appendChild(header);
        areaCard.appendChild(updateDiv);
        areaCard.appendChild(dateDiv);
      }
      // Editar actualización
      editBtn.onclick = () => {
        if (isLocked) return;
        areas[idx].editing = true;
        renderAreas();
      };
      // Mover el botón de edición al final de la tarjeta
      areaCard.appendChild(editBtn);
      areaStatesContainer.appendChild(areaCard);
    });
  }
  
  // Función para cambiar el estado de un área
  function changeAreaState(areaId, newStatus) {
    if (isLocked) return;
    
    areas = areas.map(area => {
      if (area.id === areaId) {
        return { ...area, status: newStatus };
      }
      return area;
    });
    
    renderAreas();
  }
  
  // Función para activar/desactivar el bloqueo
  function toggleLock() {
    isLocked = !isLocked;
    
    if (isLocked) {
      areaLockBtn.innerHTML = '<i class="fas fa-lock"></i> Desbloquear Flujo';
    } else {
      areaLockBtn.innerHTML = '<i class="fas fa-lock-open"></i> Bloquear Flujo';
    }
    
    renderAreas();
  }
});