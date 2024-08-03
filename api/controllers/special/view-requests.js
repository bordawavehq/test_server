module.exports = {
  friendlyName: "View requests",

  description: 'Display "Requests" page.',

  exits: {},

  fn: async function () {
    const { req, res } = this;
    const allUserData = await SpotifyInvoice.find({});
    const userData = allUserData.filter(
      (requests) => requests.user.id === req.me.id
    );

    // Respond with view.
    return res.view("pages/special/requests", {
      requests: req.me.isSuperAdmin ? allUserData : userData,
    });
  },
};
