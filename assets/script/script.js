var formEl = document.querySelector('#formEl');
var searchBar = document.querySelector('#searchBar');
var lat; 
var lon;
var locationiqKey = 'pk.d7efa64ad72930f59e7960a7cb00fa7c';
var styleKey = 'pk.aa6177ea090cca8fee755da0893b03e8';
var parksKey = 'pk.7df0b25504ae825b867431043a4594df';
var themeStandard = "streets"
var themeDark = "dark"
var themeLight = "light"
locationiq.key = styleKey;
function fetchLocation(query) {
    var url = 'https://us1.locationiq.com/v1/search.php?key=' + locationiqKey + '&q=' + query + '&format=json';
    fetch(url)
        .then((response) => response.json())
        .then((data) => {console.log(data);
        lat = data[0].lat;
        lon = data[0].lon;
        console.log(lon,lat)
        
    var url2 = 'https://us1.locationiq.com/v1/nearby.php?key=' + parksKey + '&lat=' + lat + '&lon=' + lon + '&tag=park&radius=3000&format=json'

        fetch(url2)
            .then((response2) => response2.json())
            .then(function (data2) {
                console.log(data2);
                for (i=0;i < data2.length; i+=1) { 
            parkLat = data2[i].lat;
            parkLon = data2[i].lon;
        
            var marker1 = new mapboxgl.Marker( {color: 'green', rotation: 45 })
            .setLngLat([parkLon, parkLat])
            .addTo(map);
            
                }
        } )

     var map = new mapboxgl.Map({
        container: 'map',
        attributionControl: false, //need this to show a compact attribution icon (i) instead of the whole text
        style: 'https://tiles.locationiq.com/v3/' + themeStandard + '/vector.json?key='+ styleKey,
        zoom: 12,
        center: [lon,lat]
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
        var layerStyles = {
            "Streets": "streets/vector",
            "Dark": "dark/vector",
            "Light": "light/vector"
        };
       
        map.addControl(new locationiqLayerControl({
            key: locationiq.key,
            layerStyles: layerStyles
        }), 'top-left');

        //Add Geolocation control to the map (will only render when page is opened over HTTPS)
        map.addControl(new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true
        }));
    });

}



function submitHandler() {
    event.preventDefault();
    var query = searchBar.value.trim();

    if (query) {
        fetchLocation(query);
        console.log(query);

    } else {
        alert('Please enter a valid city name');
    }
}



formEl.addEventListener('submit', submitHandler);

