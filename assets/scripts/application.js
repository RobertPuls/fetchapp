const API_URL = "https://api.petfinder.com/pet.find?da27018a67011f3d70782e87862dfc22&key=298afb38924e16ecd46eb9871122641b&format=json&count=48";

$(document).ready(function() {
  $(".loading").hide();
  $('select').material_select();
  $("#animal-type").change(disableBreedInput)
  // Form Submit
  $("form").submit(function(event) {
    event.preventDefault();
    $(".available-animals").empty();
    $("#animal-search-submit").attr("disabled", "disabled");
    $(".loading").show();
    const locationInput = $("#location").val();
    const breedInput = $("#breed").val();
    const animalInput = $("#animal-type").val();
    let QUERY_URL;
    if (animalInput != "undefined" && locationInput != "undefined" && breedInput != "undefined") {
      QUERY_URL = API_URL + `&animal=${animalInput}&location=${locationInput}&breed=${breedInput}&callback=?`
    } else if (locationInput != "undefined" && !breedInput) {
      QUERY_URL = API_URL + `&animal=${animalInput}&location=${locationInput}&callback=?`
    }
    $.getJSON(QUERY_URL).then(function(data) {
      const petData = data.petfinder.pets.pet;
      // console.log(petData);
      $.each(petData, function(index, value) {
        const petDataIndex = petData[index];
        let petPhoto;
        // Not working
        if (!petDataIndex.media.photos) {
          petPhoto = "assets/images/photo-unavailable.png" // placeholder image
        } else {
          petPhoto = petDataIndex.media.photos.photo[2].$t;
        }
        // console.log(petPhoto);
        let petName = petDataIndex.name.$t
        const contactEmail = petDataIndex.contact.email.$t;
        let contactPhone;
        if (petDataIndex.contact.phone.$t == undefined) {
          contactPhone = "Not Available";
        } else {
          contactPhone = petDataIndex.contact.phone.$t;
        }
        const petLocation = `${petDataIndex.contact.city.$t}, ${petDataIndex.contact.state.$t}`
        let availableStatus;
        if (petDataIndex.status.$t == "A") {
          availableStatus = "Available"
        } else {
          availableStatus = "Not Available"
        }
        let petDescription
        if (petDataIndex.description.$t == undefined) {
          petDescription = "No Description Available"
        } else {
          petDescription = petDataIndex.description.$t;
        }
        // Append to HTML
        $(".available-animals").append(
          `<div class="col s12 m6 l3">
              <div class="card">
                <div class="card-image waves-effect waves-block waves-light">
                  <img class="activator img-cropper" src="${petPhoto}">
                </div>
                <div class="card-content">
                  <span class="card-title activator grey-text text-darken-4">${petName.substring(0,9)}<i class="material-icons right">more_vert</i></span>
                  <p><i class="material-icons tiny">email</i> <a href="mailto:${contactEmail}">Contact Email</a></p>
                  <p><i class="material-icons tiny">phone</i> ${contactPhone.substring(0,13)}</p>
                  <p><i class="material-icons tiny">location_on</i> ${petLocation}</p>
                  <p>Status: ${availableStatus}</p>
                </div>
                <div class="card-reveal">
                  <span class="card-title grey-text text-darken-4">${petName}<i class="material-icons right">close</i></span>
                  <p>${petDescription}</p>
                </div>
              </div>
            </div>
          </div>`
        ); //End append to HTML
      }); //End foreach loop
      $('#animal-search-submit').removeAttr("disabled");
      $(".loading").hide();
    }).catch(function(err) {
      console.log("Error Receiving Data");
      $(".available-animals").append(`<p>Your search returned 0 results</p>`);
    }); //End Catch
  }); //End Form Submit

  const BREED_URL = "http://api.petfinder.com/breed.list?animal=dog&da27018a67011f3d70782e87862dfc22&key=298afb38924e16ecd46eb9871122641b&format=json&callback=?"

  function breedResults() {
    $.getJSON(BREED_URL)
      .then(displayDogBreeds)
  }

  function displayDogBreeds(dogBreedData) {
    const breedData = dogBreedData.petfinder.breeds.breed
    let breedTypes = {};
    $.each(breedData, function(index, value) {
      breedTypes[breedData[index].$t] = null;
    });
    console.log(breedTypes);
    $('#breed').autocomplete({
        data: breedTypes,
        limit: 20,
        minLength: 1,
      });
    }; //End Fn displayDogBreeds
  breedResults();

  // Fn to disable breed input if cat is selected.
  function disableBreedInput() {
    const animalInput = this.value;
    if (animalInput == "cat") {
      $("#breed").attr("disabled", "disabled");
    } else if (animalInput == "dog") {
      $("#breed").removeAttr("disabled")
    }
  }; // End disableBreedInput Fn

}); //End document ready
