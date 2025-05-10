document.addEventListener('DOMContentLoaded', function() {
  // Elementos del DOM
  const taskList = document.getElementById('taskList');
  const newTaskInput = document.getElementById('newTaskInput');
  const addTaskBtn = document.getElementById('addTaskBtn');
  const taskFilterBtn = document.getElementById('taskFilterBtn');
  const taskFilterText = document.getElementById('taskFilterText');
  
  // Estado de la aplicación
  let tasks = [
    { id: 1, text: 'Revisar solicitudes de material pendientes', completed: false },
    { id: 2, text: 'Actualizar inventario de equipos', completed: true },
    { id: 3, text: 'Confirmar envío de paquetería #12345', completed: false }
  ];
  
  let showCompleted = true;
  
  // Inicializar lista de tareas
  renderTasks();
  
  // Eventos
  addTaskBtn.addEventListener('click', addTask);
  
  newTaskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      addTask();
    }
  });
  
  taskFilterBtn.addEventListener('click', toggleShowCompleted);
  
  // Función para renderizar las tareas
  function renderTasks() {
    // Limpiar lista actual
    taskList.innerHTML = '';
    
    // Filtrar tareas según configuración
    const filteredTasks = showCompleted ? tasks : tasks.filter(task => !task.completed);
    
    // Mostrar mensaje si no hay tareas
    if (filteredTasks.length === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.textContent = 'No hay tareas pendientes';
      emptyMessage.className = 'text-center py-4 text-gray-500';
      taskList.appendChild(emptyMessage);
      return;
    }
    
    // Crear elementos de tareas
    filteredTasks.forEach(task => {
      const taskItem = document.createElement('div');
      taskItem.className = 'task-item';
      if (task.completed) {
        taskItem.classList.add('task-completed');
      }
      
      // Crear checkbox
      const checkbox = document.createElement('div');
      checkbox.className = 'task-checkbox';
      
      const checkboxInput = document.createElement('input');
      checkboxInput.type = 'checkbox';
      checkboxInput.checked = task.completed;
      checkboxInput.addEventListener('change', () => toggleTaskCompleted(task.id));
      
      // Crear texto de tarea
      const taskText = document.createElement('span');
      taskText.className = 'task-text';
      taskText.textContent = task.text;
      
      // Botón de eliminar
      const deleteButton = document.createElement('button');
      deleteButton.className = 'task-delete';
      deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
      deleteButton.addEventListener('click', () => deleteTask(task.id));
      
      // Agregar elementos al DOM
      checkbox.appendChild(checkboxInput);
      taskItem.appendChild(checkbox);
      taskItem.appendChild(taskText);
      taskItem.appendChild(deleteButton);
      taskList.appendChild(taskItem);
    });
  }
  
  // Función para añadir una nueva tarea
  function addTask() {
    const text = newTaskInput.value.trim();
    if (text) {
      // Generar un nuevo ID basado en timestamp
      const newId = Date.now();
      
      // Añadir la nueva tarea
      tasks.push({
        id: newId,
        text: text,
        completed: false
      });
      
      // Limpiar el input y actualizar la vista
      newTaskInput.value = '';
      renderTasks();
    }
  }

  // Función para marcar una tarea como completada o pendiente
  function toggleTaskCompleted(id) {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
      tasks[taskIndex].completed = !tasks[taskIndex].completed;
      renderTasks();
    }
  }

  // Función para eliminar una tarea
  function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
  }

  // Función para mostrar u ocultar tareas completadas
  function toggleShowCompleted() {
    showCompleted = !showCompleted;
    taskFilterText.textContent = showCompleted ? 'Ocultar completadas' : 'Mostrar completadas';
    renderTasks();
  }
});