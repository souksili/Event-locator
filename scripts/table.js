document.addEventListener('DOMContentLoaded', function () {
    var categoryElement = d3.select('#category-filter');
    var dateElement = d3.select('#date-filter');

    if (!categoryElement.empty() && !dateElement.empty()) {
        categoryElement.on('change', filterEvents);
        dateElement.on('change', filterEvents);
    }

    loadCSV().then(events => {
        window.eventsData = events;
        displayTable(eventsData);
    }).catch(error => {
        console.error('Erreur lors du chargement des événements:', error);
    });
});

function displayTable(events) {
    var tableBody = d3.select('#events-table tbody');

    if (tableBody.empty()) {
        console.error('Erreur: tableBody est null.');
        return;
    }

    tableBody.html('');

    events.forEach(event => {
        const title = event.title || 'No title';
        const email = event.email || 'No email';
        const date = event.date || 'No date';
        const category = event.category || 'No category';
        const description = event.description || 'No description';

        var eventDetails = `title=${encodeURIComponent(title)}&date=${encodeURIComponent(date)}&category=${encodeURIComponent(category)}&description=${encodeURIComponent(description)}`;

        var row = tableBody.append('tr');
        row.html(`
            <td>${email}</td>
            <td>${title}</td>
            <td>${date}</td>
            <td>${category}</td>
            <td>
                <a href="event.html?${eventDetails}" class="btn btn-info">Détails</a>
            </td>
        `);
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
    var selectedCategory = d3.select('#category-filter').property('value');
    var selectedDate = d3.select('#date-filter').property('value');

    var filteredEvents = window.eventsData.filter(event => {
        var eventDate = new Date(event.date);
        var filterDate = new Date(selectedDate);

        var isCategoryMatch = selectedCategory === '' || event.category === selectedCategory;
        var isDateMatch = !selectedDate || (eventDate.toISOString().split('T')[0] === filterDate.toISOString().split('T')[0]);

        return isCategoryMatch && isDateMatch;
    });

    displayTable(filteredEvents);
}