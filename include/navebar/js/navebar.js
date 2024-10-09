function loadNavbar() {
    // Load the navbar HTML and inject it into the page
    fetch('include/navebar/navebar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Error loading the navbar:', error));
}

// Check the current document readyState
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    // If the document is already ready, execute immediately
    loadNavbar();
} else {
    // Otherwise, wait for the readyState to change to 'complete'
    document.addEventListener('readystatechange', function () {
        if (document.readyState === 'complete') {
            loadNavbar();
        }
    });
}
