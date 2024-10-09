// Load the header and navbar HTML and inject them into the page
document.addEventListener("DOMContentLoaded", function () {
    // Load the header
    fetch('include/header/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Error loading the header:', error));
});
