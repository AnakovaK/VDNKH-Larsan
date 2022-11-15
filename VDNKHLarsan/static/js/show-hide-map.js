var map = document.getElementById('map')
var closeBtn = document.getElementById('close-map-btn')

function hideMap() {
    map.style.display = 'none';
    closeBtn.style.display = 'none';
    document.body.style.overflow = 'visible';
}

function showMap() {
    map.style.display = 'block';
    closeBtn.style.display = 'block';
    document.body.style.overflow = 'hidden';
}