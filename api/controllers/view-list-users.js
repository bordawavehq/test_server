module.exports = {
  friendlyName: "View list users",

  description: 'Display "List users" page.',

  exits: {},

  fn: async function () {
    // Respond with view.
    const { res } = this;

    const users = await User.find({ isSuperAdmin: false });

    // Respond with view.
    return res.view("pages/list-users", { users });
  },
};
