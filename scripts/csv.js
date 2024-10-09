async function loadCSV() {
    const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTDBCOZ3SKCJBa0EcDkvmjhJJATO-6Gqfq1qREJTzIT1MkEf3F3NueAX3MN7VtRgJx21_FCT5K7F8dd/pub?output=csv';
    
    try {
        const response = await fetch(csvUrl);
        const data = await response.text();
        const rows = data.split('\n').slice(1);

        const events = await Promise.all(rows.map(async (row) => {
            const cols = row.split(',').map(col => col.trim());

            const [day, month, year] = cols[5].split('/');
            const formattedDate = `${year}-${month}-${day}`;

            const event = {
                title: cols[1],
                address: cols[2],
                description: cols[3],
                category: cols[4],
                date: formattedDate,
                lat: null,
                lng: null
            };

            const coords = await geocodeAddress(event.address);

            if (coords) {
                event.lat = coords.lat;
                event.lng = coords.lng;
            }

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
        }));

        return events;
    } catch (error) {
        console.error('Erreur lors du chargement du fichier CSV:', error);
    }
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