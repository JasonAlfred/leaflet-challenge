function markerSize(mag) {
  return Math.pow(mag, 7) + 15000;
}

function getColor(depth) {
  if (depth === 0 || depth < 0) {
    return '#F6BDC0'
  }
  if (depth > 0 && depth <= 5) {
    return '#F1959B'
  }
  if (depth > 5 && depth <= 10) {
    return '#F07470'
  }
  if (depth > 10 && depth <= 15) {
    return '#EA4C46'
  }
  if (depth > 15 && depth <= 20) {
    return '#DC1C13'
  }
  if (depth > 20) {
    return '#420D09'
  }
}



let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3
d3.json(url).then(function (response) {

  let quakeMarkers = [];

  for (let i = 0; i < response.features.length; i++) {
    let features = response.features[i]
    let datetimeCalc = new Date(features.properties.time)


    quakeMarkers.push(
      L.circle([features.geometry.coordinates[1], features.geometry.coordinates[0]], {
        stroke: false,
        fillOpacity: 0.75,
        color: "black",
        fillColor: getColor(features.geometry.coordinates[2]),
        radius: markerSize(features.properties.mag)
      }).bindPopup(`<h2>${features.properties.place}</h2><hr>
             <h3>Date: </h3>${datetimeCalc}<br>
             <span style="color:${getColor(features.geometry.coordinates[2])};">
             <h3>Depth: </h3>${features.geometry.coordinates[2]}
             </span><br>
             <h3>Magnitude: <h3>${features.properties.mag}`)
    );
  }

  let streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  let darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  let satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "satellite-streets-v11",
    accessToken: API_KEY
  });

  let outdoormap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "outdoors-v11",
    accessToken: API_KEY
  });

  let litemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });



  let earthquakes = L.layerGroup(quakeMarkers);

  // Create a baseMaps object
  let baseMaps = {
    "Street Map": streetmap,
    "Light Map": litemap,
    "Dark Map": darkmap,
    "Satellite Map": satellitemap,
    "Outdoor Map": outdoormap,

  };

  // Create an overlay object
  let overlayMaps = {
    "Earthquakes": earthquakes
  };

  // Define a map object
  let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 3,
    layers: [darkmap, earthquakes]
  });

  // Pass our map layers into our layer control
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

})
