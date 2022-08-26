const addToFavourites = (game) => {
  // Get favourites from local storage
  const favourites = localStorage.getItem("favourites")
    ? JSON.parse(localStorage.getItem("favourites"))
    : [];

  // Check if game is already in favourites
  if (favourites.find((item) => item.gameID === game.gameID)) {
    // If game is already in favourites, remove it
    return removeFromFavourites(game);
  }

  // Add game to favourites
  favourites.push(game);
  document.querySelector(`#game-card-${game.gameID} .game-card-favorite-button svg`).style.fill =
    "#ff0000";

  // Update favourites badge
  document.getElementById("favourites-badge").innerText = favourites.length;

  // Update local storage
  localStorage.setItem("favourites", JSON.stringify(favourites));
};

const removeFromFavourites = (game) => {
  // Get favourites from local storage
  const favourites = localStorage.getItem("favourites")
    ? JSON.parse(localStorage.getItem("favourites"))
    : [];

  // Remove favourite from cart
  const newFavourites = favourites.filter((item) => item.gameID !== game.gameID);
  document.querySelector(`#game-card-${game.gameID} .game-card-favorite-button svg`).style.fill =
    "#fff";

  // Update favourites badge
  document.getElementById("favourites-badge").innerText = newFavourites.length;

  // Reset favourite's innerHTML
  document.getElementById("favourites-content").innerHTML = "";

  // Save favourites to local storage
  localStorage.setItem("favourites", JSON.stringify(newFavourites));
};

const showFavourites = () => {
  // Get cart from local storage
  const favourites = localStorage.getItem("favourites")
    ? JSON.parse(localStorage.getItem("favourites"))
    : [];

  favourites.forEach((item) => {
    const favouriteItem = document.createElement("div");
    favouriteItem.classList.add("favourite-item");

    const favouriteItemDetails = document.createElement("div");
    favouriteItemDetails.classList.add("favourite-item-details");

    const favouriteItemImage = document.createElement("img");
    favouriteItemImage.classList.add("favourite-item-img");
    favouriteItemImage.src = item.thumb;
    favouriteItemImage.alt = item.internalName;

    const favouriteItemTitleContainer = document.createElement("div");
    favouriteItemTitleContainer.classList.add("favourite-item-title-container");

    const favouriteItemTitle = document.createElement("span");
    favouriteItemTitle.classList.add("favourite-item-title");
    favouriteItemTitle.innerText = item.external;

    const favouriteItemRemoveButton = document.createElement("button");
    favouriteItemRemoveButton.classList.add("favourite-item-remove-button");
    favouriteItemRemoveButton.innerText = "Remove";
    favouriteItemRemoveButton.addEventListener("click", (e) => {
      // Prevent cart modal from closing
      e.stopPropagation();

      // Remove game from cart
      removeFromFavourites(item);

      // Re-render cart
      showFavourites();
    });

    const favouriteItemPrice = document.createElement("span");
    favouriteItemPrice.classList.add("favourite-item-price");
    favouriteItemPrice.innerText = `$${item.cheapest}`;

    favouriteItemTitleContainer.appendChild(favouriteItemTitle);
    favouriteItemTitleContainer.appendChild(favouriteItemRemoveButton);

    favouriteItemDetails.appendChild(favouriteItemImage);
    favouriteItemDetails.appendChild(favouriteItemTitleContainer);

    favouriteItem.appendChild(favouriteItemDetails);
    favouriteItem.appendChild(favouriteItemPrice);

    // Append cart to main DOM
    document.getElementById("favourites-content").appendChild(favouriteItem);
  });

  if (favourites.length === 0) {
    document.getElementById("favourites-content").innerHTML = `<p>Your favourites is empty</p>`;
  }

  // Show cart
  document.getElementById("favourites").style.display = "flex";
};

const closeFavourites = () => {
  document.getElementById("favourites").style.display = "none";
  document.getElementById("favourites-content").innerHTML = "";
};
