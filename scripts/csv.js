async function loadCSV() {
    const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTDBCOZ3SKCJBa0EcDkvmjhJJATO-6Gqfq1qREJTzIT1MkEf3F3NueAX3MN7VtRgJx21_FCT5K7F8dd/pub?output=csv';
    try {
        const response = await fetch(csvUrl);
        const data = await response.text();

        const rows = data.split('\n').slice(1);

        const events = await Promise.all(rows.map(async (row) => {

            const cols = row.split(',').map(col => col.trim());

            if (cols.length < 6) {
                console.error('Invalid row format:', row);
                return null;
            }

            let formattedDate = null;
            if (cols[5]) {
                const [day, month, year] = cols[5].split('/');
                if (month && day && year) {
                    formattedDate = `${year}-${month}-${day}`;
                } else {
                    console.warn('Invalid date format:', cols[5]);
                }
            } else {
                console.warn('Missing date in row:', row);
            }

            const event = {
                title: cols[1] || 'No title',        
                address: cols[2] || 'No address',    
                description: cols[3] || 'No description', 
                category: cols[4] || 'No category',   
                date: formattedDate || 'No date', 
                email: cols[6],   
                lat: null,
                lng: null
            };

            if (!event.lat || !event.lng) {
                const coords = await geocodeAddress(event.address);

                if (coords) {
                    event.lat = coords.lat;
                    event.lng = coords.lng;
                }
            }

            console.log(`Événement extrait :
                Titre : ${event.title},
                Adresse : ${event.address},
                Description : ${event.description},
                Catégorie : ${event.category},
                Date : ${event.date},
                Latitude : ${event.lat},
                Longitude : ${event.lng}`);

            return event;
        }));

        return events.filter(event => event !== null);
    } catch (error) {
        console.error('Erreur lors du chargement du fichier CSV:', error);
    }
}

async function geocodeAddress(address) {
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(address)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.features && data.features.length > 0) {
            return {
                lat: parseFloat(data.features[0].geometry.coordinates[1]),
                lng: parseFloat(data.features[0].geometry.coordinates[0])
            };
        } else {
            console.error('Aucune correspondance trouvée pour cette adresse :', address);
            return null;
        }
    } catch (error) {
        console.error('Erreur lors de la requête de géocodage:', error);
        return null;
    }
}