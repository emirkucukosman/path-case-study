const addToCart = (game) => {
  // Get cart from local storage
  const cart = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];

  // Add game to cart
  cart.push(game);

  // Update cart badge
  document.getElementById("cart-badge").innerText = cart.length;

  // Save cart to local storage
  localStorage.setItem("cart", JSON.stringify(cart));
};

const removeFromCart = (game) => {
  // Get cart from local storage
  const cart = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];

  // Remove game from cart
  const newCart = cart.filter((item) => item.gameID !== game.gameID);

  // Update cart badge
  document.getElementById("cart-badge").innerText = newCart.length;

  // Reset cart's innerHTML
  document.getElementById("cart-content").innerHTML = "";

  // Save cart to local storage
  localStorage.setItem("cart", JSON.stringify(newCart));
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

    const cardItemTitleContainer = document.createElement("div");
    cardItemTitleContainer.classList.add("cart-item-title-container");

    const cartItemTitle = document.createElement("span");
    cartItemTitle.classList.add("cart-item-title");
    cartItemTitle.innerText = item.external;

    const cartItemRemoveButton = document.createElement("button");
    cartItemRemoveButton.classList.add("cart-item-remove-button");
    cartItemRemoveButton.innerText = "Remove";
    cartItemRemoveButton.addEventListener("click", (e) => {
      // Prevent cart modal from closing
      e.stopPropagation();

      // Remove game from cart
      removeFromCart(item);

      // Re-render cart
      showCart();
    });

    const cartItemPrice = document.createElement("span");
    cartItemPrice.classList.add("cart-item-price");
    cartItemPrice.innerText = `$${item.cheapest}`;

    cardItemTitleContainer.appendChild(cartItemTitle);
    cardItemTitleContainer.appendChild(cartItemRemoveButton);

    cartItemDetails.appendChild(cartItemImage);
    cartItemDetails.appendChild(cardItemTitleContainer);

    cartItem.appendChild(cartItemDetails);
    cartItem.appendChild(cartItemPrice);

    // Append cart to main DOM
    document.getElementById("cart-content").appendChild(cartItem);
  });

  if (cart.length === 0) {
    document.getElementById("cart-content").innerHTML = `<p>Your cart is empty</p>`;
  }

  // Show cart
  document.getElementById("cart").style.display = "flex";
};

const closeCart = () => {
  document.getElementById("cart").style.display = "none";
  document.getElementById("cart-content").innerHTML = "";
};
