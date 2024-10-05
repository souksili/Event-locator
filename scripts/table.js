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
    
    if (!tableBody) {
        console.error('Erreur: tableBody est null.');
        return;
    }

    tableBody.innerHTML = '';

    events.forEach(event => {
        var row = document.createElement('tr');

        row.innerHTML = `
            <td>${event.title}</td>
            <td>${event.date}</td>
            <td>${event.category}</td>
            <td>${event.description}</td>
            <td><button class="btn btn-primary" onclick="addToCalendar('${event.title}', '${event.date}', '${event.description}')">Ajouter au calendrier</button></td>
        `;

        tableBody.appendChild(row);
    });
}

function addToCalendar(title, date, description) {
    var eventDate = new Date(date);
    var startDate = eventDate.toISOString().replace(/-|:|\.\d+/g, '');
    var endDate = new Date(eventDate.getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d+/g, ''); 

    var calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(description)}`;
    
    window.open(calendarUrl, '_blank');
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