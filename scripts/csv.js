async function loadCSV() {
    const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSQB85efR45K9soi9v03CXsK099N80I3TCkAa2XSaHGsukfJE5yMPak2YAMteiZI8AwrewS1jnzuLz2/pub?output=csv';
    // const csvUrl ="https://docs.google.com/spreadsheets/d/e/2PACX-1vTDBCOZ3SKCJBa0EcDkvmjhJJATO-6Gqfq1qREJTzIT1MkEf3F3NueAX3MN7VtRgJx21_FCT5K7F8dd/pub?output=csv"
    try {
        const response = await fetch(csvUrl);
        const data = await response.text();

        // Split rows by new line, excluding header (slice(1))
        const rows = data.split('\n').slice(1);

        // Process each row and extract columns
        const events = await Promise.all(rows.map(async (row) => {

            const cols = row.split(',').map(col => col.trim());

            // Make sure there are enough columns
            if (cols.length < 6) {
                console.error('Invalid row format:', row);
                return null; // Skip this row if it's invalid
            }

            // Extract and format the date (assuming date is in column 5)
            let formattedDate = null;
            if (cols[5]) {
                const [month, day, year] = cols[5].split('/');
                if (month && day && year) {
                    formattedDate = `${year}-${month}-${day}`;
                } else {
                    console.warn('Invalid date format:', cols[5]);
                }
            } else {
                console.warn('Missing date in row:', row);
            }

            // Create event object
            const event = {
                title: cols[1] || 'No title',         // Title (column 1)
                address: cols[2] || 'No address',     // Address (column 2)
                description: cols[3] || 'No description', // Description (column 3)
                category: cols[4] || 'No category',   // Category (column 4)
                date: formattedDate || 'No date',     // Date (converted format)
                lat: cols[6] || null,                 // Latitude (column 6)
                lng: cols[7] || null                  // Longitude (column 7)
            };

            // Check if lat and lng are null or empty, then fetch coordinates
            if (!event.lat || !event.lng) {
                // Fetch latitude and longitude for the address using the geocoding function
                const coords = await geocodeAddress(event.address);

                if (coords) {
                    event.lat = coords.lat;
                    event.lng = coords.lng;
                }
            }

            // Log event details
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

        // Filter out any null events (rows that failed processing)
        return events.filter(event => event !== null);
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