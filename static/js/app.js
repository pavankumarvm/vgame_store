function convertFormToJSON(form) {
  const array = $(form).serializeArray(); // Encodes the set of form elements as an array of names and values.
  const json = {};
  $.each(array, function () {
    json[this.name] = this.value || "";
  });
  console.log(json);
  return JSON.stringify(json);
}

$("#add-home").submit(function (event) {
  event.preventDefault();
  $.ajax({
    url: "/api/homes/",
    type: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: convertFormToJSON("#add-home"),
    success: function (response) {
      alert(response.message);
      location.href = "/home";
    },
    error: function (error) {
      alert(error.responseText);
    },
  });
});

// Update a home
$("#update-home").submit(function (event) {
  event.preventDefault();
  const homeID = $("#update-home input[name=homeID]").val();
  console.log(homeID);
  $.ajax({
    url: `/api/homes/${homeID}/`,
    type: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data: convertFormToJSON("#update-home"),
    success: function (response) {
      alert(response["message"]);
    },
    error: function (error) {
      alert(error);
    },
  });
});

const fillHomeList = (homes) => {
  $.each(homes, function (i, home) {
    var $homeDiv = $("<div>").addClass("box");
    $homeDiv.html(
      `
          <div class="top home" id="home-${home.id}">
            <img
              src="${home.image_url}"
              alt=""
            />
            <span>
              <i class="fas fa-heart"></i>
              <a href="/update_home/${home.id}/"><i class="fas fa-edit"></i></a>
            </span>
          </div>
          <div class="bottom">
            <h3>Home In ${home.address}</h3>
            <p>${home.description.substring(0, 75)}...
            </p>
            <div class="advants">
              <div>
                <span>Bedrooms</span>
                <div>
                  <i class="fas fa-th-large"></i>
                  <span>${home.num_beds}</span>
                </div>
              </div>
              <div>
                <span>Bathrooms</span>
                <div>
                  <i class="fas fa-shower"></i>
                  <span>${home.num_baths}</span>
                </div>
              </div>
              <div>
                <span>Area</span>
                <div>
                  <i class="fas fa-vector-square"></i>
                  <span>
                    ${home.sq_footage}<span>Sq Ft</span>
                  </span>
                </div>
              </div>
            </div>
            <div class="price">
              <span>${home.availability} at</span>
              <span>$${home.price}</span>
            </div>
        </div>
        `
    );
    $("#home-list").append($homeDiv);
    $homeDiv.click(() => {
      $.ajax({
        url: "/api/homes/" + home.id + "/",
        type: "GET",
        success: function (response) {
          // Display homes in a table or list
          displayHomeModal(home);
        },
        error: function (error) {
          alert(error.responseText);
        },
      });
    });
  });
};

// Get homes by category
$("#get-homes-category").submit(function (event) {
  event.preventDefault();
  const category = $("#get-homes-category select[name=category]").val();
  $.ajax({
    url: `/api/homes/category/${category}/`,
    type: "GET",
    success: function (response) {
      // Clear the home list
      $("#home-list").empty();
      if (response.status == 200) {
        $("#filter-text").show();
        homes = response.homes;
        // Loop through the list of homes and create HTML elements for each one
        fillHomeList(homes);
      } else {
        var $noHomeDiv = $("<div>").addClass("no-home");
        $noHomeDiv.html(response.message);
        $("#home-list").append($noHomeDiv);
      }
    },
    error: function (error) {
      // alert(error);
      console.log(error);
    },
  });
});

// Search for homes
$("#search-homes").submit(function (event) {
  event.preventDefault();
  const maxPrice = $("#search-homes input[name=maxPrice]").val();
  const squareFootage = $("#search-homes input[name=squareFootage]").val();
  const numBeds = $("#search-homes input[name=numBeds]").val();
  const numBaths = $("#search-homes input[name=numBaths]").val();
  $.ajax({
    url: `/api/homes/search?maxPrice=${maxPrice}&squareFootage=${squareFootage}&numBeds=${numBeds}&numBaths=${numBaths}`,
    type: "GET",
    success: function (response) {
      $("#home-list").empty();
      $("#filter-text").show();
      if (response.status == 200) {
        homes = response.homes;
        // Loop through the list of homes and create HTML elements for each one
        fillHomeList(homes);
      } else {
        var $noHomeDiv = $("<div>").addClass("no-home");
        $noHomeDiv.html(response.message);
        $("#home-list").append($noHomeDiv);
      }
    },
    error: function (error) {
      alert(error.responseText);
    },
  });
});

