document.addEventListener('DOMContentLoaded', function () {
    var categoryElement = document.getElementById('category-filter');
    var dateElement = document.getElementById('date-filter');

    if (categoryElement && dateElement) {
        categoryElement.addEventListener('change', filterEvents);
        dateElement.addEventListener('change', filterEvents);
    }

    loadCSV().then(events => {
        window.eventsData = events;
        displayTable(eventsData);
    }).catch(error => {
        console.error('Erreur lors du chargement des événements:', error);
    });
});

function displayTable(events) {
    var tableBody = document.querySelector('#events-table tbody');
    tableBody.innerHTML = '';

    events.forEach(event => {
        var row = document.createElement('tr');

        row.innerHTML = `
            <td>${event.title}</td>
            <td>${event.address}</td>
            <td>${event.description}</td>
            <td>${event.category}</td>
            <td>${event.date}</td>
        `;

        tableBody.appendChild(row);
    });
}

function filterEvents() {
    var selectedCategory = document.getElementById('category-filter').value;
    var selectedDate = document.getElementById('date-filter').value;

    var filteredEvents = window.eventsData.filter(event => {
        var eventDate = new Date(event.date);
        var filterDate = new Date(selectedDate);

        var isCategoryMatch = selectedCategory === '' || event.category === selectedCategory;
        var isDateMatch = !selectedDate || (eventDate.toISOString().split('T')[0] === filterDate.toISOString().split('T')[0]);

        return isCategoryMatch && isDateMatch;
    });

    displayTable(filteredEvents);
}