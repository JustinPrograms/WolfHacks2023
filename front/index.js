

const apiKey = 'pk.eyJ1IjoianA4NDEzMzEiLCJhIjoiY2wzZjEwMGE0MDBiaTNla2JsZnB0M3RmdSJ9.ZLQyQW6BpT7i2PcIG2beOw';


    const status = document.querySelector('.status');
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

const marker = L.marker([pos[0], pos[1]]).addTo(mymap);

    })
 