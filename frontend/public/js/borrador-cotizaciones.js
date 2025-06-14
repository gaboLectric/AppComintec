// js/borrador-cotizaciones.js
// Lógica básica para el formulario de borrador de cotizaciones

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('cotizacionForm');
  const tableBody = document.querySelector('.universal-table tbody');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    // Simulación de búsqueda
    const input = form.querySelector('.form-input').value.trim();
    tableBody.innerHTML = '';
    if (input) {
      // Simula un resultado
      tableBody.innerHTML = `
        <tr>
          <td>001</td>
          <td>Cliente Ejemplo</td>
          <td>Dato 1</td>
          <td>Dato 2</td>
          <td>Dato 3</td>
          <td>Dato 4</td>
          <td>Dato 5</td>
        </tr>
      `;
    } else {
      tableBody.innerHTML = '<tr><td colspan="7">Ingresa un número de cotización para buscar.</td></tr>';
    }
  });
});