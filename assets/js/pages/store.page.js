function storeCartItems(items) {
  window.localStorage.setItem("audiobaze_cart", JSON.stringify(items));
  console.log("Successfully saved Audiobaze Cart");
  return true;
}

function retrieveCart() {
  const cart = window.localStorage.getItem("audiobaze_cart");
  if (!cart) {
    return [];
  }

  return JSON.parse(cart);
}

parasails.registerPage("store", {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    // Main syncing/loading state for this page.
    syncing: false,
    formData: {
      productId: "",
      review: "",
    },

    // For tracking client-side validation errors in our form.
    // > Has property set to `true` for each invalid property in `formData`.
    formErrors: {
      /* … */
    },

    // Success state when form has been submitted
    cloudSuccess: false,
    // Form Rules
    formRules: {},
    // Server error state for the form
    cloudError: "",
    // Cart Items
    cartItems: [],
    totalItems: 0,
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function () {
    //…
  },
  mounted: async function () {
    this.loadCartItems();
    this.calculateTotalQuantity();
  },

  methods: {
    setProductIdOnBuy: function (productId) {
      this.formData.productId = productId;
    },

    deleteReview: async function (id) {
      try {
        const response = await fetch(`/review/${id}`, {
          method: "DELETE",
        });

        if (response.status === 200) {
          window.location.reload();
        }
      } catch (error) {
        console.error(error);
        alert("Failed to delete review...");
      }
    },

    submittedForm: async function () {
      this.syncing = true;
      window.location.reload();
    },

    loadCartItems: function () {
      // Retrieve cart items from localStorage and update the cartItems state
      this.cartItems = retrieveCart();
    },

    addToCart: function (product) {
      const parsedProduct = JSON.parse(product);

      const existingItemIndex = this.cartItems.findIndex(
        (item) => item.id === parsedProduct.id
      );

      if (existingItemIndex !== -1) {
        // If the product already exists in the cart, update its quantity
        this.cartItems[existingItemIndex].quantity++;
      } else {
        // If the product is not in the cart, add it
        this.cartItems.push({ ...parsedProduct, quantity: 1 });
      }

      this.calculateTotalQuantity(); // Recalculate total quantity
      this.saveCartItems(); // Save updated cart items to localStorage
    },

    removeFromCart: function (productId) {
      const indexToRemove = this.cartItems.findIndex(
        (item) => item.id === productId
      );

      if (indexToRemove !== -1) {
        this.cartItems.splice(indexToRemove, 1); // Remove item from cartItems array
        this.saveCartItems(); // Save updated cart items to localStorage
      } else {
        console.error("Item does not exist in cart");
      }
    },

    increaseQuantity: function (productId) {
      const itemToUpdate = this.cartItems.find((item) => item.id === productId);

      if (itemToUpdate) {
        itemToUpdate.quantity++; // Increase quantity of the specified item
        this.saveCartItems(); // Save updated cart items to localStorage
      }
    },

    decreaseQuantity: function (productId) {
      const itemToUpdate = this.cartItems.find((item) => item.id === productId);

      if (itemToUpdate) {
        itemToUpdate.quantity--; // Decrease quantity of the specified item
        this.saveCartItems(); // Save updated cart items to localStorage
      }
    },

    totalPrice: function () {
      const totalPrice = this.cartItems.reduce((accumulator, product) => {
        return accumulator + product.quantity * product.price;
      });

      return totalPrice;
    },

    calculateTotalQuantity: function () {
      const totalQuantity = this.cartItems.reduce((accumulator, product) => {
        return accumulator + product.quantity;
      }, 0);

      this.totalItems = totalQuantity;
    },

    saveCartItems: function () {
      const cartItems = JSON.parse(JSON.stringify(this.cartItems));
      storeCartItems(cartItems); // Save cart items to localStorage
    },

    checkoutCart: function () {
      const failedButton = document.getElementById("failedBtn");
      const successBtn = document.getElementById("successBtn");
      const collectedCart = retrieveCart();
      console.log(collectedCart.length);
      if (collectedCart.length === 0) {
        console.log("Empty Cart Here");
        failedButton.click();
        return;
      }
      successBtn.click();

      setTimeout(() => {
        window.location.href = "/cart/checkout";
      }, 3000);
    },

    emptyCart: function () {
      window.localStorage.removeItem("audiobaze_cart");
      this.cartItems = [];
    },
  },
});
