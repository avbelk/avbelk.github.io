document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, что данные загружены
    if (typeof resultsData !== 'undefined') {
        populateTable();
        // Добавляем подсветку призовых мест
        highlightWinners();
    } else {
        console.error('Данные не загружены! Проверьте файл results.js');
    }
});

function populateTable() {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = ''; // Очищаем таблицу перед заполнением
    
    resultsData.forEach((row, index) => {
        const tr = document.createElement('tr');
        
        // Добавляем номер строки
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${row.team}</td>
            <td>${row.tournament}</td>
            <td>${row.game}</td>
            <td>${row.round1}</td>
            <td>${row.round2}</td>
            <td>${row.round3}</td>
            <td>${row.round4}</td>
            <td>${row.round5}</td>
            <td>${row.round6}</td>
            <td>${row.round7}</td>
            <td>${row.total}</td>
            <td>${row.place}</td>
            <td>${row.points}</td>
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