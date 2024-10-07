// Load the navbar HTML and inject it into the page
document.addEventListener("DOMContentLoaded", function () {
    fetch('include/navebar/navebar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Error loading the navbar:', error));
});
