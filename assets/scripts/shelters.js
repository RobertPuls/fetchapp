const SHELTER_BASE_URL = `https://api.petfinder.com/shelter.find?da27018a67011f3d70782e87862dfc22&key=298afb38924e16ecd46eb9871122641b&format=json`
let SHELTER_URL;
let MAP_STYLE = [{
    "elementType": "geometry",
    "stylers": [{
      "color": "#f5f5f5"
    }]
  },
  {
    "elementType": "labels.icon",
    "stylers": [{
      "visibility": "off"
    }]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [{
      "color": "#616161"
    }]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [{
      "color": "#f5f5f5"
    }]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [{
      "color": "#bdbdbd"
    }]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [{
      "color": "#eeeeee"
    }]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [{
      "color": "#757575"
    }]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [{
      "color": "#e5e5e5"
    }]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [{
      "color": "#9e9e9e"
    }]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [{
      "color": "#ffffff"
    }]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [{
      "color": "#757575"
    }]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [{
      "color": "#dadada"
    }]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [{
      "color": "#616161"
    }]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [{
      "color": "#9e9e9e"
    }]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [{
      "color": "#e5e5e5"
    }]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [{
      "color": "#eeeeee"
    }]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{
      "color": "#c9c9c9"
    }]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [{
      "color": "#9e9e9e"
    }]
  }
];
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
      shelterLocate["city"] = shelterData[index].city.$t;
      shelterLocate["state"] = shelterData[index].state.$t;
      shelterLocate["zip"] = shelterData[index].zip.$t;
      shelterLocate["phone"] = shelterData[index].phone.$t;
      shelterLocate["email"] = shelterData[index].email.$t;
      mapMarkerData.push(shelterLocate);
      viewportLatLng.push({
        lat: shelterLocate["lat"],
        lng: shelterLocate["lng"]
      })
    });
    dropMarker(mapMarkerData);
    defineMapBoundries(viewportLatLng);
    displayTable(shelterData);
  };

  function displayMap() {
    let denver = {
      lat: 39.7392,
      lng: -104.9903
    }
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 5,
      center: denver,
      styles: MAP_STYLE
    });
  };

  function dropMarker(markerData) {
    clearMarkers();
    for (var i = 0; i < markerData.length; i++) {
      addMarkerWithTimeout(markerData[i], i * 300);
    };
  };

  function addMarkerWithTimeout(position, timeout) {
    let marker = new google.maps.Marker({
      position: position,
      map: map,
      animation: google.maps.Animation.DROP,
      title: position.name,
    })
    window.setTimeout(function() {
      markers.push(marker);
    }, timeout);
    markerClickFunction(marker, position);
  };

  function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    };
    markers = [];
  };

  function markerClickFunction(marker, position) {
    let infowindow = new google.maps.InfoWindow({
      content: `<div><h5>${position.name}</h5><p><strong>Location: </strong>${position.city}, ${position.state} ${position.zip}</p><p><strong>Email: </strong>${position.email}<p><p><strong>Phone: </strong>${position.phone}<p></div>`
    });
    marker.addListener('click', function() {
      infowindow.open(map, marker)
    });
  }

  //  Set up map boundries
  function defineMapBoundries(viewportLatLng) {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < viewportLatLng.length; i++) {
      bounds.extend(viewportLatLng[i]);
    }
    map.fitBounds(bounds);
  }

  function displayTable(data) {
    console.log(data);
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
