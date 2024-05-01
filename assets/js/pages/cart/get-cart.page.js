parasails.registerPage("get-cart", {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    syncing: false,

    // Cart Items
    cartItems: [],
    totalItems: 0,
    discountPercentage: 0,
    totalPrice: 0,
    discountAvailable: false,
    discountAmount: 0,
    asyncErrorMsg: "",
    asyncSuccessMsg: "",

    formData: {},
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
    this.calculateTotalPrice();
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    retrieveCart: function () {
      const cart = window.localStorage.getItem("audiobaze_cart");
      if (!cart) {
        return [];
      }

      return JSON.parse(cart);
    },

    storeCartItems: function (items) {
      window.localStorage.setItem("audiobaze_cart", JSON.stringify(items));
      console.log("Successfully saved Audiobaze Cart");
      return true;
    },

    calculateTotalQuantity: function () {
      const totalQuantity = this.cartItems.reduce((accumulator, product) => {
        return accumulator + product.quantity;
      }, 0);

      this.totalItems = totalQuantity;
    },

    loadCartItems: function () {
      // Retrieve cart items from localStorage and update the cartItems state
      this.cartItems = this.retrieveCart();
    },

    saveCartItems: function () {
      const cartItems = JSON.parse(JSON.stringify(this.cartItems));
      this.storeCartItems(cartItems); // Save cart items to localStorage
    },

    increaseQuantity: function (productId) {
      const itemToUpdate = this.cartItems.find((item) => item.id === productId);

      if (itemToUpdate) {
        itemToUpdate.quantity++; // Increase quantity of the specified item
        this.saveCartItems(); // Save updated cart items to localStorage
      }
      this.calculateTotalPrice();
    },

    decreaseQuantity: function (productId) {
      const itemToUpdate = this.cartItems.find((item) => item.id === productId);

      if (itemToUpdate) {
        if (itemToUpdate.quantity == 1) {
          return;
        }
        itemToUpdate.quantity--; // Decrease quantity of the specified item
        this.saveCartItems(); // Save updated cart items to localStorage
      }
      this.calculateTotalPrice();
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

    calculateTotalPrice: function () {
      const currentCart = this.retrieveCart();
      const subTotal = currentCart.reduce((accumulator, product) => {
        return accumulator + product.quantity * product.price;
      }, 0);

      this.totalPrice = subTotal;
      return this.totalPrice;
    },

    validateCoupon: async function () {
      this.formData.price = this.totalPrice;
      this.syncing = true;
      // const submitCoupon = document.getElementById("submitCoupon");
      // const coupon = document.getElementById("coupon");

      // submitCoupon.addEventListener("submit", async (e) => {
      //   e.preventDefault();

      //   try {
      //     const response = await fetch(`/coupon/validate`, {
      //       method: "POST",
      //       body: JSON.stringify({
      //         coupon: coupon.value,
      //         price: this.totalPrice,
      //       }),
      //     });

      //     if (response.status === 200) {
      //       const data = await response.json();
      //       this.totalPrice = data.newPrice;
      //       this.discountAmount = data.discountAmount;
      //     }

      //     console.log(response);
      //   } catch (error) {
      //     console.error(error);
      //     if (error && !error.response) {
      //       this.asyncErrorMsg =
      //         "There's a Server Error 😥 Uhh I think we've got some cables mixed up back here... Try Again Later?";
      //     }

      //     if (error && error.response) {
      //       if (error.response.status === 500) {
      //         this.asyncErrorMsg =
      //           "There's a Server Error 😥 Uhh I think we've got some cables mixed up back here... Try Again Later?";
      //       }

      //       if (error.response.status === 404) {
      //         this.asyncErrorMsg =
      //           "Yeahhh... No! That's not a valid Coupon Code";
      //       }

      //       if (error.response.status === 400) {
      //         this.asyncErrorMsg =
      //           "Oof! Looks like that Coupon Code is maxed out 😥 Better luck next time";
      //       }
      //     }
      //   }
      // });
    },

    processCheckout: async function () {
      this.syncing = true;
      const cartItems = this.retrieveCart();

      if (cartItems.length === 0) {
        console.error("Can't Checkout Empty Cart");
        return;
      }

      const payload = {
        products: cartItems,
        totalPrice: this.totalPrice,
        discountAmount: this.discountAmount,
      };

      try {
        const response = await fetch("/order/buy/", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        if (response.status === 200) {
          this.asyncSuccessMsg = "Successful Purchase... Redirecting";
          const data = await response.json();
          window.location.href = `/order/transaction/${data['order'].id}`;
          setTimeout(() => {
            this.emptyCart();
          },2000)
        }
      } catch (error) {
        console.error(error);
        this.asyncErrorMsg = `There was a problem with that purchase... Please Try Again later...`;
      } finally {
        this.syncing = false;
      }
    },

    emptyCart: function () {
      this.cartItems = [];
      this.saveCartItems();
    },
  },
});
