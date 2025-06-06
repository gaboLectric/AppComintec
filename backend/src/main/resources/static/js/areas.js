document.addEventListener('DOMContentLoaded', function() {
  // Elementos del DOM
  const areaStatesContainer = document.getElementById('areaStates');
  const areaLockBtn = document.getElementById('areaLockBtn');
  
  // Estado de la aplicación
  let isLocked = false;
  let areas = [
    { id: 'home', name: 'Home', status: 'pending' },
    { id: 'almacen', name: 'Almacén', status: 'review' },
    { id: 'administracion', name: 'Administración', status: 'completed' },
    { id: 'compras', name: 'Compras', status: 'pending' },
    { id: 'ventas', name: 'Ventas', status: 'review' },
    { id: 'servicio', name: 'Servicio', status: 'pending' },
    { id: 'metrologia', name: 'Metrología', status: 'completed' },
    { id: 'informes', name: 'Informes', status: 'pending' },
    { id: 'sistemas', name: 'Sistemas', status: 'review' },
    { id: 'marketing', name: 'Marketing', status: 'pending' },
    { id: 'calidad', name: 'Calidad', status: 'completed' }
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
    // Limpiar contenedor
    areaStatesContainer.innerHTML = '';
    
    // Crear tarjetas de áreas
    areas.forEach(area => {
      const areaCard = document.createElement('div');
      areaCard.className = 'area-card';
      areaCard.dataset.id = area.id;
      
      // Icono del estado
      const areaIcon = document.createElement('div');
      areaIcon.className = 'area-icon';
      areaIcon.textContent = statusIcons[area.status];
      
      // Barra de progreso
      const areaProgress = document.createElement('div');
      areaProgress.className = 'area-progress';
      
      const progressBar = document.createElement('div');
      progressBar.className = `area-progress-bar ${area.status}`;
      areaProgress.appendChild(progressBar);
      
      // Título del área
      const areaTitle = document.createElement('div');
      areaTitle.className = 'area-title';
      areaTitle.textContent = area.name;
      
      // Botones de acción
      const areaActions = document.createElement('div');
      areaActions.className = 'area-actions';
      
      // Botón pendiente
      const pendingBtn = document.createElement('button');
      pendingBtn.className = 'area-btn area-btn-pending';
      pendingBtn.textContent = 'Pendiente';
      pendingBtn.disabled = isLocked;
      pendingBtn.addEventListener('click', () => changeAreaState(area.id, 'pending'));
      
      // Botón revisión
      const reviewBtn = document.createElement('button');
      reviewBtn.className = 'area-btn area-btn-review';
      reviewBtn.textContent = 'Revisión';
      reviewBtn.disabled = isLocked;
      reviewBtn.addEventListener('click', () => changeAreaState(area.id, 'review'));
      
      // Botón completado
      const completedBtn = document.createElement('button');
      completedBtn.className = 'area-btn area-btn-completed';
      completedBtn.textContent = 'Completado';
      completedBtn.disabled = isLocked;
      completedBtn.addEventListener('click', () => changeAreaState(area.id, 'completed'));
      
      // Añadir botones a acciones
      areaActions.appendChild(pendingBtn);
      areaActions.appendChild(reviewBtn);
      areaActions.appendChild(completedBtn);
      
      // Añadir elementos a la tarjeta
      areaCard.appendChild(areaIcon);
      areaCard.appendChild(areaProgress);
      areaCard.appendChild(areaTitle);
      areaCard.appendChild(areaActions);
      
      // Añadir tarjeta al contenedor
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