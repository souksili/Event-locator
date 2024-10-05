document.addEventListener('DOMContentLoaded', function () {
    var categoryElement = document.getElementById('category-filter');
    var dateElement = document.getElementById('date-filter');

    if (categoryElement && dateElement) {
        categoryElement.addEventListener('change', filterEvents);
        dateElement.addEventListener('change', filterEvents);
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
                .openPopup();

            markers.addLayer(marker);
        } else {
            console.error(`Coordonnées invalides pour l'événement : ${event.title}. Lat : ${lat}, Lng : ${lng}`);
        }
    });
}

function filterEvents() {
    var categoryElement = document.getElementById('category-filter');
    var dateElement = document.getElementById('date-filter');
    
    var selectedCategory = categoryElement.value;
    var selectedDate = dateElement.value;

    var filteredEvents = window.eventsData.filter(event => {
        var eventDate = new Date(event.date);
        var filterDate = new Date(selectedDate);

        var isCategoryMatch = (selectedCategory === '' || event.category === selectedCategory);

        var isDateMatch = (!selectedDate || (eventDate.toISOString().split('T')[0] === filterDate.toISOString().split('T')[0]));

        console.log(`Event: ${event.title}, Category Match: ${isCategoryMatch}, Date Match: ${isDateMatch}`);

        return isCategoryMatch && isDateMatch;
    });

    displayEvents(filteredEvents);
}