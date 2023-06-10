window.onload = function () {
    const spinner = document.getElementById('loading');

    // Add .loaded to .loading
    setTimeout(function () {
        spinner.classList.add('loaded');
    }, 2500);
}