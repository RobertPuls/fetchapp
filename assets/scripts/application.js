$(document).ready(function() {
  $('select').material_select();
  $("form").submit(function(event) {
    event.preventDefault();
    $(".available-dogs").empty();
    let locationValue = $("[name*='location']").val();
    let breedValue = $("[name*='breed']").val();
    let animalValue = $("[name*='animal-type']").val();
    let API_URL = "http://api.petfinder.com/pet.find?da27018a67011f3d70782e87862dfc22&key=298afb38924e16ecd46eb9871122641b&format=json&count=20";
    let QUERY_URL;

    disableBreedInput();

    if (animalValue != "undefined" && locationValue != "undefined" && breedValue != "undefined") {
      QUERY_URL = API_URL + `&animal=${animalValue}&location=${locationValue}&breed=${breedValue}&callback=?`
    } else if (locationValue != "undefined" && breedValue == "undefined") {
      QUERY_URL  = API_URL + `&animal=${animalValue}&location=${locationValue}&callback=?`
    }
    $.getJSON(QUERY_URL).then(function(data) {
      // console.log(data);
      let petData = data.petfinder.pets;
      // console.log(petData)
      $.each(petData.pet, function(index, value){
        // console.log(petData.pet[index]);
        $(".available-dogs").append(
          `
            <div class="col s3">
              <div class="card">
                <div class="card-image waves-effect waves-block waves-light">
                  <img class="activator img-cropper" src=${petData.pet[index].media.photos.photo[2].$t}>
                </div>
                <div class="card-content">
                  <span class="card-title activator grey-text text-darken-4">${petData.pet[index].name.$t.substring(0,12)}<i class="material-icons right">more_vert</i></span>
                  <p><a href="${petData.pet[index].contact.email.$t}">Contact</a></p>
                </div>
                <div class="card-reveal">
                  <span class="card-title grey-text text-darken-4">${petData.pet[index].name.$t}<i class="material-icons right">close</i></span>
                  <p>${petData.pet[index].description.$t}</p>
                </div>
              </div>
            </div>
          </div>
          `
        );
      })
      // console.log(data.petfinder.pets.pet[0].name.$t);
    }).fail(function(err) {
      alert("Error Receiving Data");
    })
  })


  // Fn to disable breed input if cat is selected.
  function disableBreedInput(animalValue) {
    if (animalValue == "cat") {
      $("input#breed").attr("disabled", "disabled");
    };
  }; // End disableBreedInput Fn

});
