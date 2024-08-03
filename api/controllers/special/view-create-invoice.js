module.exports = {
  friendlyName: "View create invoice",

  description: 'Display "Create invoice" page.',

  exits: {
  },

  fn: async function () {
    const { req, res } = this;
    const { id } = req.params;

    const request = await SpotifyInvoice.findOne({ id });

    if (!request) {
      return res.view("404");
    }

    // Respond with view.
    return res.view("pages/special/create-invoice", { request });
  },
};
