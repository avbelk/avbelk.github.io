// Добавляем глобальный объект для хранения состояния сортировки
const sortState = {};

function sortTable(columnIndex) {
  const table = document.querySelector('table');
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));
  const headerCells = table.querySelectorAll('th');

  // Сбрасываем классы сортировки у всех заголовков
  headerCells.forEach(cell => {
    cell.classList.remove('sorted-asc', 'sorted-desc');
  });

  // Определяем направление сортировки
  const currentHeader = headerCells[columnIndex];
  let sortDirection = 'asc';

  // Если уже сортировали по этой колонке, меняем направление
  if (sortState.columnIndex === columnIndex) {
    sortDirection = sortState.direction === 'asc' ? 'desc' : 'asc';
  }

  // Сохраняем состояние сортировки
  sortState.columnIndex = columnIndex;
  sortState.direction = sortDirection;

  // Добавляем класс для визуального отображения направления
  currentHeader.classList.add(`sorted-${sortDirection}`);

  // Сортируем строки
  rows.sort((a, b) => {
    const aValue = a.cells[columnIndex].textContent.trim();
    const bValue = b.cells[columnIndex].textContent.trim();

    // Для числовых колонок
    if (!isNaN(aValue) && !isNaN(bValue)) {
      const numA = Number(aValue);
      const numB = Number(bValue);
      return sortDirection === 'asc' ? numA - numB : numB - numA;
    }

    // Для текстовых колонок
    return sortDirection === 'asc' 
      ? aValue.localeCompare(bValue) 
      : bValue.localeCompare(aValue);
  });

  // Очищаем и перезаполняем tbody
  tbody.innerHTML = '';
  rows.forEach(row => tbody.appendChild(row));
}

document.addEventListener('DOMContentLoaded', function() {
    // Проверка загрузки данных
    if (typeof resultsData === 'undefined') {
        console.error('Ошибка: Данные не загружены! Проверьте файл results.js');
        return;
    }

    populateTable();
    highlightWinners();
    
    // Добавляем обработчики сортировки
    document.querySelectorAll('th').forEach((th, index) => {
        th.addEventListener('click', () => sortTable(index));
    });
});

function populateTable() {
    const tableBody = document.getElementById('tableBody');
    if (!tableBody) {
        console.error('Ошибка: Не найден элемент tableBody');
        return;
    }

    tableBody.innerHTML = '';
    
    resultsData.forEach((row, index) => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${row.team || '-'}</td>
            <td>${row.tournament || '-'}</td>
            <td>${row.game || '-'}</td>
            <td>${row.round1 || 0}</td>
            <td>${row.round2 || 0}</td>
            <td>${row.round3 || 0}</td>
            <td>${row.round4 || 0}</td>
            <td>${row.round5 || 0}</td>
            <td>${row.round6 || 0}</td>
            <td>${row.round7 || 0}</td>
            <td>${row.total || 0}</td>
            <td>${row.place || '-'}</td>
            <td>${row.points || 0}</td>
        `;
        
        tableBody.appendChild(tr);
    });
}

function highlightWinners() {
    const rows = document.querySelectorAll('#tableBody tr');
    rows.forEach(row => {
        const place = parseInt(row.cells[12].textContent);
        if (place === 1) {
            row.classList.add('medal-gold');
            // Добавляем иконку золотой медали
            row.cells[12].innerHTML += ' <i class="fas fa-medal" style="color: #ffd700;"></i>';
        } 
        else if (place === 2) {
            row.classList.add('medal-silver');
            // Добавляем иконку серебряной медали
            row.cells[12].innerHTML += ' <i class="fas fa-medal" style="color: #c0c0c0;"></i>';
        } 
        else if (place === 3) {
            row.classList.add('medal-bronze');
            // Добавляем иконку бронзовой медали
            row.cells[12].innerHTML += ' <i class="fas fa-medal" style="color: #cd7f32;"></i>';
        }
        
        // Подсветка лучшего результата в каждом раунде (с 4 по 10 ячейки)
        for (let i = 4; i <= 10; i++) {
            const cellValue = parseFloat(row.cells[i].textContent) || 0;
            if (cellValue > 0) {
                // Находим максимальное значение в этом столбце
                const columnValues = Array.from(rows).map(r => {
                    return parseFloat(r.cells[i].textContent) || 0;
                });
                const maxInColumn = Math.max(...columnValues);
                
                if (cellValue === maxInColumn) {
                    row.cells[i].classList.add('highlight-round');
                }
            }
        }
    });
}