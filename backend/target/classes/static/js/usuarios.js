// API Base URL - Ajustar según la configuración de tu backend
const API_BASE_URL = 'http://localhost:8080/api/users';

// Elementos del DOM
const usersTableBody = document.getElementById('usersTableBody');
const userForm = document.getElementById('userForm');
const userModal = document.getElementById('userModal');
const deleteModal = document.getElementById('deleteModal');
const modalTitle = document.getElementById('modalTitle');
const btnAddUser = document.getElementById('btnAddUser');
const closeModal = document.getElementById('closeModal');
const closeDeleteModal = document.getElementById('closeDeleteModal');
const cancelBtn = document.getElementById('cancelBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const passwordGroup = document.getElementById('passwordGroup');
const confirmPasswordGroup = document.getElementById('confirmPasswordGroup');

// Variables globales
let users = [];
let userIdToDelete = null;

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  loadUsers();
  
  // Eventos del modal de usuario
  btnAddUser.addEventListener('click', showAddUserModal);
  closeModal.addEventListener('click', hideUserModal);
  cancelBtn.addEventListener('click', hideUserModal);
  userForm.addEventListener('submit', handleUserSubmit);
  
  // Eventos del modal de confirmación de eliminación
  closeDeleteModal.addEventListener('click', hideDeleteModal);
  cancelDeleteBtn.addEventListener('click', hideDeleteModal);
  confirmDeleteBtn.addEventListener('click', confirmDeleteUser);
  
  // Cerrar modal al hacer clic fuera del contenido
  window.addEventListener('click', (e) => {
    if (e.target === userModal) hideUserModal();
    if (e.target === deleteModal) hideDeleteModal();
  });
});

// Cargar lista de usuarios
async function loadUsers() {
  try {
    showLoading();
    const response = await fetch(API_BASE_URL, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Error al cargar los usuarios');
    }
    
    const data = await response.json();
    const users = Array.isArray(data) ? data : (data.content || []);
    renderUsersTable(users);
  } catch (error) {
    console.error('Error:', error);
    showError('Error al cargar los usuarios');
  } finally {
    hideLoading();
  }
}

// Renderizar la tabla de usuarios
function renderUsersTable(users) {
  if (!users || users.length === 0) {
    usersTableBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 20px;">
          No se encontraron usuarios
        </td>
      </tr>`;
    return;
  }
  usersTableBody.innerHTML = users.map(user => {
    // Tomar solo el primer rol válido (ADMIN o USER) de este usuario
    let mainRole = '';
    if (Array.isArray(user.roles)) {
      if (user.roles.includes('ROLE_ADMIN')) mainRole = 'ADMIN';
      else if (user.roles.includes('ROLE_USER')) mainRole = 'USER';
      else if (user.roles.length > 0) mainRole = user.roles[0].replace('ROLE_', '');
    }
    return `
      <tr>
        <td>${user.id}</td>
        <td>${user.username}</td>
        <td>${formatRole(mainRole)}</td>
        <td><span class="status-${user.active ? 'active' : 'inactive'}">
          ${user.active ? 'Activo' : 'Inactivo'}
        </span></td>
        <td>
          <button class="action-btn edit-btn" data-id="${user.id}" title="Editar">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn delete-btn" data-id="${user.id}" title="Eliminar">
            <i class="fas fa-trash-alt"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');
  
  // Agregar event listeners a los botones de editar y eliminar
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const userId = parseInt(e.currentTarget.getAttribute('data-id'));
      showEditUserModal(userId);
    });
  });
  
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const userId = parseInt(e.currentTarget.getAttribute('data-id'));
      showDeleteConfirmation(userId);
    });
  });
}

// Mostrar modal para agregar usuario
function showAddUserModal() {
  modalTitle.textContent = 'Nuevo Usuario';
  userForm.reset();
  document.getElementById('userId').value = '';
  passwordGroup.style.display = 'block';
  confirmPasswordGroup.style.display = 'block';
  document.getElementById('status').value = 'true';
  userModal.style.display = 'flex';
}

