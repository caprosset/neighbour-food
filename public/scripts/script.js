// Call geocode
geocode();

function geocode() {
    var location = document.getElementById('host-address').value;
    axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
            address: location,
            key: 'AIzaSyAxqCJvneP9HPtNi0X9zICYfLyeuND5Nxw'
        }
    })
    .then( (response) => {
        // Log full response
        console.log('LAT', response.data.results[0].geometry.location.lat);
        console.log('LONG', response.data.results[0].geometry.location.lng); 

        // Coordinates
        let lat = response.data.results[0].geometry.location.lat;
        let lng = response.data.results[0].geometry.location.lng;
        let coordinatesOutput = `
            <ul class="list-group">
                <li class="list-group-item">${lat}</li>
                <li class="list-group-item">${lng}</li>
            </ul>
        `;

        // Output coordinates
        document.getElementById('coordinates').innerHTML = coordinatesOutput;
    })
    .catch( (err) => console.log(err));
}


