const map = L.map("map", {
  maxZoom: 17,
  minZoom: 3,
  maxBounds: [
    [-90, -180], // Southwest coordinates
    [90, 180],
  ],
}).setView([49.75863040315576, 6.6431523766027], 1);
async function OTM() {
  var OpenTopoMap = await L.tileLayer(
    "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 17,
      attribution:
        'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    }
  ).addTo(map);
}

OTM();
var southWest = L.latLng(-90, -180),
  northEast = L.latLng(90, 180);
bounds = L.latLngBounds(southWest, northEast);

map.setMaxBounds(bounds);
map.on("drag", function () {
  map.panInsideBounds(bounds, { animate: false });
});
let firsttime = true;
let iss_coordinates = [];
const api_iss = "https://api.wheretheiss.at/v1/satellites/25544";

async function get_iss() {
  const response = await fetch(api_iss);
  const data = await response.json();
  let { latitude, longitude } = data;
  let lat = data.latitude;
  let lon = data.longitude;
  iss_coordinates.push([latitude, longitude]);
  //main.innerHTML = `<h1>${latitude},${longitude}</h1>`;
  let issUrl = "data/iss.png";

  addMarker(latitude, longitude, issUrl);
  //console.log(lat, lon);
  return { lat, lon };
}

//create custom marker
let marker;
function addMarker(lat, lng, iconUrl) {
  let issIcon = L.icon({
    iconUrl: iconUrl,
    className: "iss",
    iconSize: [64, 64],
    iconAnchor: [32, 64],
  });
  if (marker) {
    marker.remove();
  }
  marker = L.marker([lat, lng], {
    icon: issIcon,
  }).addTo(map);
  if (firsttime) {
    map.setView([lat, lng], 10);
    firsttime = false;
  }
  clickMarker(marker, lat, lng);
}
setInterval(get_iss, 1000);

let dist = [];
//create polyline behind iss
let polyline;
function firstpolyline() {
  if (polyline) {
    polyline.remove();
  }
  polyline = L.polyline(iss_coordinates, {
    color: "red",
    weight: 3,
    opacity: 0.5,
    smoothFactor: 1,
  }).addTo(map);
  let distance = map.distance(
    iss_coordinates[iss_coordinates.length - 1],
    iss_coordinates[iss_coordinates.length - 2]
  );

  dist.push([dist.length + 1, distance]);
}
setInterval(firstpolyline, 1000);

//event when click on marker
function clickMarker(marker, lat, lng) {
  marker.on("click", () => {
    console.log(lat, lng);
    map.flyTo([lat, lng]);
  });
}
// let dist = [];
// function distance(multipoint) {
//   for (i in multipoint.length) {
//     let d = map.distance(multipoint[i], multipoint[i - 1]);
//     dist.push([i, d]);
//   }
//   return dist;
// }
