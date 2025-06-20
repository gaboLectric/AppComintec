// projects.js – frontend logic for Ventas / Projects

// Helper to get auth headers with JWT token
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

// DOM references
const tbody = document.getElementById('projectsTbody');
const searchInput = document.getElementById('searchInput');
const newBtn = document.getElementById('newProjectBtn');
const modal = document.getElementById('projectModal');
const modalTitle = document.getElementById('modalTitle');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const cancelBtn = document.getElementById('cancelBtn');
const form = document.getElementById('projectForm');
const projectIdInput = document.getElementById('projectId');
const nameInput = document.getElementById('projectName');
const descInput = document.getElementById('projectDescription');
const amountInput = document.getElementById('projectAmount');
const startInput = document.getElementById('projectStart');
const endInput = document.getElementById('projectEnd');
const saveBtn = document.getElementById('saveProjectBtn');
const logoutBtn = document.getElementById('logoutBtn');

// Pagination state (simple)
let currentPage = 0;
const pageSize = 20;
let currentQuery = '';

// ------------------------ API calls ----------------------
async function apiGet(url) {
  const res = await fetch(url, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function apiPost(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function apiPut(url, body) {
  const res = await fetch(url, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function apiDelete(url) {
  const res = await fetch(url, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error(await res.text());
}

// ------------------- UI helpers ----------------------
function clearTable() {
  tbody.innerHTML = '';
}

function addRow(project) {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-700">${project.id}</td>
    <td class="px-4 py-2 whitespace-nowrap text-sm">${project.name}</td>
    <td class="px-4 py-2 whitespace-nowrap text-sm">${project.customerName || '-'}</td>
    <td class="px-4 py-2 whitespace-nowrap text-sm">$${project.totalAmount ?? '-'}</td>
    <td class="px-4 py-2 whitespace-nowrap text-sm">${project.status}</td>
    <td class="px-4 py-2 whitespace-nowrap text-right text-sm">
      <button class="text-blue-600 hover:text-blue-800 mr-2" title="Editar" data-action="edit"><i class="fas fa-pen"></i></button>
      <button class="text-red-600 hover:text-red-800" title="Eliminar" data-action="delete"><i class="fas fa-trash"></i></button>
    </td>`;
  // Attach project id
  tr.dataset.id = project.id;
  tbody.appendChild(tr);
}

function renderProjects(pageData) {
  clearTable();
  pageData.content.forEach(addRow);
}

function openModal(isEdit, project = {}) {
  if (isEdit) {
    modalTitle.textContent = `Editar Proyecto #${project.id}`;
    projectIdInput.value = project.id;
    nameInput.value = project.name;
    descInput.value = project.description || '';
    amountInput.value = project.totalAmount || '';
    startInput.value = project.startDate || '';
    endInput.value = project.endDate || '';
  } else {
    modalTitle.textContent = 'Nuevo Proyecto';
    form.reset();
    projectIdInput.value = '';
  }
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeModal() {
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

// ------------------- Event handlers -------------------
async function loadProjects() {
  const base = '/api/projects';
  const url = currentQuery ? `${base}/search?query=${encodeURIComponent(currentQuery)}&page=${currentPage}&size=${pageSize}` : `${base}?page=${currentPage}&size=${pageSize}`;
  try {
    const data = await apiGet(url);
    renderProjects(data);
  } catch (err) {
    console.error('Error loading projects', err);
    alert('Error al cargar proyectos');
  }
}

// Delegated events for edit/delete buttons
tbody.addEventListener('click', async (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const action = btn.dataset.action;
  const id = btn.closest('tr').dataset.id;
  if (action === 'edit') {
    try {
      const project = await apiGet(`/api/projects/${id}`);
      openModal(true, project);
    } catch (err) {
      console.error(err);
      alert('No se pudo obtener el proyecto');
    }
  }
  if (action === 'delete') {
    if (!confirm('¿Eliminar proyecto?')) return;
    try {
      await apiDelete(`/api/projects/${id}`);
      await loadProjects();
    } catch (err) {
      console.error(err);
      alert('Error al eliminar');
    }
  }
});

newBtn.addEventListener('click', () => openModal(false));
modalCloseBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);

// Search
searchInput.addEventListener('input', () => {
  currentQuery = searchInput.value.trim();
  currentPage = 0;
  loadProjects();
});

// Form submit
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = {
    name: nameInput.value.trim(),
    description: descInput.value.trim(),
    totalAmount: parseFloat(amountInput.value || '0'),
    startDate: startInput.value || null,
    endDate: endInput.value || null,
    // customerId would be selected in a more complete UI; for now backend will validate.
  };
  const id = projectIdInput.value;
  try {
    if (id) {
      await apiPut(`/api/projects/${id}`, payload);
    } else {
      await apiPost('/api/projects', payload);
    }
    closeModal();
    await loadProjects();
  } catch (err) {
    console.error(err);
    alert('Error al guardar');
  }
});

// Logout
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/html/main.html';
  });
}

// Initial load
document.addEventListener('DOMContentLoaded', loadProjects);
