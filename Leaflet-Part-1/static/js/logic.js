
  // USGS endpoints
/* url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"; */
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
/* url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"; */
/* url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson"; */

// Retrieve data with D3 and console.log it 
d3.json(url).then(function(eq){
    console.log(eq);
    createFeatures(eq.features);
});

// Function to run once for each feature in the array
function createFeatures(eqData) {

  // Give each feature a popup that shows magnitude, location and depth of the earthquake.
  function perFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.title}</h3><hr><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
  };

  // Calculate marker size based on earthquake magnitude
  function circleMark(feature, latlng) {
    let marks = {radius: 6 * feature.properties.mag,};
    return L.circleMarker(latlng, marks);
  };

  // Set marker color related to earthquake depth
  function colorize(feature) {
    let depth = feature.geometry.coordinates[2];
    if(depth < 0) {
      return {color: "#DDA0DD"};        // Plum
    } else if(depth < 30) {
      return {color: "#9370DB"};        // Medium Purple
    } else if(depth < 60) {
      return {color: "#6A5ACD"};        // Slate Blue
    } else if(depth < 90) {
      return {color: "#483D8B"};        // Dark Slate Blue
    } else {
      return {color: "#4B0082"};        // Indigo
    };
  };

  // Create a GeoJSON layer that contains the features array on the eqData object.
  let earthquakes = L.geoJSON(eqData, {
    onEachFeature: perFeature,
    pointToLayer: circleMark,
    style: colorize, 
  });

  // Send GeoJSON layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {
  // Create the base layers
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // Create a baseMaps object
  let baseMaps = {
    "Street Map": street,
  };

  // Create map with streetmap and earthquakes layers to display on load
  let myMap = L.map("map", {
    center: [39.73915, -104.9847],    // Denver CO
    zoom: 5,
    layers: [street, earthquakes],
  });

  // Create a legend to display information about our map
  let legend = L.control({position: "bottomright"});
  legend.onAdd = function () {
    let div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = "<table>" + 
    "<tr> <th style='text-align:center; font-size:200%; color:black;'> Depth </th> </tr>"+
    "<tr> <td style='text-align:center; font-size:200%; color:black; background-color:#DDA0DD;'> 00 - </td> </tr>"+
    "<tr> <td style='text-align:center; font-size:200%; color:white; background-color:#9370DB;'> 0-30 </td> </tr>"+
    "<tr> <td style='text-align:center; font-size:200%; color:white; background-color:#6A5ACD;'> 30-60 </td> </tr>"+
    "<tr> <td style='text-align:center; font-size:200%; color:white; background-color:#483D8B;'> 60-90 </td> </tr>"+
    "<tr> <td style='text-align:center; font-size:200%; color:white; background-color:#4B0082;'> 90 + </td> </tr>"+
    "</table>"; 
  
    return div;
  }

  // Add the info legend to the map
  legend.addTo(myMap);

}