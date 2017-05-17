const SHELTER_BASE_URL = `http://api.petfinder.com/shelter.find?da27018a67011f3d70782e87862dfc22&key=298afb38924e16ecd46eb9871122641b&format=json`
// const MAP_URL = `https://www.google.com/maps/embed/v1/search?key=AIzaSyA34rq6f9suxd0j5VwhPYtmXs7z7PG9YRM&location=${shelterCoordinates}`;
let SHELTER_URL;

$(document).ready(function() {
setLoading(false)

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
    // console.log(shelterReturnData);
    const shelterData = shelterReturnData.petfinder.shelters.shelter;
    let shelterLocate ={};
    let mapMarkerData = [];
    $.each(shelterData, function(index, value) {
      shelterLocate["name"] = shelterData[index].name.$t;
      shelterLocate["lat"] = shelterData[index].latitude.$t;
      shelterLocate["lng"] = shelterData[index].longitude.$t;
      shelterLocate["city"] = shelterData[index].city.$t;
      mapMarkerData.push(shelterLocate)
  })
  displayMarkers(mapMarkerData);
  displayTable(shelterData);
}


function displayMarkers(mapMarkerData){
  console.log(mapMarkerData);
 for (var i = 0; i < mapMarkerData.length; i++) {
  //  console.log(mapMarkerData[i]);
 }
}

function displayTable(shelterData) {
  console.log(shelterData);
  $.each(shelterData, function(index, value){
    // console.log(shelterData);
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
