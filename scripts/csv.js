function loadCSV() {
    const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTDBCOZ3SKCJBa0EcDkvmjhJJATO-6Gqfq1qREJTzIT1MkEf3F3NueAX3MN7VtRgJx21_FCT5K7F8dd/pub?output=csv';
    return fetch(csvUrl)
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n').slice(1);

            const events = rows.map(row => {
                const cols = row.split(',').map(col => col.trim());

                let lat = cols[6];
                let lng = cols[7];

                const [day, month, year] = cols[5].split('/');
                const formattedDate = `${year}-${month}-${day}`;

                const event = {
                    title: cols[1],
                    address: cols[2],
                    description: cols[3],
                    category: cols[4],
                    date: formattedDate,
                    lat: lat,
                    lng: lng
                };

                console.log(`Événement extrait : 
                    Titre : ${event.title}, 
                    Adresse : ${event.address}, 
                    Description : ${event.description}, 
                    Catégorie : ${event.category}, 
                    Date : ${event.date}, 
                    Latitude : ${event.lat}, 
                    Longitude : ${event.lng}`
                );

                return event;
            });

            return events;
        })
        .catch(error => {
            console.error('Erreur lors du chargement du fichier CSV:', error);
        });
}

function geocodeAddress(address) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

    return fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                return {
                    lat: parseFloat(data[0].lat),
                    lng: parseFloat(data[0].lon)
                };
            } else {
                console.error('Aucune correspondance trouvée pour cette adresse :', address);
                return null;
            }
        })
        .catch(error => {
            console.error('Erreur lors de la requête de géocodage:', error);
            return null;
        });
}