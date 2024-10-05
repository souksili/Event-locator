document.addEventListener('DOMContentLoaded', function () {
    var categoryElement = document.getElementById('category-filter');
    var dateElement = document.getElementById('date-filter');

    if (categoryElement && dateElement) {
        categoryElement.addEventListener('change', filterEvents);
        dateElement.addEventListener('change', filterEvents);
    }

    loadCSV().then(events => {
        window.eventsData = events;
        generateChart(eventsData);
    }).catch(error => {
        console.error('Erreur lors du chargement des événements:', error);
    });
});

function generateChart(events) {
    var categories = {};
    events.forEach(event => {
        categories[event.category] = (categories[event.category] || 0) + 1;
    });

    var ctx = document.getElementById('eventsChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(categories),
            datasets: [{
                label: 'Nombre d\'événements',
                data: Object.values(categories),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
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

    generateChart(filteredEvents);
}