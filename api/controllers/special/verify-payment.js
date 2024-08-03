module.exports = {
  friendlyName: "Verify payment",

  description: "",

  inputs: {},

  exits: {},

  fn: async function (inputs) {
    const { req, res } = this;

    try {
      await SpotifyInvoice.updateOne({ id: req.params.id }).set({
        status: "paid",
      });

      return res
        .status(200)
        .json({ message: "Successfully updated payment status" });
    } catch (error) {
      sails.log.error(error);
      return res.status(500).json({
        message: "There was a problem",
      });
    }
  },
};
