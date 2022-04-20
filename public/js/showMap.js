
    mapboxgl.accessToken = mbxToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v11', // style URL
        center: craft.geometry.coordinates, // starting position [lng, lat]
        zoom: 4 // starting zoom
    });

    new mapboxgl.Marker()
    .setLngLat(craft.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
        .setHTML(
            `<p>${craft.craftName}</p><small>${craft.location}</small>`
        )
    )
    .addTo(map)