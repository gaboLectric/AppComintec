// Aplica la clase base para la transición y luego el fade-in al cargar la página.
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('page-transition-base');
  
  // Pequeño retraso para asegurar que la clase base se aplique antes del fade-in
  requestAnimationFrame(() => {
    document.body.classList.add('fade-in');
  });
});

// Función para navegar con efecto de fade-out
function navigateWithTransition(url) {
  if (document.body.classList.contains('fade-in')) {
    document.body.classList.remove('fade-in');
    document.body.classList.add('fade-out');
  } else {
    // Si no estaba fade-in (poco probable con la lógica actual),
    // simplemente asegurarse de que esté fade-out
    document.body.classList.add('fade-out');
  }

  setTimeout(() => {
    window.location.href = url;
  }, 400); // Debe coincidir con la duración de la transición CSS (0.4s)
}