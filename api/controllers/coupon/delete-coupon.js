module.exports = {
  friendlyName: "Delete coupon",

  description: "",

  inputs: {},

  exits: {},

  fn: async function () {
    const { req, res } = this;
    const { id } = req.params;

    if (!id) {
      return res.badRequest();
    }

    try {
      const coupon = await Coupon.findOne({ id });
      if (!coupon) {
        return res.notFound();
      }

      await Coupon.destroyOne({ id });

      return res.status(200).json({ message: "Successfully deleted coupon" });
    } catch (error) {
      sails.log.error(error);

      return res.serverError({
        message: "Failed to Delete Coupon",
      });
    }
  },
};
