module.exports = {
  friendlyName: "View list keys",

  description: 'Display "List keys" page.',

  exits: {
  },

  fn: async function () {
    const { req, res } = this;

    const licenseKeys = await License.find({});

    // Respond with view.
    return res.view("pages/list-keys", { keys: licenseKeys });
  },
};
