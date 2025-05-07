document.addEventListener('DOMContentLoaded', function () {
    const monthYearElement = document.getElementById('month-year');
    const calendarBody = document.getElementById('calendar-body');
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');

    const selectedDayHeading = document.getElementById('selected-day-heading');
    const summaryTotalVentas = document.getElementById('summary-total-ventas');
    const summaryNumTransacciones = document.getElementById('summary-num-transacciones');
    const salesTableBody = document.getElementById('sales-table-body');

    let currentDate = new Date();

    // Sample sales data (replace with actual data fetching)
    const salesData = {
        // Format: "YYYY-MM-DD"
        "2024-07-28": { // Example: Assuming today is July 28, 2024
            summary: { totalVentas: 1250.75, numeroTransacciones: 15 },
            items: [
                { id: 'V001', categoria: "Electrónicos", producto: "Mouse Gamer", cantidad: 2, precioUnitario: 350, total: 700 },
                { id: 'V002', categoria: "Papelería", producto: "Cuaderno Profesional", cantidad: 5, precioUnitario: 40.50, total: 202.50 },
                { id: 'V003', categoria: "Bebidas", producto: "Refresco 600ml", cantidad: 10, precioUnitario: 15.00, total: 150.00 },
                { id: 'V004', categoria: "Snacks", producto: "Papas Fritas", cantidad: 7, precioUnitario: 28.32, total: 198.25 }
            ]
        },
        "2024-07-15": {
            summary: { totalVentas: 800.00, numeroTransacciones: 8 },
            items: [
                { id: 'V005', categoria: "Libros", producto: "Novela Ficción", cantidad: 1, precioUnitario: 300, total: 300 },
                { id: 'V006', categoria: "Ropa", producto: "Playera", cantidad: 2, precioUnitario: 250, total: 500 }
            ]
        }
    };
    
    // Initialize with current date for sales data example
    const todayKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
    if (!salesData[todayKey]) {
        salesData[todayKey] = {
             summary: { totalVentas: Math.floor(Math.random() * 2000) + 500, numeroTransacciones: Math.floor(Math.random() * 20) + 5 },
             items: [
                 { id: 'V007', categoria: "Alimentos", producto: "Pan Integral", cantidad: Math.floor(Math.random() * 5) + 1, precioUnitario: 50, total: 0},
                 { id: 'V008', categoria: "Hogar", producto: "Limpiador Multiusos", cantidad: Math.floor(Math.random() * 3) + 1, precioUnitario: 75, total: 0}
             ]
        };
        salesData[todayKey].items.forEach(item => item.total = item.cantidad * item.precioUnitario);
    }


    function renderCalendar() {
        calendarBody.innerHTML = '';
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        monthYearElement.textContent = `${currentDate.toLocaleString('es-ES', { month: 'long' })} ${year}`;

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        let date = 1;
        for (let i = 0; i < 6; i++) { // Max 6 rows
            const row = document.createElement('tr');
            for (let j = 0; j < 7; j++) {
                const cell = document.createElement('td');
                if (i === 0 && j < firstDayOfMonth) {
                    // Empty cells before the first day
                    cell.textContent = '';
                } else if (date > daysInMonth) {
                    // Empty cells after the last day
                    cell.textContent = '';
                } else {
                    cell.textContent = date;
                    cell.dataset.day = date;
                    cell.dataset.month = month + 1;
                    cell.dataset.year = year;
                    
                    const cellDate = new Date(year, month, date);
                    const today = new Date();
                    if (cellDate.toDateString() === today.toDateString()) {
                        cell.classList.add('today');
                    }

                    cell.addEventListener('click', function () {
                        const selectedCells = calendarBody.querySelectorAll('.selected');
                        selectedCells.forEach(sc => sc.classList.remove('selected'));
                        this.classList.add('selected');
                        displaySalesForDay(year, month + 1, parseInt(this.dataset.day));
                    });
                    date++;
                }
                row.appendChild(cell);
            }
            calendarBody.appendChild(row);
            if (date > daysInMonth && i < 5) { // Optimization: if all days are rendered, break
                 // Check if the row is entirely empty (can happen if month ends early and we are in the last loop for rows)
                let isEmptyRow = true;
                for(let k=0; k<row.cells.length; k++){
                    if(row.cells[k].textContent !== ''){
                        isEmptyRow = false;
                        break;
                    }
                }
                if(isEmptyRow && calendarBody.contains(row)){
                     calendarBody.removeChild(row);   
                }
            }
             if (date > daysInMonth) break; // Break if all days are rendered
        }
    }

    function displaySalesForDay(year, month, day) {
        const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        selectedDayHeading.textContent = `Ventas del Día: ${day} de ${new Date(year, month - 1).toLocaleString('es-ES', { month: 'long' })} de ${year}`;

        const data = salesData[dateKey];
        salesTableBody.innerHTML = ''; // Clear previous sales

        if (data) {
            summaryTotalVentas.textContent = data.summary.totalVentas.toFixed(2);
            summaryNumTransacciones.textContent = data.summary.numeroTransacciones;

            if (data.items && data.items.length > 0) {
                data.items.forEach(item => {
                    const row = salesTableBody.insertRow();
                    row.insertCell().textContent = item.id;
                    row.insertCell().textContent = item.categoria;
                    row.insertCell().textContent = item.producto;
                    row.insertCell().textContent = item.cantidad;
                    row.insertCell().textContent = item.precioUnitario.toFixed(2);
                    row.insertCell().textContent = (item.cantidad * item.precioUnitario).toFixed(2);
                });
            } else {
                const row = salesTableBody.insertRow();
                const cell = row.insertCell();
                cell.colSpan = 6;
                cell.textContent = "No hay ventas registradas para este día.";
                cell.style.textAlign = "center";
            }
        } else {
            summaryTotalVentas.textContent = '0.00';
            summaryNumTransacciones.textContent = '0';
            const row = salesTableBody.insertRow();
            const cell = row.insertCell();
            cell.colSpan = 6;
            cell.textContent = "No hay datos de ventas para este día.";
            cell.style.textAlign = "center";
        }
    }

    prevMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
        clearSalesData();
    });

    nextMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
        clearSalesData();
    });
    
    function clearSalesData() {
        selectedDayHeading.textContent = `Ventas del Día: --`;
        summaryTotalVentas.textContent = '--';
        summaryNumTransacciones.textContent = '--';
        salesTableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Seleccione un día para ver las ventas.</td></tr>';
    }

    renderCalendar();
    // Optionally, display sales for today on load if data exists
    // displaySalesForDay(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate());
    clearSalesData(); // Start with no day selected
});

// Work Chain Tabs Logic
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', function() {
        // Deactivate all tabs and buttons
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        // Activate the clicked button and its corresponding tab
        this.classList.add('active');
        const tabId = this.dataset.tab;
        document.getElementById(tabId).classList.add('active');
    });
});

