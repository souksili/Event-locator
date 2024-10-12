function getUrlParams() {
    var params = {};
    var queryString = window.location.search.substring(1);
    var vars = queryString.split("&");
    vars.forEach(param => {
        var pair = param.split("=");
        params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    });
    return params;
}

var eventDetails = getUrlParams();

d3.select('#event-title').text(eventDetails.title || 'No title');
d3.select('#event-date').text('Date: ' + (eventDetails.date || 'No date'));
d3.select('#event-category').text(eventDetails.category || 'No category');
d3.select('#event-description').text(eventDetails.description || 'No description');

function addToCalendar(title, date, description) {
    var eventDate = new Date(date);
    var startDate = eventDate.toISOString().replace(/-|:|\.\d+/g, '');
    var endDate = new Date(eventDate.getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d+/g, '');

    var calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(description)}`;

    window.open(calendarUrl, '_blank');
}

var calendarButton = d3.select('#add-to-calendar-btn');
calendarButton.on('click', function() {
    addToCalendar(eventDetails.title, eventDetails.date, eventDetails.description);
});