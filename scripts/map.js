var map;
var markers;

function initMap() {
    map = L.map('map').setView([48.8566, 2.3522], 13);
    markers = L.layerGroup().addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}

document.addEventListener('DOMContentLoaded', function () {
    initMap();

    var categoryElement = d3.select('#category-filter');
    var dateElement = d3.select('#date-filter');

    if (!categoryElement.empty() && !dateElement.empty()) {
        categoryElement.on('change', filterEvents);
        dateElement.on('change', filterEvents);
    }

    loadCSV().then(events => {
        window.eventsData = events;
        displayEvents(eventsData);
    }).catch(error => {
        console.error('Erreur lors du chargement des événements:', error);
    });
});

function displayEvents(events) {
    markers.clearLayers();

    events.forEach(event => {
        var lat = event.lat;
        var lng = event.lng;

        if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng)) {
            var popupContent = `
                <div style="min-width: 150px;">
                    <h3>${event.title}</h3>
                    <p><strong>Adresse:</strong> ${event.address}</p>
                    <p><strong>Description:</strong> ${event.description}</p>
                    <p><strong>Catégorie:</strong> ${event.category}</p>
                    <p><strong>Date:</strong> ${event.date}</p>
                    <button class="btn btn-primary" onclick="addToCalendar('${event.title}', '${event.date}', '${event.description}')">Ajouter au calendrier</button>
                </div>`;

            var marker = L.marker([lat, lng])
                .bindPopup(popupContent)
                .addTo(markers);
        } else {
            console.error(`Coordonnées invalides pour l'événement : ${event.title}. Lat : ${lat}, Lng : ${lng}`);
        }
    });
}

function filterEvents() {
    var selectedCategory = d3.select('#category-filter').property('value');
    var selectedDate = d3.select('#date-filter').property('value');

    var filteredEvents = window.eventsData.filter(event => {
        var eventDate = new Date(event.date);
        var filterDate = new Date(selectedDate);

        var isCategoryMatch = (selectedCategory === '' || event.category === selectedCategory);
        var isDateMatch = (!selectedDate || (eventDate.toISOString().split('T')[0] === filterDate.toISOString().split('T')[0]));

        return isCategoryMatch && isDateMatch;
    });

    displayEvents(filteredEvents);
}

function addToCalendar(title, date, description) {
    var eventDate = new Date(date);
    var startDate = eventDate.toISOString().replace(/-|:|\.\d+/g, '');
    var endDate = new Date(eventDate.getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d+/g, '');

    var calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(description)}`;
    
    window.open(calendarUrl, '_blank');
}