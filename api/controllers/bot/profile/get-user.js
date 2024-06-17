module.exports = {
  friendlyName: "Get user",

  description: "",

  inputs: {},

  exits: {},

  fn: async function (inputs) {
    const { req, res } = this;

    const { user: id } = req;

    try {
      const userRecord = await User.findOne({ id });

      const newRecord = _.omit(userRecord, "password");

      // Current Active Subscription
      const subscriptionRecord = await Sub.findOne({
        owner: id,
        activeStatus: true,
      });

      const record = subscriptionRecord || null;

      return res
        .status(200)
        .json({ ...newRecord, currentSubscription: record });
    } catch (error) {
      return res.serverError({
        message: "Failed to retrieve user data",
      });
    }
  },
};
