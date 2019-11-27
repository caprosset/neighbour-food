// require('dotenv').config();

// Call geocode
geocode();

function geocode() { 
    var location = document.getElementById('host-address').innerHTML;
    // console.log('LOCATION', location);
    
    axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
            address: location,
            // key: process.env.MAPS_API_KEY
            key: 'AIzaSyAxqCJvneP9HPtNi0X9zICYfLyeuND5Nxw'
        }
    })
    .then( (response) => {
        // Log full response
        // console.log(response.data);
        // console.log('LAT', response.data.results[0].geometry.location.lat);
        // console.log('LONG', response.data.results[0].geometry.location.lng); 

        // Coordinates
        let lat = response.data.results[0].geometry.location.lat;
        let lng = response.data.results[0].geometry.location.lng;

        const coordinatesOutput = `
            <ul class="list-group">
                <li class="list-group-item" id="lat">${lat}</li>
                <li class="list-group-item" id="lng">${lng}</li>
            </ul>
        `;

        // Output coordinates
        document.getElementById('coordinates').innerHTML = coordinatesOutput;

        // coordinatesInfo = { lat: lat, lng: lng};
        // return coordinatesInfo;
    })
    // .then(coordinatesInfo => {        
    //     // console.log(coordinatesInfo);
    // })
    .catch( (err) => console.log(err) );
}
