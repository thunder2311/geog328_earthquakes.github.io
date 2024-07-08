mapboxgl.accessToken = 'pk.eyJ1IjoibmF0dHkyMzEiLCJhIjoiY2x5Y2UwdTNqMW54MjJrb2VoYmdqdW1mZyJ9.7uJzjh7nE8BSB5pJ3frx4w';

let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/satellite-v9',
    zoom: 5.5,
    center: [138, 38]
});

let earthquakes, japan;

async function geojsonFetch() {
    let response;

    response = await fetch('assets/earthquakes.geojson');
    earthquakes = await response.json();
    console.log('Earthquakes data:', earthquakes);

    response = await fetch('assets/japan.json');
    japan = await response.json();
    console.log('Japan data:', japan);

    loadMapData();
    generateTable(earthquakes);
}

function loadMapData() {
    map.addSource('earthquakes', {
        type: 'geojson',
        data: earthquakes
    });

    map.addLayer({
        id: 'earthquakes-layer',
        type: 'circle',
        source: 'earthquakes',
        paint: {
            'circle-radius': 8,
            'circle-stroke-width': 2,
            'circle-color': 'red',
            'circle-stroke-color': 'white'
        }
    });

    map.addSource('japan', {
        type: 'geojson',
        data: japan
    });

    map.addLayer({
        id: 'japan-layer',
        type: 'fill',
        source: 'japan',
        paint: {
            'fill-color': '#0080ff',
            'fill-opacity': 0.5
        }
    });
}

function generateTable(earthquakes) {
    let table = document.getElementsByTagName("table")[0];
    let row, cell1, cell2, cell3;
    for (let i = 0; i < earthquakes.features.length; i++) {
        row = table.insertRow(-1);
        cell1 = row.insertCell(0);
        cell2 = row.insertCell(1);
        cell3 = row.insertCell(2);
        cell1.innerHTML = earthquakes.features[i].properties.id;
        cell2.innerHTML = earthquakes.features[i].properties.mag;
        cell3.innerHTML = new Date(earthquakes.features[i].properties.time).toLocaleDateString("en-US");
    }
}

geojsonFetch();

let btn = document.getElementsByTagName("button")[0];
btn.addEventListener('click', sortTable);

function sortTable(e) {
    let table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementsByTagName("table")[0];
    switching = true;
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = parseFloat(rows[i].getElementsByTagName("td")[1].innerHTML);
            y = parseFloat(rows[i + 1].getElementsByTagName("td")[1].innerHTML);
            if (x < y) {
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}