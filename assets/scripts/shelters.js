const SHELTER_BASE_URL = `https://api.petfinder.com/shelter.find?da27018a67011f3d70782e87862dfc22&key=298afb38924e16ecd46eb9871122641b&format=json`
// const MAP_URL = `https://www.google.com/maps/embed/v1/search?key=AIzaSyA34rq6f9suxd0j5VwhPYtmXs7z7PG9YRM&location=${shelterCoordinates}`;
let SHELTER_URL;
let map = null;
let markers = [];

$(document).ready(function() {
setLoading(false)

displayMap();

$("#shelter-location-form").submit(submitLocation);

function submitLocation(event) {
  event.preventDefault();
  // setLoading(true);
  const shelterLocationInput = $("#shelter-location-input").val();
  SHELTER_URL = SHELTER_BASE_URL + `&location=${shelterLocationInput}&callback=?`;
  getShelterData();
};

function getShelterData() {
  $.getJSON(SHELTER_URL)
  .then(locationObject)
  .catch();
}

function locationObject(shelterReturnData) {
    const shelterData = shelterReturnData.petfinder.shelters.shelter;
    let mapMarkerData = [];
    $.each(shelterData, function(index, value) {
      let shelterLocate = {};
      // shelterLocate["name"] = shelterData[index].name.$t;
      shelterLocate["lat"] = parseFloat(shelterData[index].latitude.$t);
      shelterLocate["lng"] = parseFloat(shelterData[index].longitude.$t);
      console.log(shelterLocate);
      mapMarkerData.push(shelterLocate);
  })
  dropMarker(mapMarkerData);
  // displayTable(shelterData);
}
function displayMap () {
  let denver = {lat: 39.7392, lng: -104.9903}
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: denver
  });
}

  function dropMarker(mapMarkerData) {
    clearMarkers();
    for (var i = 0; i < mapMarkerData.length; i++) {
      addMarkerWithTimeout(mapMarkerData[i], i * 200);
    }
  }

  function addMarkerWithTimeout(position, timeout) {
    window.setTimeout(function() {
      markers.push(new google.maps.Marker({
        position: position,
        map: map,
        animation: google.maps.Animation.DROP
      }));
    }, timeout);
  }

  function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers = [];
  }

function displayTable(data) {
  // console.log(data);
  $.each(data, function(index, value){
    console.log(data);
  })
}


function setLoading(isLoading) {
    if (isLoading) {
      $(".loading").show();
      $("form").hide();
    } else {
      $(".loading").hide();
      $("form").show();
    }
  }
}); //END DOCUMENT READY
