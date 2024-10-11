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

    console.log("im here")
    
    if (!tableBody) {
        console.error('Erreur: tableBody est null.');
        return;
    }

    tableBody.innerHTML = '';

    events.forEach(event => {
        // Handle potential undefined or invalid fields
        const title = event.title || 'No title';
        const date = event.date || 'No date';  // Replace 'No date' with null or '' if necessary
        const category = event.category || 'No category';
        const description = event.description || 'No description';

        // Construct the query string with encoded details
        var eventDetails = `title=${encodeURIComponent(title)}&date=${encodeURIComponent(date)}&category=${encodeURIComponent(category)}&description=${encodeURIComponent(description)}`;

        // Create a new table row
        var row = document.createElement('tr');
        row.innerHTML = `
        <td>${title}</td>
        <td>${date}</td>
        <td>${category}</td>
        <td>${description}</td>
        <td><a href="event.html?${eventDetails}" class="btn btn-info">Details</a></td>
        <td><a class="btn btn-primary" onclick="addToCalendar('${title}', '${date}', '${description}')">calendrier</a></td>
    `;

        // Append the row to the table body
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