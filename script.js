const map = L.map("map", {
  maxZoom: 17,
  minZoom: 3,
  maxBounds: [
    [-90, -180], // Southwest coordinates
    [90, 180], // Northeast coordinates
  ],
}).setView([49.75863040315576, 6.6431523766027], 1);
var Stadia_AlidadeSmoothDark = L.tileLayer(
  "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}",
  {
    attribution:
      '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    ext: "png",
  }
);
var CartoDB_Positron = L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  }
).addTo(map);
var OSM = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {});

//limit the max boundaries of map
var southWest = L.latLng(-90, -180),
  northEast = L.latLng(90, 180);
bounds = L.latLngBounds(southWest, northEast);

map.setMaxBounds(bounds);
map.on("drag", function () {
  map.panInsideBounds(bounds, { animate: false });
});

//create layer of maps
var basemaps = {
  OSM: OSM,
  Carto: CartoDB_Positron,
  Stadia: Stadia_AlidadeSmoothDark,
};

var location_button = document.getElementById("location_button");
location_button.addEventListener("click", () => {
  console.log("button clicked");
  map.locate().on("locationfound", locf);
});
// create a location button and marker on the map
function locf(e) {
  console.log(
    "Your Location: Latitude:" + e.latitude + " Longitude:" + e.longitude
  );
  var location_icon = L.icon({
    iconUrl: "data/current_loc_pin.png",
    iconSize: [64, 64],
    iconAnchor: [32, 64],
    className: "icons",
  });
  map.flyTo([e.latitude, e.longitude], 5);
  const location_markers = L.marker([e.latitude, e.longitude], {
    icon: location_icon,
  }).addTo(map);
  location_markers.on("click", () => {
    location_markers.remove();
  });
}
