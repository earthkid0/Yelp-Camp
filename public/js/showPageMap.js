mapboxgl.accessToken = mapToken
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: [campLng, campLat], // starting position [lng, lat]
    zoom: 10, // starting zoom
});

const popup = new mapboxgl.Popup({ offset: 25 })
    .setLngLat([campLng, campLat])
    .setHTML(`<h3>${campTitle}</h3>${campLocation}`)
    .setMaxWidth("300px")
    .addTo(map);

new mapboxgl.Marker()
    .setLngLat([campLng, campLat])
    .setPopup(popup)
    .addTo(map)
