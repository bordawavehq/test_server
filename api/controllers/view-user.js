module.exports = {
  friendlyName: "View user",

  description: 'Display "User" page.',

  exits: {},

  fn: async function () {
    const { req, res } = this;
    const { id } = req.params;

    if (!id) {
      return res.badRequest();
    }

    const userRecord = await User.findOne({ id });

    if (!userRecord) {
      return res.notFound();
    }

    // Find Current Active Subscription
    const activeSubscription = await Sub.findOne({
      activeStatus: true,
    });

    return res.view("pages/user", { user: userRecord, activeSubscription });
  },
};
