let targetPosition = { lat: 0, lng: 0 };
let map = undefined;
let guessMarker = undefined;

// starts loading of map
function init() {
    if (navigator.geolocation)
        navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
    else
        initMap({ lat: 0, lng: 0 });

    initInfoWindow();
    setInfoWindowPos();
}

// success callback for geolocator
function geoSuccess(position) {
    initMap({ lat: position.coords.latitude, lng: position.coords.longitude });
}

// error callback for geolocator
function geoError(err) {
    console.error(err);
    initMap({ lat: 0, lng: 0 });
}

// loads map div with google maps
function initMap(position) {
    map = new google.maps.Map(document.querySelector("#map"), {
        zoom: 3,
        center: position,
        streetViewControl: false,
    });

    // place a guess marker on map click
    google.maps.event.addListener(map, "click", (e) => placeMarker(e));
}

// adds the guess marker onto the map
function placeMarker(e) {
    // clears previous marker if exists
    if (guessMarker != undefined)
        guessMarker.setMap(undefined);

    // puts new guess marker on the map
    guessMarker = new google.maps.Marker({
        position: e.latLng,
        map: map
    });

    guessMarker.setMap(map);
}

// populates info window with values
function initInfoWindow() {
    let ip = generatePublicIP();
    document.querySelector("#ipValue").innerText = ip;

    fetch(`http://ip-api.com/json/${ip}?fields=status,message,continent,country,countryCode,currency,region,regionName,city,zip,lat,lon,isp,org,as,query`)
        .then(res => res.json())
        .then((data) => {
            console.log(data);

            document.querySelector("#hintCurrency").innerText = data.currency;
            document.querySelector("#hintContinent").innerText = data.continent;
            document.querySelector("#hintISP").innerText = data.isp;

            targetPosition.lat = data.lat;
            targetPosition.lng = data.lon;
        })
        .catch(error => console.error);
}

// sets info window to bottom left of map
function setInfoWindowPos() {
    let infoWindow = document.querySelector("#infoWindow"),
        map = document.querySelector("#map");

    infoWindow.style.left = map.offsetLeft + 5;
    infoWindow.style.top = map.offsetTop + map.clientHeight - infoWindow.clientHeight - 3;
}

// handles guessing location
document.querySelector("#btnGuess").onclick = () => {
    if (guessMarker == undefined) {
        alert("No marker has been placed yet!");
        return;
    }

    let guessPosition = { lat: guessMarker.position.lat(), lng: guessMarker.position.lng() };

    let targetMarker = new google.maps.Marker({
        position: targetPosition,
        map: map,
        icon: "https://i.imgur.com/TjOKoeA.png"
    });

    targetMarker.setMap(map);

    let line = new google.maps.Polyline({
        path: [guessPosition, targetPosition],
        strokeOpacity: 0,
        icons: [{
            icon: {
                path: "M 0,-1 0,1",
                strokeOpacity: 1,
                scale: 2
            },
            offset: "1",
            repeat: "10px"
        }]
    })

    line.setMap(map);

    let distance = calculateDistance(guessPosition, targetPosition);
    alert(`Distance from actual location is ${distance} km`);
};

// resets info window position on resize
window.addEventListener("resize", setInfoWindowPos);