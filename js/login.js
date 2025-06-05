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
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      clearFieldErrors('#loginForm');
      // Validación centralizada
      const valid = validateRequiredFields('#loginForm', showFieldError);
      if (!valid) {
        showLoginError('Por favor, completa todos los campos obligatorios.');
        return;
      }
      // Indicador de carga
      loginButton.disabled = true;
      loginButton.innerHTML = '<span class="spinner"></span> Iniciando...';
      setTimeout(() => {
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        if (username === 'admin' && password === 'admin123') {
          // Guardar usuario si está marcado el checkbox de recordar
          const remember = document.getElementById('remember');
          if (remember && remember.checked) {
            localStorage.setItem('comintec_user', username);
          } else {
            localStorage.removeItem('comintec_user');
          }
          // Mostrar mensaje solo si falla la redirección
          setTimeout(() => {
            window.location.href = 'main.html';
            setTimeout(() => {
              if (!window.location.pathname.endsWith('main.html')) {
                showLoginError('No se pudo acceder a la página principal.<br>Abre main.html manualmente o usa un servidor local para evitar restricciones del navegador.');
                loginButton.disabled = false;
                loginButton.innerHTML = '<span>Iniciar Sesión</span><i class="fas fa-arrow-right"></i><div class="login-button-ripple"></div>';
              }
            }, 2000);
          }, 500);
        } else {
          showLoginError('Credenciales incorrectas. Usuario: admin, Contraseña: admin123');
          loginButton.disabled = false;
          loginButton.innerHTML = '<span>Iniciar Sesión</span><i class="fas fa-arrow-right"></i><div class="login-button-ripple"></div>';
        }
      }, 1200);
    });
  }

  const savedUser = localStorage.getItem('comintec_user');
  if (savedUser) {
    usernameInput.value = savedUser;
    document.getElementById('remember').checked = true;
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