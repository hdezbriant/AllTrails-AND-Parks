// var mapBox = document.querySelector('#map');
// mapBox.addEventListener('submit', changeCoords);

//Add your LocationIQ Maps Access Token here (not the API token!)
locationiqKey = 'pk.d7efa64ad72930f59e7960a7cb00fa7c';
//Define the map and configure the map's theme
var map = new mapboxgl.Map({
    container: 'map',
    attributionControl: false, //need this to show a compact attribution icon (i) instead of the whole text
    style: 'https://tiles.locationiq.com/v3/streets/vector.json?key='+locationiqKey,
    zoom: 12,
    center: [-117.16, 32.71]
});


//Add Navigation controls to the map to the top-right corner of the map
var nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-right');
//Add a 'full screen' button to the map
map.addControl(new mapboxgl.FullscreenControl());
//Add a Scale to the map
map.addControl(new mapboxgl.ScaleControl({
    maxWidth: 80,
    unit: 'metric' //imperial for miles
}));
//Add Geolocation control to the map (will only render when page is opened over HTTPS)
map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
}))
;



function fetchLocation(query) {
    var url = 'https://us1.locationiq.com/v1/search.php?key=' + locationiqKey + '&q=' + query + '&format=json';

    fetch(url)
    .then((response) => response.json())
    .then((data) => console.log(data));

}

fetchLocation('SanDiego');