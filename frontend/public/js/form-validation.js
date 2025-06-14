// Validación centralizada y reutilizable para formularios
// Uso: importar este archivo en las páginas con formularios

export function validateRequiredFields(formSelector, errorCallback) {
  const form = document.querySelector(formSelector);
  if (!form) return false;
  let valid = true;
  form.querySelectorAll('[required]').forEach(input => {
    if (!input.value.trim()) {
      valid = false;
      input.setAttribute('aria-invalid', 'true');
      input.style.borderColor = '#ef4444';
      if (typeof errorCallback === 'function') errorCallback(input, 'Este campo es obligatorio');
    } else {
      input.removeAttribute('aria-invalid');
      input.style.borderColor = '';
    }
  });
  return valid;
}

export function showFieldError(input, message) {
  let errorSpan = input.parentElement.querySelector('.field-error');
  if (!errorSpan) {
    errorSpan = document.createElement('span');
    errorSpan.className = 'field-error';
    errorSpan.style.color = 'red';
    errorSpan.setAttribute('role', 'alert');
    errorSpan.setAttribute('aria-live', 'assertive');
    input.parentElement.appendChild(errorSpan);
  }
  errorSpan.textContent = message;
}

export function clearFieldErrors(formSelector) {
  const form = document.querySelector(formSelector);
  if (!form) return;
  form.querySelectorAll('.field-error').forEach(span => span.remove());
  form.querySelectorAll('[aria-invalid]').forEach(input => {
    input.removeAttribute('aria-invalid');
    input.style.borderColor = '';
  });
}