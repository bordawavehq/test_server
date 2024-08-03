module.exports = {
  friendlyName: "View Dashboard page",

  description: 'Display the dashboard "Welcome" page.',

  exits: {
    success: {
      statusCode: 200,
      description: "Display the welcome page for authenticated users.",
    },
  },

  fn: async function () {
    const { req, res } = this;

    try {
      const [unactivated, totalNoOfUsers, activated, unactivatedUsers] =
        await Promise.all([
          License.find({ keyStatus: "unactivated" }),
          User.find({ isSuperAdmin: false }),
          License.find({ keyStatus: "activated" }),
          User.find({ isSuperAdmin: false, activeSubscription: false }),
        ]);

      // Current Active Subscription
      const subscriptionRecord = await Sub.findOne({
        owner: this.req.me.id,
        activeStatus: true,
      });

      const record = subscriptionRecord || null;

      // Look Up Chart Requests
      const requests = await SpotifyInvoice.find({});
      const userRequests = requests.filter(
        (request) => request.user.id === req.me.id
      );

      return res.view("pages/dashboard/welcome", {
        unactivated: unactivated.length,
        totalNoOfUsers: totalNoOfUsers.length,
        activated: activated.length,
        unactivatedUsers: unactivatedUsers.length,
        currentSubscription: record,
        noOfChartRequests: userRequests.length,
      });
    } catch (error) {
      sails.log.error(error);

      return res.serverError({ message: "Failed" });
    }
  },
};
