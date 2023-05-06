const { json } = require("express/lib/response");


// Api key for mapbox 
const apiKey = 'pk.eyJ1IjoianA4NDEzMzEiLCJhIjoiY2wzZjEwMGE0MDBiaTNla2JsZnB0M3RmdSJ9.ZLQyQW6BpT7i2PcIG2beOw';

// Initializing variables
    let pos;
    const status = document.querySelector('.status');
// Lamada 
    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position);
        pos = [position.coords.latitude, position.coords.longitude];
        console.log(pos);
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

  iconSize:     [38, 95], // size of the icon
  iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
  popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});




const marker = L.marker([pos[0], pos[1]], {icon: userIcon }).addTo(mymap);
return pos;
    })

console.log("hello")
console.log(pos)
function getLocation () {
    console.log(navigator.geolocation.getCurrentPosition(showPosition)) 
}
 
function showPosition (position) {
    console.log("Latitude  " + position.coords.latitude)
    console.log("Longitude " + position.coords.longitude)


    var foodIcon = L.icon({
        iconUrl: 'foodIcon.png',
      
        iconSize:     [38, 95], // size of the icon
        iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
      });
    
      var shelterIcon = L.icon({
        iconUrl: 'shelterIcon.png',
      
        iconSize:     [38, 95], // size of the icon
        iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
      });
    
      var waterIcon = L.icon({
        iconUrl: 'waterIcon.png',
      
        iconSize:     [38, 95], // size of the icon
        iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
      });
    


    //if user chooses food, shelter, water:
    var water = document.getElementById('water').checked;
    var food = document.getElementById('food').checked;
    var civilization = document.getElementById('civilization').checked
    var essentialName = document.getElementById('name').value;

    if(water == true){
        const marker = L.marker([position.coords.latitude, position.coords.longitude], {icon: waterIcon }).addTo(mymap);
    }else if(food == true){
        const marker = L.marker([position.coords.latitude, position.coords.longitude], {icon: foodIcon }).addTo(mymap);
    }else if(civilization == true){
        const marker = L.marker([position.coords.latitude, position.coords.longitude], {icon: shelterIcon }).addTo(mymap);
    }


    fetch(
        "https://api.unmined.ca",
        {
            "body": {
                "lat": position.coords.latitude,
                "lon": position.coords.longitude,
                "dist": 2
            }
        }
    ).then(res => JSON.parse(res))
    .then(data => console.log(data));


    //send to backend
    
  }