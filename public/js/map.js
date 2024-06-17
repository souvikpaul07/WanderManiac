// MAPBOX : https://docs.mapbox.com/mapbox-gl-js/example/simple-map/
mapboxgl.accessToken = mapToken;   // getting the "mapToken" from show.ejs file
const map = new mapboxgl.Map({
  style: 'mapbox://styles/mapbox/satellite-streets-v12',  // to change the map style refer to : https://docs.mapbox.com/mapbox-gl-js/example/setstyle/
  container: 'map', // container ID
  center: coordinates, // starting position [lng, lat]
  zoom: 8 // starting zoom
});


console.log(coordinates);

// to add marker : https://docs.mapbox.com/mapbox-gl-js/example/add-a-marker/
const marker = new mapboxgl.Marker({color: 'rgb(25, 185, 25)'})
        .setLngLat(coordinates) //listing.geometry.coordinates  => fetching from show.ejs
        .addTo(map);
