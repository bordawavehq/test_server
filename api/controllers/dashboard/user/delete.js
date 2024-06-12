module.exports = {
  friendlyName: "Delete",

  description: "Delete user.",

  inputs: {},

  exits: {},

  fn: async function (inputs) {
    const { req, res } = this;
    const { id } = req.params;

    if (!id) {
      return res.badRequest({ message: "Did not provide user id to delete" });
    }

    const user = await User.findOne({ id });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User does not exist in records" });
    }

    try {
      await License.destroyOne({ currentKeyUser: user.emailAddress });
      await Sub.destroyOne({ owner: id });
      await User.destroyOne({ id });
      await Telegram.destroyOne({ owner: user.id });

      return res.status(200).redirect("/users");
    } catch (error) {
      sails.log.error(error);
      return res.serverError({ message: "Failed to delete user" });
    }
  },
};
