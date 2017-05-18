const SHELTER_BASE_URL = `https://api.petfinder.com/shelter.find?da27018a67011f3d70782e87862dfc22&key=298afb38924e16ecd46eb9871122641b&format=json`
let SHELTER_URL;
let map = null;
let markers = [];
var contentString;

$(document).ready(function() {
  setLoading(false);

  displayMap();

  $("#shelter-location-form").submit(submitLocation);

  function submitLocation(event) {
    event.preventDefault();
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
    let viewportLatLng = [];
    $.each(shelterData, function(index, value) {
      let shelterLocate = {};
      shelterLocate["lat"] = parseFloat(shelterData[index].latitude.$t);
      shelterLocate["lng"] = parseFloat(shelterData[index].longitude.$t);
      shelterLocate["name"] = shelterData[index].name.$t;
      shelterLocate["phone"] = shelterData[index].phone.$t;
      shelterLocate["city"] = shelterData[index].city.$t;
      shelterLocate["state"] = shelterData[index].state.$t;
      shelterLocate["zip"] = shelterData[index].zip.$t;
      mapMarkerData.push(shelterLocate);
      viewportLatLng.push(shelterLocate["lat"],shelterLocate["lng"])
    });
    // console.log(shelterData);
    // console.log(mapMarkerData);
    // console.log(viewportLatLng);
    dropMarker(mapMarkerData);
    // displayTable(shelterData);
  };

  function displayMap() {
    let denver = {
      lat: 39.7392,
      lng: -104.9903
    }
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 5,
      center: denver
    });
  };

  function dropMarker(markerData) {
    clearMarkers();
    for (var i = 0; i < markerData.length; i++) {
      addMarkerWithTimeout(markerData[i], i * 200);
    };
  };

  function addMarkerWithTimeout(position, timeout) {
    window.setTimeout(function() {
      markers.push(new google.maps.Marker({
        position: position,
        map: map,
        animation: google.maps.Animation.DROP,
        title: position.name,
      }));
    }, timeout);
    markerClickFunction(position);
  };

  function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    };
    markers = [];
  };

  function markerClickFunction(position) {
    let infowindow = new google.maps.InfoWindow({
      content: `<div class="map-marker"><h3>${position.name}</h3><p>${position.phone}<p><p>${position.city}, ${position.state} ${position.zip}</p></div>`
    });
    google.maps.event.addListener(markers, 'click', function() {
      infowindow.open(map, markers)
    });
  }

  function displayTable(data) {
    // console.log(data);
    $.each(data, function(index, value) {
      // console.log(data);
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