// Get homes for agent
$("#get-agent-homes").click(function () {
  $.ajax({
    url: "/api/homes/agent",
    type: "GET",
    success: function (response) {
      // Display homes in a table or list
    },
    error: function (error) {
      alert(error.responseText);
    },
  });
});

// // Function to display the home modal with the selected home's information
function displayHomeModal(home) {
  // Get the home modal and modal content elements
  var modal = document.getElementById("home-modal");
  var modalContent = document.getElementById("home-modal-content");

  // Populate the modal content with the selected home's information
  modalContent.innerHTML = `
    <span id="home-modal-close">&times;</span>
    <img src="${home.image_url}" alt="${home.address}">
    <h2>House at ${home.address} 
    <button type="button" class="btn button4" id="deleteHome-${home.id}"> Delete Home </button></h2>
    <hr/>
    <p>${home.description}</p>
    <p><strong>Category: ${home.category}</strong></p>
    <p><strong>Home Owner: ${home.owner}</strong></p>
    <div class="advants">
      <div>
        <span>Bedrooms</span>
        <div>
          <i class="fas fa-th-large"></i>
          <span>${home.num_beds}</span>
        </div>
      </div>
      <div>
        <span>Bathrooms</span>
        <div>
          <i class="fas fa-shower"></i>
          <span>${home.num_baths}</span>
        </div>
      </div>
      <div>
        <span>Area</span>
        <div>
          <i class="fas fa-vector-square"></i>
          <span>
            ${home.sq_footage}<span>Sq Ft</span>
          </span>
        </div>
      </div>
    </div>
    <div class="price">
      <span>${home.availability} at</span>
      <span>$${home.price}</span>
    </div>
    <h3>Change Availablity Status to: 
    <button type="button" class="btn button1 changeStatus-${home.id}">Available</button>
    <button type="button" class="btn button2 changeStatus-${home.id}">Sold</button>
    <button type="button" class="btn button3 changeStatus-${home.id}">Off the Market</button>
    </h3>
  `;
  // Show the home modal
  modal.style.display = "block";

  // Add event listener to the close button to hide the modal
  var closeButton = document.getElementById("home-modal-close");
  closeButton.addEventListener("click", function () {
    modal.style.display = "none";
  });

  // Add event listener to the window to close the modal if the user clicks outside of it
  window.addEventListener("click", function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });

  // Delete a home
  $("#deleteHome-" + home.id).click(() => {
    $.ajax({
      url: `/api/homes/${home.id}/`,
      type: "DELETE",
      success: function (response) {
        alert(response["message"]);
      },
      error: function (error) {
        alert(error.responseText);
      },
    });
  });

  // Change home availability
  $(".changeStatus-" + home.id).click(function (event) {
    $.ajax({
      url: `/api/homes/${home.id}/`,
      type: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        availability: $(this).html(),
      }),
      success: function (response) {
        alert(response["message"] + "\nAvailability updated.");
      },
      error: function (error) {
        alert(error.responseText);
      },
    });
  });
}

$("#add-owner").submit((event) => {
  $.ajax({
    url: `/api/homeowner/`,
    type: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: convertFormToJSON("#add-owner"),
    success: function (response) {
      alert(response["message"]);
      window.location.reload();
    },
    error: function (error) {
      alert(error.responseText);
    },
  });
});

$.ajax({
  url: "/api/homes/",
  type: "GET",
  success: function (response) {
    // Display homes in a table or list
    // Clear the home list
    $("#home-list").empty();
    $("#filter-text").hide();
    if (response.status == 200) {
      homes = response.homes;
      // Loop through the list of homes and create HTML elements for each one
      fillHomeList(homes);
    } else {
      var $noHomeDiv = $("<div>").addClass("no-home");
      $noHomeDiv.html(response.message);
      $("#home-list").append($noHomeDiv);
    }
  },
  error: function (error) {
    alert(error.responseText);
  },
});
