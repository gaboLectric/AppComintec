// Funcionalidad de la página de inicio de sesión
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const togglePasswordButton = document.getElementById('togglePassword');
  const loginButton = document.getElementById('loginBtn');
  const loginButtonRipple = document.querySelector('.login-button-ripple');
  const errorMessageDiv = document.getElementById('loginErrorMessage'); // Referencia al div de error

  if (togglePasswordButton) {
    togglePasswordButton.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      togglePasswordButton.querySelector('i').classList.toggle('fa-eye');
      togglePasswordButton.querySelector('i').classList.toggle('fa-eye-slash');
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
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault(); 
      hideLoginError(); // Ocultar errores previos

      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();

      const defaultUsername = 'admin';
      const defaultPassword = 'admin123';

      if (!username || !password) {
        showLoginError('Por favor, ingresa tu usuario y contraseña.');
        return;
      }

      if (username === defaultUsername && password === defaultPassword) {
        if (loginButton) {
            const rippleContainer = loginButton.querySelector('.login-button-ripple') || document.createElement('div');
            if (!loginButton.querySelector('.login-button-ripple')) {
                rippleContainer.className = 'login-button-ripple';
                loginButton.appendChild(rippleContainer);
                rippleContainer.style.position = 'absolute';
                rippleContainer.style.top = '0';
                rippleContainer.style.left = '0';
                rippleContainer.style.width = '100%';
                rippleContainer.style.height = '100%';
                rippleContainer.style.overflow = 'hidden';
                rippleContainer.style.zIndex = '-1'; 
            }
            
            const ripple = document.createElement('span');
            const rect = rippleContainer.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${(rippleContainer.offsetWidth / 2) - (size / 2)}px`;
            ripple.style.top = `${(rippleContainer.offsetHeight / 2) - (size / 2)}px`;
            
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';

            rippleContainer.appendChild(ripple);

            ripple.addEventListener('animationend', () => {
              ripple.remove();
            });
        }
        
        setTimeout(() => {
          navigateWithTransition('main.html'); // Usar la función de transición
        }, 300); 
      } else {
        showLoginError('Usuario o contraseña incorrectos.');
      }
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