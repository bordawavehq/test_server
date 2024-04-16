module.exports = {
  friendlyName: "Delete review",

  description: "",

  inputs: {},

  exits: {},

  fn: async function (inputs) {
    const { req, res } = this;

    const { id } = req.params;

    if (!id) {
      return res.badRequest({ message: "No Id Provided" });
    }

    try {
      await Review.destroyOne({ id });

      return res.status(200).json({
        message: "successfully deleted review",
      });
    } catch (error) {
      return res.serverError(error);
    }
  },
};
