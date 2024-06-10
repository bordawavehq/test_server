module.exports = {
  friendlyName: "View custom order",

  description: 'Display "Custom order" page.',

  exits: {
    
  },

  fn: async function () {
    const { req, res } = this;

    // Respond with view.
    return res.render("pages/custom-order");
  },
};
