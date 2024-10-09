
    // Function to get URL parameters
    function getUrlParams() {
    var params = {};
    var queryString = window.location.search.substring(1); // Remove the "?" at the start
    var vars = queryString.split("&");
    vars.forEach(function (param) {
    var pair = param.split("=");
    params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
});
    return params;
}

    // Get event details from the URL
    var eventDetails = getUrlParams();

    console.log(eventDetails); // Check if data is correctly parsed from URL

    // Display event details
    document.getElementById('event-title').textContent = eventDetails.title || 'No title';
    document.getElementById('event-date').textContent = 'Date: ' + (eventDetails.date || 'No date');
    document.getElementById('event-category').textContent = eventDetails.category || 'No category';
    document.getElementById('event-description').textContent = eventDetails.description || 'No description';

    // Add event details to calendar
    function addToCalendar(title, date, description) {
    var eventDate = new Date(date);
    var startDate = eventDate.toISOString().replace(/-|:|\.\d+/g, '');
    var endDate = new Date(eventDate.getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d+/g, '');

    var calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(description)}`;

    window.open(calendarUrl, '_blank');
}

    // Dynamically set onclick for "Ajouter dans calendrier" button
    var calendarButton = document.getElementById('add-to-calendar-btn');
    calendarButton.onclick = function() {
    addToCalendar(eventDetails.title, eventDetails.date, eventDetails.description);
};
