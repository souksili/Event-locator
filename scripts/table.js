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

    tableBody.selectAll('tr').remove();

    var rows = tableBody.selectAll('tr')
        .data(events)
        .enter()
        .append('tr');

    rows.append('td').text(d => d.title);
    rows.append('td').text(d => d.date);
    rows.append('td').text(d => d.category);
    rows.append('td').text(d => d.description);

    rows.append('td')
        .append('button')
        .attr('class', 'btn btn-primary')
        .text('Ajouter au calendrier')
        .on('click', function(event, d) {
            addToCalendar(d.title, d.date, d.description);
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