// Mostrar modal para editar usuario
async function showEditUserModal(userId) {
  try {
    showLoading();
    const response = await fetch(`${API_BASE_URL}/${userId}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Error al cargar los datos del usuario');
    }
    const user = await response.json();
    document.getElementById('userId').value = user.id;
    document.getElementById('username').value = user.username;
    // Seleccionar el primer rol válido
    let mainRole = 'USER';
    if (Array.isArray(user.roles)) {
      if (user.roles.includes('ROLE_ADMIN')) mainRole = 'ADMIN';
      else if (user.roles.includes('ROLE_USER')) mainRole = 'USER';
      else if (user.roles.length > 0) mainRole = user.roles[0].replace('ROLE_', '');
    }
    document.getElementById('role').value = mainRole;
    document.getElementById('status').value = user.active ? 'true' : 'false';
    // Ocultar y deshabilitar campos de contraseña en edición
    passwordGroup.style.display = 'none';
    confirmPasswordGroup.style.display = 'none';
    document.getElementById('password').required = false;
    document.getElementById('confirmPassword').required = false;
    modalTitle.textContent = 'Editar Usuario';
    userModal.style.display = 'flex';
  } catch (error) {
    console.error('Error:', error);
    showError('Error al cargar los datos del usuario');
  } finally {
    hideLoading();
  }
}

// Manejar envío del formulario
async function handleUserSubmit(e) {
  e.preventDefault();
  const userId = document.getElementById('userId').value;
  const isEdit = !!userId;
  // Solo validar contraseña si es alta
  if (!isEdit) {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    if (password !== confirmPassword) {
      showError('Las contraseñas no coinciden');
      return;
    }
    if (password.length < 6) {
      showError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
  }
  // Mapear el rol seleccionado al formato backend (ROLE_ADMIN o ROLE_USER)
  let selectedRole = document.getElementById('role').value;
  let backendRole = selectedRole === 'ADMIN' ? 'ROLE_ADMIN' : 'ROLE_USER';
  const userData = {
    username: document.getElementById('username').value,
    active: document.getElementById('status').value === 'true',
    roles: [backendRole]
  };
  if (!isEdit) {
    userData.password = document.getElementById('password').value;
  }
  try {
    showLoading();
    let response;
    if (isEdit) {
      response = await fetch(`${API_BASE_URL}/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
    } else {
      response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
    }
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al guardar el usuario');
    }
    hideUserModal();
    showSuccess(isEdit ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente');
    loadUsers();
  } catch (error) {
    console.error('Error:', error);
    showError(error.message || 'Error al guardar el usuario');
  } finally {
    hideLoading();
  }
}

// Mostrar confirmación de eliminación
function showDeleteConfirmation(userId) {
  userIdToDelete = userId;
  deleteModal.style.display = 'flex';
}

// Confirmar eliminación de usuario
async function confirmDeleteUser() {
  if (!userIdToDelete) return;
  
  try {
    showLoading();
    const response = await fetch(`${API_BASE_URL}/${userIdToDelete}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Error al eliminar el usuario');
    }
    
    hideDeleteModal();
    showSuccess('Usuario eliminado correctamente');
    loadUsers();
  } catch (error) {
    console.error('Error:', error);
    showError('Error al eliminar el usuario');
  } finally {
    hideLoading();
    userIdToDelete = null;
  }
}

// Ocultar modal de usuario
function hideUserModal() {
  userModal.style.display = 'none';
}

// Ocultar modal de confirmación de eliminación
function hideDeleteModal() {
  deleteModal.style.display = 'none';
  userIdToDelete = null;
}

// Formatear el rol para mostrar
function formatRole(role) {
  const roles = {
    'ADMIN': 'Administrador',
    'USER': 'Usuario',
    'ROLE_ADMIN': 'Administrador',
    'ROLE_USER': 'Usuario'
  };
  return roles[role] || role;
}

// Mostrar indicador de carga
function showLoading() {
  // Implementar lógica de carga si es necesario
  console.log('Cargando...');
}

// Ocultar indicador de carga
function hideLoading() {
  // Implementar lógica para ocultar carga
  console.log('Carga completada');
}

// Mostrar mensaje de éxito
function showSuccess(message) {
  // Implementar notificación de éxito
  alert(`Éxito: ${message}`);
}

// Mostrar mensaje de error
function showError(message) {
  // Implementar notificación de error
  console.error(`Error: ${message}`);
  alert(`Error: ${message}`);
}

// Obtener el token de autenticación del localStorage
function getAuthToken() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No se encontró el token de autenticación');
      // Redirigir a la página de inicio de sesión
      window.location.href = '/';
      return '';
    }
    return token;
  } catch (error) {
    console.error('Error al obtener el token de autenticación:', error);
    return '';
  }
}

// Inicializar la página
loadUsers();
