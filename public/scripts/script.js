// require('dotenv').config();

// Call geocode
geocode();


// let getLat = document.getElementById('lat').value;
// let getLng = document.getElementById('lng').value;
// console.log(getLat, getLng);


function initMap() {
    // Map options
    var options = {
        zoom: 12,
        center: {lat:41.390205, lng:2.154007} // BCN coordinates
    }

    // New map
    var map = new google.maps.Map(document.getElementById('map'), options);

    // Add marker
//     var marker = new google.maps.Marker({
//         position: { lat: , lng:  }, // coordinates from host
//         map: map
//     })
}


function geocode() { 
    var body = document.getElementsByTagName('body');
    var location = document.body.getElementById('host-address').value;
    console.log('LOCATION', location);
    
    axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
            address: location,
            key: 'AIzaSyAxqCJvneP9HPtNi0X9zICYfLyeuND5Nxw'
        }
    })
    .then( (response) => {
        // Log full response
        console.log(response.data);
        console.log('LAT', response.data.results[0].geometry.location.lat);
        console.log('LONG', response.data.results[0].geometry.location.lng); 

        // Coordinates
        let lat = response.data.results[0].geometry.location.lat;
        let lng = response.data.results[0].geometry.location.lng;
        // let coordinatesInfo = { lat: lat, lng: lng}

        const coordinatesOutput = `
            <ul class="list-group">
                <li class="list-group-item" id="lat">${lat}</li>
                <li class="list-group-item" id="lng">${lng}</li>
            </ul>
        `;

        // Output coordinates
        document.getElementById('coordinates').innerHTML = coordinatesOutput;

        // console.log(coordinatesInfo);
        // return coordinatesInfo;
    })
    .catch( (err) => console.log(err));
}



