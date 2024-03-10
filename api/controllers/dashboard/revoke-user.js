module.exports = {
  friendlyName: "Revoke user",

  description: "",

  inputs: {},

  exits: {},

  fn: async function (inputs) {
    const { req, res } = this;
    const { id } = req.params;

    if (!id) {
      return res.badRequest("No User Id was Provided");
    }

    const userRecord = await User.findOne({ id });

    if (!userRecord) {
      return res.notFound("User Not Found");
    }

    try {
      // Find current active sub record, license and revoke
      await Sub.updateOne({ owner: id, activeStatus: true }).set({
        activeStatus: false,
      });

      await User.updateOne({ id }).set({
        activeSubscription: false,
      });

      await License.updateOne({
        currentKeyUser: userRecord.emailAddress,
        keyStatus: "activated",
      }).set({
        keyStatus: "revoked",
      });

      return res.redirect(`/user/${id}`);
    } catch (error) {
      return res.serverError(error);
    }
  },
};
