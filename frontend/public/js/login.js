import { validateRequiredFields, showFieldError, clearFieldErrors } from './form-validation.js';

// Funcionalidad de la página de inicio de sesión
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const togglePasswordButton = document.getElementById('togglePassword');
  const loginButton = document.getElementById('loginBtn');
  const loginButtonRipple = document.querySelector('.login-button-ripple');
  const errorMessageDiv = document.getElementById('loginErrorMessage'); // Referencia al div de error

  if (togglePasswordButton && passwordInput) {
    togglePasswordButton.addEventListener('click', () => {
      const isPassword = passwordInput.getAttribute('type') === 'password';
      passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
      const icon = togglePasswordButton.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-eye', !isPassword);
        icon.classList.toggle('fa-eye-slash', isPassword);
      }
    });
  }

  // Función para mostrar mensajes de error
  function showLoginError(message) {
    if (errorMessageDiv) {
      errorMessageDiv.textContent = message;
      errorMessageDiv.style.display = 'block';
    }
    if (loginButton) {
      loginButton.classList.add('shake-error');
      // Quitar la animación después de que termine para que pueda volver a activarse
      setTimeout(() => {
        loginButton.classList.remove('shake-error');
      }, 500); // Duración de la animación shake-error
    }
    // También podrías aplicar shake a los campos de input
    if (usernameInput) usernameInput.classList.add('shake-error');
    if (passwordInput) passwordInput.classList.add('shake-error');
    setTimeout(() => {
        if (usernameInput) usernameInput.classList.remove('shake-error');
        if (passwordInput) passwordInput.classList.remove('shake-error');
    }, 500);
  }

  // Función para ocultar mensajes de error
  function hideLoginError() {
    if (errorMessageDiv) {
      errorMessageDiv.style.display = 'none';
      errorMessageDiv.textContent = '';
    }
  }

  // Ocultar mensaje de error cuando el usuario empieza a escribir
  if (usernameInput) {
    usernameInput.addEventListener('input', hideLoginError);
  }
  if (passwordInput) {
    passwordInput.addEventListener('input', hideLoginError);
  }

  // Agregar efecto de ripple al botón de inicio de sesión
  loginButton.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = loginButton.getBoundingClientRect();
    
    const xPos = e.clientX - rect.left;
    const yPos = e.clientY - rect.top;
    
    const size = Math.max(rect.width, rect.height) * 1.5;
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${xPos - size/2}px`;
    ripple.style.top = `${yPos - size/2}px`;
    
    loginButtonRipple.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  });

  if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      clearFieldErrors('#loginForm');
      const valid = validateRequiredFields('#loginForm', showFieldError);
      if (!valid) {
        showLoginError('Por favor, completa todos los campos obligatorios.');
        return;
      }
      loginButton.disabled = true;
      loginButton.innerHTML = '<span class="spinner"></span> Iniciando...';
      const username = usernameInput.value.trim();
      const password = passwordInput.value;
      try {
        const response = await fetch('/api/auth/signin', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ username, password })
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Login response:', data);
          
          // Verificar si el token está en la respuesta
          const token = data.accessToken || data.token;
          if (token) {
            console.log('Setting token in localStorage');
            localStorage.setItem('token', token);
            // Verificar que el token se guardó correctamente
            console.log('Token stored in localStorage:', localStorage.getItem('token'));
            // Redirigir a la página principal - usando la ruta correcta
            window.location.href = '/html/main.html';
          } else {
            console.error('No token found in response:', data);
            showLoginError('No se recibió el token de autenticación');
          }
        } else {
          const error = await response.json();
          showLoginError(error.message || 'Credenciales incorrectas.');
          loginButton.disabled = false;
          loginButton.innerHTML = '<span>Iniciar Sesión</span><i class="fas fa-arrow-right"></i><div class="login-button-ripple"></div>';
        }
      } catch (err) {
        showLoginError('Error de red o servidor.');
        loginButton.disabled = false;
        loginButton.innerHTML = '<span>Iniciar Sesión</span><i class="fas fa-arrow-right"></i><div class="login-button-ripple"></div>';
      }
    });
  }

  // Cargar datos guardados si existen
  const savedUser = localStorage.getItem('username');
  const rememberMe = localStorage.getItem('remember_me');
  
  if (savedUser && rememberMe === 'true') {
    usernameInput.value = savedUser;
    document.getElementById('remember').checked = true;
    passwordInput.focus();
  } else {
    // Limpiar datos de sesión si no se marcó recordar
    localStorage.removeItem('auth_token');
    localStorage.removeItem('username');
    localStorage.removeItem('fullName');
  }

  document.querySelectorAll('.shape').forEach(shape => {
    const randomX = Math.random() * 20 - 10;
    const randomY = Math.random() * 20 - 10;
    const randomRotate = Math.random() * 10 - 5;
    
    shape.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotate}deg)`;
  });

  const typingTextElement = document.querySelector('.typing-text');
  if (typingTextElement) {
    const textToType = typingTextElement.textContent;
    typingTextElement.textContent = '';
    typingTextElement.style.borderRight = '2px solid rgba(255, 255, 255, 0.75)';
    
    let i = 0;
    function typeWriter() {
      if (i < textToType.length) {
        typingTextElement.textContent += textToType.charAt(i);
        i++;
        setTimeout(typeWriter, 50);
      } else {
        typingTextElement.style.animation = 'typing 4s steps(40, end) forwards, blink-caret 0.75s step-end infinite';
      }
    }
    setTimeout(typeWriter, 500);
  }

  if (loginButton && !loginButton.querySelector('.login-button-ripple')) {
    const rippleContainer = document.createElement('div');
    rippleContainer.className = 'login-button-ripple';
    loginButton.appendChild(rippleContainer);
    rippleContainer.style.position = 'absolute';
    rippleContainer.style.top = '0';
    rippleContainer.style.left = '0';
    rippleContainer.style.width = '100%';
    rippleContainer.style.height = '100%';
    rippleContainer.style.overflow = 'hidden';
    rippleContainer.style.pointerEvents = 'none';
    rippleContainer.style.zIndex = '0';

    loginButton.addEventListener('click', function (e) {
      if (e.target.type === 'submit' && e.isTrusted) {
        return;
      }

      const rect = rippleContainer.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);

      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - (size / 2)}px`;
      ripple.style.top = `${e.clientY - rect.top - (size / 2)}px`;
      ripple.style.position = 'absolute';
      ripple.style.borderRadius = '50%';
      ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
      ripple.style.transform = 'scale(0)';
      ripple.style.animation = 'ripple 0.6s linear';

      rippleContainer.appendChild(ripple);

      ripple.addEventListener('animationend', () => {
        ripple.remove();
      });
    });
  }
});