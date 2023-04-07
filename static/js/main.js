var games = [];
var filteredGames = games;
async function logJSONData() {
  const response = await fetch("http://127.0.0.1:5000/get_games/")
    .then((response) => response.json())
    .then((jsonData) => {
      // console.log(jsonData);
      games = jsonData["games"];
      filteredGames = games;
      filterGames();
    });
}

logJSONData();

var button = document.getElementById("filter-button");
currentInput = document.querySelectorAll("select");
currentInput.onclick = function () {
  var isChecked = false;
  for (var j = 0; j < input.length; j++) {
    if (input[j].checked) {
      isChecked = true;
      break;
    }
  }

  if (isChecked) {
    button.classList.add("btn--highlight");
  } else {
    button.classList.remove("btn--highlight");
  }
};

// var games = [/* array of game objects */];
var gamesContainer = document.getElementById("games");
var gameModal = document.getElementById("game-modal");
var gameDetailsContainer = document.getElementById("game-details");

// Function to populate the game cards
function populateGames(filteredGames) {
  gamesContainer.innerHTML = "";
  if (filteredGames.length !== 0) {
    for (var i = 0; i < filteredGames.length; i++) {
      var game = filteredGames[i];
      var gameCard = document.createElement("div");
      gameCard.classList.add("game-card");
      gameCard.innerHTML = `
      <img src="${game.image}" alt="${game.title}">
      <div class="details">
      <h3>${game.title}</h3>
      <p>$${game.price}</p>
      <div class="star-ratings" id="${game.title}">
        <span class="star"></span>
        <span class="star"></span>
        <span class="star"></span>
        <span class="star"></span>
        <span class="star"></span>
      </div>
      <button class="btn btn-primary" onclick="displayGameModal(${i})">View Details</button>
      </div>
    `;
      gamesContainer.appendChild(gameCard);
      displayRating(game.title, game.rating);
    }
  } else {
    var noGame = document.createElement("div");
    noGame.classList.add("no_game");
    noGame.innerHTML = "No games match the filters.";
    gamesContainer.appendChild(noGame);
  }
}

// Function to filter games by platform
function filterGames() {
  var platformSelect = document.getElementById("platform-select");
  var selectedPlatform = platformSelect.value;
  var genreSelect = document.getElementById("genre-select");
  var selectedGenre = genreSelect.value;

  if (selectedPlatform != "All") {
    filteredGames = filteredGames.filter((game) =>
      game.platforms?.includes(selectedPlatform)
    );
  }

  if (selectedGenre != "All") {
    filteredGames = filteredGames.filter((game) =>
      game.genre?.includes(selectedGenre)
    );
  }
  populateGames(filteredGames);
}

var priceFilterSelect = document.getElementById("price-filter");
var enterPriceContainer = document.getElementById("enter-price-container");
var priceFilterInput = document.getElementById("enter-price");

function filterByPrice(maxPrice) {
  filteredGames = filteredGames.filter(function (game) {
    return game.price <= maxPrice;
  });
  populateGames(filteredGames);
}

priceFilterSelect.addEventListener("change", function () {
  if (priceFilterSelect.value === "enter-price") {
    enterPriceContainer.classList.remove("hidden");
    filterByPrice(Number(priceFilterInput.value));
  } else {
    enterPriceContainer.classList.add("hidden");
    filterByPrice(Number(priceFilterSelect.value));
  }
});

priceFilterInput.addEventListener("change", function () {
  filterByPrice(Number(priceFilterInput.value));
});

// // Function to display the game modal with the selected game's information
function displayGameModal(gameIndex) {
  // Get the game modal and modal content elements
  var game = games[gameIndex];
  var modal = document.getElementById("game-modal");
  var modalContent = document.getElementById("game-modal-content");

  // Populate the modal content with the selected game's information
  modalContent.innerHTML = `
    <span id="game-modal-close">&times;</span>
    <img src="${game.image}" alt="${game.title}">
    <h2>${game.title}</h2>
    <p><strong>Developer:</strong> ${game.developer}</p>
    <p style="justify-content:space-between;display:flex;">
      <span><strong>Release Date:</strong> ${game.releaseDate}</span
      <span><strong class="star-ratings" id="${game.title}-details">
        Rating:
        <span class="star"></span>
        <span class="star"></span>
        <span class="star"></span>
        <span class="star"></span>
        <span class="star"></span>
      </strong>
      <span>
    </p>
    <p><strong>Genre:</strong> ${game.genre}</p>
    <p><strong>Price:</strong> $${game.price}</p>
    <p>${game.description}</p>
    <p><strong>Supported Platforms:</strong> ${game.platforms}</p>
  `;

  displayRating(game.title + "-details", game.rating);

  // Show the game modal
  modal.style.display = "block";

  // Add event listener to the close button to hide the modal
  var closeButton = document.getElementById("game-modal-close");
  closeButton.addEventListener("click", function () {
    modal.style.display = "none";
  });

  // Add event listener to the window to close the modal if the user clicks outside of it
  window.addEventListener("click", function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });
}

function addGameModal() {
  var modal = document.getElementById("addGameModal");
  var modalContent = document.getElementById("addGameModal-content");
  // Show the game modal
  modal.style.display = "block";

  // Add event listener to the close button to hide the modal
  var closeButton = document.getElementById("addGameModal-close");
  closeButton.addEventListener("click", function () {
    modal.style.display = "none";
  });

  // Add event listener to the window to close the modal if the user clicks outside of it
  window.addEventListener("click", function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });
}

// Example POST method implementation:
async function postData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

// Function to add a new game to the array and reload the page
function addNewGame() {
  // Get the form input values
  var title = document.getElementById("title").value;
  var developer = document.getElementById("developer").value;
  var releaseDate = document.getElementById("release-date").value;
  var description = document.getElementById("description").value;
  var price = document.getElementById("price").value;
  var genre = $("#genre").val();
  var rating = document.getElementById("rating").value;
  var platform = $("#platform").val();
  var image = document.getElementById("image-url").value;

  // Create a new game object
  var newGame = {
    title: title,
    developer: developer,
    releaseDate: releaseDate,
    description: description,
    price: price,
    genre: genre,
    rating: rating,
    platform: platform,
    image: image,
  };

  // Add the new game object to the array
  // games.push(newGame);
  postData("http://127.0.0.1:5000/add_game/", newGame).then((data) => {
    console.log(data); // JSON data parsed by `data.json()` call
    // Display a confirmation message
    alert(data);

    // Reload the page
    location.reload();
  });
}

function displayRating(gameTitle, rating) {
  var stars = document.getElementById(gameTitle).children;
  for (var i = 0; i < stars.length; i++) {
    if (i > rating) {
      stars[i].classList.add("filled");
    } else {
      stars[i].classList.remove("filled");
    }
  }
}

function clearFilter() {
  var platformSelect = document.getElementById("platform-select");
  platformSelect.value = "All";
  var genreSelect = document.getElementById("genre-select");
  genreSelect.value = "All";
  var priceFilterSelect = document.getElementById("price-filter");
  priceFilterSelect.value = "100000000";
  filterGames();
}
