module.exports = {
  friendlyName: "View get cart",

  description: 'Display "Get cart" page.',

  exits: {
    
  },

  fn: async function () {
    const { req, res } = this;


    // Respond with view.
    return res.view("pages/cart/get-cart");
  },
};
