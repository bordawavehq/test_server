module.exports = {
  friendlyName: "Delete product",

  description: "",

  inputs: {},

  exits: {},

  fn: async function (inputs) {
    const { req, res } = this;
    const { id } = req.params;

    if (!id) {
      return res.badRequest();
    }

    try {
      await Product.destroyOne({ id });

      return res.redirect("/store");
    } catch (error) {
      return res.serverError(error);
    }
  },
};
