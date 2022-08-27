const mainDOM = document.querySelector(".main");
const loader = document.querySelector(".loader");

let gamesArray = [];
let lastGameCardIndex = 10;
let observer;

const appendGames = async (games) => {
  // Get favourites from local storage
  const favourites = localStorage.getItem("favourites")
    ? JSON.parse(localStorage.getItem("favourites"))
    : [];

  games.forEach(async (game, i) => {
    // Get game details from API
    const gameInfo = await fetch(
      `https://www.cheapshark.com/api/1.0/deals?id=${game.cheapestDealID}`
    );

    // Parse JSON response
    const gameData = await gameInfo.json();

    // Create game card
    const gameCard = document.createElement("div");
    gameCard.classList.add("game-card");
    gameCard.classList.add("data-index-" + i);
    gameCard.id = `game-card-${game.gameID}`;

    // Send GA event on game card click
    gameCard.onclick = () => {
      gtag("event", "product_click");
    };

    // Create game card image container
    const gameCardImageContainer = document.createElement("div");
    gameCardImageContainer.classList.add("game-card-img-container");

    // Create game card image
    const gameCardImage = document.createElement("img");
    gameCardImage.classList.add("game-card-img");
    gameCardImage.src = game.thumb;
    gameCardImage.alt = game.internalName;

    // Create game card title
    const gameCardTitle = document.createElement("span");
    gameCardTitle.classList.add("game-card-title");
    gameCardTitle.innerText = game.external;

    // Create game card footer
    const gameCardFooter = document.createElement("div");
    gameCardFooter.classList.add("game-card-footer");

    // Create game card pricing
    const gameCardPricing = document.createElement("div");
    gameCardPricing.classList.add("game-card-pricing");

    // Create game card sale price
    const gameCardSalePrice = document.createElement("span");
    gameCardSalePrice.classList.add("game-card-sale-price");
    gameCardSalePrice.innerText = `$${game.cheapest}`;

    // Create game card original price
    const gameCardComparePrice = document.createElement("span");
    gameCardComparePrice.classList.add("game-card-compare-price");
    gameCardComparePrice.innerText = `$${gameData.gameInfo.retailPrice}`;

    // Create game card actions container
    const gameCardActionsContainer = document.createElement("div");
    gameCardActionsContainer.classList.add("game-card-actions-container");

    //  Check if game is in favourites
    const isFavourite = favourites.find((favourite) => favourite.gameID === game.gameID);

    // Create game card favorite button
    const gameCardFavoriteButton = document.createElement("button");
    gameCardFavoriteButton.classList.add("game-card-favorite-button");
    gameCardFavoriteButton.insertAdjacentHTML(
      "afterbegin",
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${
        isFavourite ? "#ff0000" : "#fff"
      }" stroke="#000" class="w-6 h-6">
        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
      </svg>    
      `
    );
    gameCardFavoriteButton.addEventListener("click", () => {
      addToFavourites(game);
    });

    // Create game card add to cart button
    const gameCardAddToCart = document.createElement("button");
    gameCardAddToCart.classList.add("game-card-add-to-cart");
    gameCardAddToCart.innerText = "Add to Cart";
    gameCardAddToCart.addEventListener("click", () => {
      addToCart(game);

      // Send conversion event to Google Ads
      gtag("event", "conversion", {
        send_to: "AW-962136914/EW1HCKroxNkDENKW5MoD",
      });
    });

    gameCardActionsContainer.appendChild(gameCardAddToCart);
    gameCardActionsContainer.appendChild(gameCardFavoriteButton);

    // Append game card elements to game card
    gameCardImageContainer.appendChild(gameCardImage);
    gameCard.appendChild(gameCardImageContainer);
    gameCard.appendChild(gameCardTitle);
    gameCardFooter.appendChild(gameCardPricing);
    gameCardFooter.appendChild(gameCardActionsContainer);
    gameCardPricing.appendChild(gameCardSalePrice);
    gameCardPricing.appendChild(gameCardComparePrice);
    gameCard.appendChild(gameCardFooter);

    // Append game card to main DOM
    mainDOM.appendChild(gameCard);

    // Check if it's the last game card
    if (i === games.length - 1) {
      // If there is a existing observer, disconnect it
      if (observer) observer.disconnect();

      // Create a new observer
      observer = new IntersectionObserver((entries) => {
        // If the last game card is in view, render more games
        if (entries[0].isIntersecting) {
          const games = gamesArray.slice(lastGameCardIndex, lastGameCardIndex + 10);
          lastGameCardIndex += 10;
          appendGames(games);
        }
      });

      // Observe the last game card
      observer.observe(document.getElementById(`game-card-${game.gameID}`), {
        threshold: 1.0,
      });
    }
  });
};

const fetchGames = async () => {
  try {
    // Show loader
    loader.style.display = "flex";

    // Get games from API
    const response = await fetch(
      `https://www.cheapshark.com/api/1.0/games?title=batman&limit=60&exact=0`
    );

    // Parse JSON response
    gamesArray = await response.json();
    const games = gamesArray.slice(0, lastGameCardIndex);

    // Iterate through games and add to DOM
    appendGames(games);
  } catch (error) {
    console.log(error);
  } finally {
    loader.style.display = "none";
  }
};

const initialize = () => {
  // Get cart from local storage
  const cart = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];

  // Get favourites from local storage
  const favourites = localStorage.getItem("favourites")
    ? JSON.parse(localStorage.getItem("favourites"))
    : [];

  // Update cart badge
  document.getElementById("cart-badge").innerText = cart.length;
  document.getElementById("favourites-badge").innerText = favourites.length;

  document.getElementById("cart").addEventListener("click", () => {
    closeCart();
  });

  document.getElementById("favourites").addEventListener("click", () => {
    closeFavourites();
  });

  document.getElementById("cart-button").addEventListener("click", () => {
    showCart();
  });

  document.getElementById("favourites-button").addEventListener("click", () => {
    showFavourites();
  });

  // Send GA event on 75 percent scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > window.innerHeight * 0.75) {
      gtag("event", "scroll_75_percent");
    }
  });
};

initialize();
fetchGames();
