
console.log("heckers");

// Api key for mapbox 
const apiKey = 'pk.eyJ1IjoianA4NDEzMzEiLCJhIjoiY2wzZjEwMGE0MDBiaTNla2JsZnB0M3RmdSJ9.ZLQyQW6BpT7i2PcIG2beOw';

// get the url parameters
function parseURLParams(url) {
    var queryStart = url.indexOf("?") + 1,
        queryEnd = url.indexOf("#") + 1 || url.length + 1,
        query = url.slice(queryStart, queryEnd - 1),
        pairs = query.replace(/\+/g, " ").split("&"),
        parms = {}, i, n, v, nv;

    if (query === url || query === "") return;

    for (i = 0; i < pairs.length; i++) {
        nv = pairs[i].split("=", 2);
        n = decodeURIComponent(nv[0]);
        v = decodeURIComponent(nv[1]);
        // v = v[0];

        if (!parms.hasOwnProperty(n)) parms[n] = [];
        parms[n].push(nv.length === 2 ? v : null);
    }
    return parms;
}

// Gets position from leaflet and puts into mapbox to generate the map
function get_current_pos(position) {
    console.log("get_current_pos")
    pos = [position.coords.latitude, position.coords.longitude];
    const mymap = L.map('map').setView([pos[0], pos[1]], 10);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: apiKey
    }).addTo(mymap);


    //initializing Icons
    var userIcon = L.icon({
        iconUrl: 'userIcon.png',

        iconSize: [38, 95], // size of the icon
        iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
        popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    var waterIcon = L.icon({
        iconUrl: 'waterIcon.png',

        iconSize: [38, 95], // size of the icon
        iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
        popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    var foodIcon = L.icon({
        iconUrl: 'foodIcon.png',

        iconSize: [38, 95], // size of the icon
        iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
        popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
    var shelterIcon = L.icon({
        iconUrl: 'shelterIcon.png',

        iconSize: [38, 95], // size of the icon
        iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
        popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
    var unknownIcon = L.icon({
        iconUrl: 'unknownIcon.png',

        iconSize: [38, 45], // size of the icon
        iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
        popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    // Creating marker
    const marker = L.marker([pos[0], pos[1]], { icon: userIcon }).addTo(mymap);

    let around = getLocation(pos, parseURLParams(window.location.href));
    var newMarker;
    around.then(_ => _.data)
        .then(data => {
            console.log("aaaaaa", data);
            for (var i = 0; i < data.length; i++) {
                let img;
                switch (data[i].type) {
                    case -1:
                        img = unknownIcon;
                        break;
                    case 0:
                        img = foodIcon;
                        break;
                    case 1:
                        img = shelterIcon;
                        break;
                    case 2:
                        img = waterIcon;
                        break;
                }
                const marker = L.marker(
                    [data[i].lat, data[i].lon],
                    { icon: img }
                ).addTo(mymap);

            }
        });
}

// Initializing variables
let pos = [0, 0];
const status = document.querySelector('.status');

// Lamada 
navigator.geolocation.getCurrentPosition(get_current_pos)

let display = false;

// On button click it runs the getLocation() function
function on_display_button_click() {
    display = !display;
    getLocation();
}

// Connecting to our own api
async function post(endpoint = "/", body = {}) {
    let response = await fetch(
        "https://api.unmined.ca" + endpoint,
        {
            "method": "POST",
            // "mode": "no-cors",
            "body": JSON.stringify(body)
        }
    );
    let data = await response.json();
    return data;
}

// getLocation() function
function getLocation(pos, params = {}) {
    let x = post("/info", {
        "lat": pos[0],
        "lon": pos[1],
        "dist": 5,
        params,
    });
    console.log(x);
    return x;
}

// Adds location function
function addLocation(type) {
    console.log(post("/add", {
        "lat": pos[0],
        "lon": pos[1],
        "type": type,
    }))
}

// Gets which button is clicked from the HTML and adds the current location on the map
function onSubmit(event) {
    type = -1;
    // event.preventDefault();
    var radioButtons = document.getElementsByName("type");
    for (var i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].checked == true) {
            type = radioButtons[i].value;
        }
    }
    addLocation(parseInt(type));
}

let form;
let action;

function findElements() {
    form = document.querySelector('form');
    ({ action } = form);
}

function subscribe() {
    form.addEventListener('submit', onSubmit);
}

function init() {
    findElements();
    subscribe();
}

init();

// getLocation().then(v => console.log("aaa",v));
// let v = getLocation([0,0]);
// console.log(v);