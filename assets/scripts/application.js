const API_URL = "https://api.petfinder.com/pet.find?da27018a67011f3d70782e87862dfc22&key=298afb38924e16ecd46eb9871122641b&format=json&count=48";

$(document).ready(function() {
  setLoading(false)
  setNavigation(false)
  $('select').material_select();
  // disable breed type if cat is selected
  $("#animal-type").change(disableBreedInput)

  function setLoading(isLoading) {
    if (isLoading) {
      $(".loading").show();
      $("#main-form").hide();
    } else {
      $(".loading").hide();
      $("#main-form").show();
    }
  }

  function setNavigation(justLandedOnHome) {
    if (justLandedOnHome) {
      $("#main-logo").hide();
      $("#top-navigation").show().fadeIn(1000);
    } else {
      $("#top-navigation").hide();
    }
  }

function centerResults(isLoaded) {
  if (isLoaded) {
    $("#main").addClass("vertical-center")
    $("#form-section").removeClass("vertical-center", "parent")
  }

}

  // Form Submit
  $("#animal-search-form").submit(function(event) {
    event.preventDefault();
    $("#available-animals").empty();
    $("#animal-search-submit").attr("disabled", "disabled");
    setLoading(true);
    const locationInput = $("#location").val();
    const breedInput = $("#breed").val();
    const animalInput = $("#animal-type").val();

    let QUERY_URL;

    if (animalInput == "cat" && locationInput != "undefined") {
      QUERY_URL = API_URL + `&animal=${animalInput}&location=${locationInput}&callback=?`
    } else if (animalInput != "undefined" && locationInput != "undefined" && breedInput != "undefined") {
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
        if (!petDataIndex.media.photos) {
          petPhoto = "assets/images/photo-unavailable.png" // placeholder image
        } else {
          petPhoto = petDataIndex.media.photos.photo[2].$t;
        }
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
        $("#available-animals").append(
          `<div class="col s12 m6 l4">
              <div class="card">
                <div class="card-image waves-effect waves-block waves-light">
                  <img class="activator img-cropper" src="${petPhoto}">
                </div>
                <div class="card-content">
                  <span class="card-title activator grey-text text-darken-4 truncate">${petName.substring(0,9)}<i class="material-icons right">more_vert</i></span>
                  <p><i class="material-icons tiny truncate">email</i> <a href="mailto:${contactEmail}">Contact Email</a></p>
                  <p><i class="material-icons tiny truncate">phone</i> ${contactPhone.substring(0,13)}</p>
                  <p><i class="material-icons tiny truncate">location_on</i> ${petLocation}</p>
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
      setLoading(false);
      setNavigation(true);
      centerResults(true)
    }).catch(function(err) {
      console.log("Error Receiving Data");
      $("#available-animals").append(`<p>Your search returned 0 results</p>`);
      $('#animal-search-submit').removeAttr("disabled");
      setLoading(false);
      setNavigation(true);
    }); //End Catch
  }); //End Form Submit

  const BREED_URL = "https://api.petfinder.com/breed.list?animal=dog&da27018a67011f3d70782e87862dfc22&key=298afb38924e16ecd46eb9871122641b&format=json&callback=?"

  function breedResults() {
    $.getJSON(BREED_URL)
      .then(displayDogBreeds)
  }
  // Fn to get list of available breeds to create an autocomplete form
  function displayDogBreeds(dogBreedData) {
    const breedData = dogBreedData.petfinder.breeds.breed
    let breedTypes = {};
    $.each(breedData, function(index, value) {
      breedTypes[breedData[index].$t] = null;
    });
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
