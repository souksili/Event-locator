var map = L.map('map').setView([48.8566, 2.3522], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var markers = L.layerGroup().addTo(map);

loadCSV().then(events => {
    events.forEach(event => {
        var lat = event.lat;
        var lng = event.lng;

        if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng)) {
            console.log(`Ajout du marqueur pour l'événement : ${event.title} à (${lat}, ${lng})`);
            
            var popupContent = `
                <div style="min-width: 150px;">
                    <h3>${event.title}</h3>
                    <p><strong>Adresse:</strong> ${event.address}</p>
                    <p><strong>Description:</strong> ${event.description}</p>
                    <p><strong>Catégorie:</strong> ${event.category}</p>
                    <p><strong>Date:</strong> ${event.date}</p>
                </div>
            `;
            
            var marker = L.marker([lat, lng])
                .bindPopup(popupContent)
                .openPopup();

            markers.addLayer(marker);
        } else {
            console.error(`Coordonnées invalides pour l'événement : ${event.title}. Lat : ${lat}, Lng : ${lng}`);
        }
    });
}).catch(error => {
    console.error('Erreur lors du chargement des événements:', error);
});