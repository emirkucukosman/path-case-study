const mainDOM = document.querySelector(".main");
const loader = document.querySelector(".loader");

let gamesArray = [];
let lastGameCardIndex = 10;
let observer;

const appendGames = async (games) => {
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

    // Create game card add to cart button
    const gameCardAddToCart = document.createElement("button");
    gameCardAddToCart.classList.add("game-card-add-to-cart");
    gameCardAddToCart.innerText = "Add to Cart";
    gameCardAddToCart.addEventListener("click", () => {
      addToCart(game);
    });

    // Append game card elements to game card
    gameCardImageContainer.appendChild(gameCardImage);
    gameCard.appendChild(gameCardImageContainer);
    gameCard.appendChild(gameCardTitle);
    gameCardFooter.appendChild(gameCardPricing);
    gameCardFooter.appendChild(gameCardAddToCart);
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

const addToCart = (game) => {
  // save to local storage
  const cart = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];

  // Add game to cart
  cart.push(game);

  // Update cart badge
  document.getElementById("cart-badge").innerText = cart.length;

  // Save cart to local storage
  localStorage.setItem("cart", JSON.stringify(cart));
};

const showCart = () => {
  // Get cart from local storage
  const cart = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];

  cart.forEach((item) => {
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");

    const cartItemDetails = document.createElement("div");
    cartItemDetails.classList.add("cart-item-details");

    const cartItemImage = document.createElement("img");
    cartItemImage.classList.add("cart-item-img");
    cartItemImage.src = item.thumb;
    cartItemImage.alt = item.internalName;

    const cartItemTitle = document.createElement("span");
    cartItemTitle.classList.add("cart-item-title");
    cartItemTitle.innerText = item.external;

    const cartItemPrice = document.createElement("span");
    cartItemPrice.classList.add("cart-item-price");
    cartItemPrice.innerText = `$${item.cheapest}`;

    cartItemDetails.appendChild(cartItemImage);
    cartItemDetails.appendChild(cartItemTitle);

    cartItem.appendChild(cartItemDetails);
    cartItem.appendChild(cartItemPrice);

    // Append cart to main DOM
    document.getElementById("cart-content").appendChild(cartItem);
  });

  if (cart.length === 0) {
    document.getElementById("cart-content").innerHTML = `<p>Your cart is empty</p>`;
  }

  // Create cart container
  document.getElementById("cart").style.display = "flex";
};

const closeCart = () => {
  document.getElementById("cart").style.display = "none";
  document.getElementById("cart-content").innerHTML = "";
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

  // Update cart badge
  document.getElementById("cart-badge").innerText = cart.length;

  document.getElementById("cart").addEventListener("click", () => {
    closeCart();
  });

  document.getElementById("cart-button").addEventListener("click", () => {
    showCart();
  });
};

initialize();
// fetchGames();
