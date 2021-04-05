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

// Local Storage ===============

var favoritesForm = document.querySelector("#favoritesInputForm");
var favoritesInput = document.querySelector("#favoritesInputText");
var parks = ('');

var parksArray = [];

function init() {
    var storedParks = JSON.parse(localStorage.getItem("parks"));

    if (storedParks !== null) {
        parks = storedParks;
    }

    showParks();
}

function storeFavoriteParks(favInputText) {
    var storedParks = JSON.parse(localStorage.getItem("parks"));

    if (storedParks !== null) {
        parksArray = storedParks;

        parksArray.push(favInputText);
        localStorage.setItem("parks", JSON.stringify(parksArray));
    } else {
        parksArray.push(favInputText);
        localStorage.setItem("parks", JSON.stringify(parksArray));
    }
    parks = parksArray;
}


favoritesForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var favInputText = favoritesInput.value.trim();

    if (favoritesInput === "") {
        return;
    }

    // Set value for user input, pushes to parksArray
    // then runs function to append list item and set local storage

    favoritesValue = favoritesInput.value;
    // parksArray.push(favInputText);

    // Clears input field, stores input in local storage
    favoritesInput.value = "";
    console.log(favInputText);
    storeFavoriteParks(favInputText);
    showParks();
});

function showParks() {
    console.log("showParks");
    // Append tree for list item and styling
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    var userFavoritesList = document.getElementById("favoritesList");

    userFavoritesList.innerHTML = "";

    for (var i = 0; i < parks.length; i += 1) {
        var favoritePlace = document.createElement("a");
        var span = document.createElement("span");
        var spanIcon = document.createElement("i");

        var park = parks[i];

        span.appendChild(spanIcon);
        favoritePlace.classList.add("panel-block");
        favoritePlace.setAttribute("data-index", i);
        favoritePlace.appendChild(span);
        span.classList.add("panel-icon");
        spanIcon.classList.add("fas", "fa-book");
        spanIcon.setAttribute("aria-hidden", "true");
        userFavoritesList.appendChild(favoritePlace);
        favoritePlace.append(park);
    }
};

// Local Storage ===============


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
            parkName = data2[i].name;
        
            var popup = new mapboxgl.Popup()
                .setHTML('<b>Park Name:</b>' + parkName);
                
            var el = document.createElement('div');
            el = mapboxgl.Marker
                el.id = 'markerWithExternalCss';
                // finally, create the marker
console.log(parkName);
            var markerWithExternalCss = new mapboxgl.Marker({color: 'green', rotation: 45 })
                .setLngLat([parkLon, parkLat])
                .setPopup(popup)
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



function submitHandler(event) {
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
init();
