document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');
  const areaLockBtn = document.getElementById('areaLockBtn');
  const areaLockBtnText = document.getElementById('areaLockBtnText'); 
  const areaStatesContainer = document.getElementById('areaStates');

  // Theme Toggling Logic
  if (themeToggle) {
    const themeIcon = themeToggle.querySelector('i');

    // Function to apply the theme
    function applyTheme(theme) {
      if (theme === 'dark') {
        body.classList.add('dark-mode');
        if (themeIcon) {
          themeIcon.classList.remove('fa-moon');
          themeIcon.classList.add('fa-sun');
        }
      } else {
        body.classList.remove('dark-mode');
        if (themeIcon) {
          themeIcon.classList.remove('fa-sun');
          themeIcon.classList.add('fa-moon');
        }
      }
    }

    // Load saved theme or default to 'light'
    let currentTheme = localStorage.getItem('theme') || 'light';
    applyTheme(currentTheme); // Apply the initial theme

    themeToggle.addEventListener('click', () => {
      if (body.classList.contains('dark-mode')) {
        currentTheme = 'light';
      } else {
        currentTheme = 'dark';
      }
      localStorage.setItem('theme', currentTheme);
      applyTheme(currentTheme);
    });
  }

  // Mobile Menu Toggle
  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      mobileMenuToggle.classList.toggle('active'); // For styling the toggle button itself if needed
    });
  }

  // Dropdown Menu Logic
  const dropdowns = document.querySelectorAll('.nav-dropdown > .nav-item');
  dropdowns.forEach(dropdownToggle => {
    dropdownToggle.addEventListener('click', (event) => {
      // Prevent navigation if it's just a dropdown toggle
      if (dropdownToggle.getAttribute('href') === '#') {
        event.preventDefault();
      }
      
      const dropdownMenu = dropdownToggle.nextElementSibling;
      if (dropdownMenu && dropdownMenu.classList.contains('nav-dropdown-menu')) {
        // Close other open dropdowns
        document.querySelectorAll('.nav-dropdown-menu.active').forEach(openMenu => {
          if (openMenu !== dropdownMenu) {
            openMenu.classList.remove('active');
            openMenu.previousElementSibling.classList.remove('active');
          }
        });
        
        dropdownMenu.classList.toggle('active');
        dropdownToggle.classList.toggle('active'); // For styling the toggle itself
      }
    });
  });

  // Close dropdowns if clicking outside
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.nav-dropdown') && !event.target.closest('.mobile-menu-toggle')) {
      document.querySelectorAll('.nav-dropdown-menu.active').forEach(openMenu => {
        openMenu.classList.remove('active');
        openMenu.previousElementSibling.classList.remove('active');
      });
      // Close mobile menu if open and click is outside
      if (navMenu && navMenu.classList.contains('active') && !event.target.closest('.navbar')) {
         // navMenu.classList.remove('active');
         // if(mobileMenuToggle) mobileMenuToggle.classList.remove('active');
         // Consider if mobile menu should close on any outside click or only specific conditions
      }
    }
  });

  // Area Lock Button Logic
  function updateAreaLockButtonState() {
    if (!areaLockBtn) {
      console.warn('Botón areaLockBtn no encontrado.');
      return;
    }
    if (!areaStatesContainer) {
      console.warn('Contenedor areaStatesContainer no encontrado. El botón de bloqueo no funcionará correctamente.');
      areaLockBtn.disabled = true;
      if (areaLockBtnText) areaLockBtnText.textContent = 'Error de Carga';
      return;
    }

    // Cambiar el selector para que coincida con tu HTML: '.area-card'
    const areaItems = areaStatesContainer.querySelectorAll('.area-card'); 
    let allAreasCompleted = true;
    let completedCount = 0;

    if (areaItems.length === 0) {
      allAreasCompleted = false;
    } else {
      areaItems.forEach((item, index) => {
        // Verificar si el hijo .area-progress-bar tiene la clase 'completed'
        const progressBar = item.querySelector('.area-progress-bar');
        if (!progressBar || !progressBar.classList.contains('completed')) {
          allAreasCompleted = false;
        } else {
          completedCount++;
        }
      });
    }
    
    if (areaItems.length > 0) {
        console.log(`Revisión de áreas: ${completedCount} de ${areaItems.length} están marcadas como completadas (verificando .area-progress-bar.completed).`);
        if (allAreasCompleted) {
            console.log('Todas las áreas encontradas están completadas.');
        } else {
            console.log('No todas las áreas encontradas están completadas.');
        }
    } else {
        console.log('No se encontraron elementos de área (.area-card) en updateAreaLockButtonState. El botón permanecerá deshabilitado hasta que las áreas se carguen y se notifique.');
    }

    const icon = areaLockBtn.querySelector('i');
    
    if (areaLockBtn.classList.contains('locked')) {
      // Si está bloqueado, el botón permite desbloquear.
      // Asumimos que la visibilidad/disponibilidad de este botón para el admin ya está manejada.
      areaLockBtn.disabled = false; // El botón de desbloqueo siempre está habilitado para el admin
      if (areaLockBtnText) areaLockBtnText.textContent = 'Desbloquear Flujo';
      if (icon) {
        icon.classList.remove('fa-lock-open');
        icon.classList.add('fa-unlock'); // Cambiar a ícono de desbloqueo
      }
      console.log('Botón en estado "locked", configurado para DESBLOQUEAR.');
    } else {
      // Si no está bloqueado, verificar si se puede bloquear (todas las áreas completas)
      if (allAreasCompleted && areaItems.length > 0) {
        areaLockBtn.disabled = false;
        if (areaLockBtnText) areaLockBtnText.textContent = 'Bloquear Flujo';
        if (icon) {
          icon.classList.remove('fa-unlock'); // Asegurarse de quitar el ícono de desbloqueo
          icon.classList.add('fa-lock-open');
        }
        console.log('Botón habilitado para BLOQUEAR.');
      } else {
        areaLockBtn.disabled = true;
        if (areaLockBtnText) areaLockBtnText.textContent = 'Bloquear Flujo';
        if (icon) {
          icon.classList.remove('fa-unlock'); // Asegurarse de quitar el ícono de desbloqueo
          icon.classList.add('fa-lock-open');
        }
        console.log('Botón deshabilitado para bloquear (no todas las áreas completas o no hay áreas).');
      }
    }
  }

  if (areaLockBtn) {
    areaLockBtn.addEventListener('click', () => {
      if (areaLockBtn.classList.contains('locked')) {
        // Acción de DESBLOQUEAR
        areaLockBtn.classList.remove('locked');
        console.log("Flujo DESBLOQUEADO por clic.");
        // Aquí podrías añadir lógica adicional si el desbloqueo implica otras acciones.
      } else {
        // Acción de BLOQUEAR (solo si no está deshabilitado)
        if (!areaLockBtn.disabled) {
          areaLockBtn.classList.add('locked');
          console.log("Flujo BLOQUEADO por clic.");
          // Aquí iría la lógica para "bloquear el flujo" realmente.
        }
      }
      updateAreaLockButtonState(); // Actualizar estado visual y de habilitación del botón
    });
  }

  console.log("Llamando a updateAreaLockButtonState en DOMContentLoaded (puede ser antes de que areas.js popule).");
  updateAreaLockButtonState();

  if (areaStatesContainer) {
    console.log("Listener para 'areasUpdated' en areaStatesContainer está ACTIVO.");
    areaStatesContainer.addEventListener('areasUpdated', (e) => {
      console.log("Evento 'areasUpdated' RECIBIDO.", e.detail || '');
      updateAreaLockButtonState();
    });

    // Fallback con MutationObserver
    const observer = new MutationObserver((mutationsList, observer) => {
      console.log('MutationObserver detectó cambios en areaStatesContainer. Actualizando botón de bloqueo.');
      updateAreaLockButtonState();
    });

    // Configuración del observador:
    const config = { childList: true, subtree: true };

    // Empezar a observar el nodo objetivo para las mutaciones configuradas
    observer.observe(areaStatesContainer, config);
    console.log('MutationObserver para areaStatesContainer está ACTIVO.');

  } else {
    console.warn("Contenedor areaStatesContainer no encontrado al configurar listeners y observer.");
  }

  // Interceptar clics en enlaces de navegación para transiciones suaves
  const internalLinks = document.querySelectorAll(
    'nav a.nav-item, nav a.nav-dropdown-item, a.card-link[href$=".html"]'
  );

  internalLinks.forEach(link => {
    const href = link.getAttribute('href');
    // Asegurarse de que el enlace es interno, no un ancla (#) y no un dropdown toggle sin URL real
    if (href && href !== '#' && link.hostname === window.location.hostname &&
        (link.pathname !== window.location.pathname || link.search !== window.location.search)) {
      
      link.addEventListener('click', function(event) {
        event.preventDefault(); // Prevenir navegación inmediata
        const destinationUrl = this.href;
        if (typeof navigateWithTransition === 'function') {
          navigateWithTransition(destinationUrl);
        } else {
          window.location.href = destinationUrl; // Fallback si la función no existe
        }
      });
    }
  });

  // Placeholder for other main.js functionalities if any
  console.log("Main.js loaded and initialized. Default theme: light (if no preference saved).");
});