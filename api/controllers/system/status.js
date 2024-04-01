module.exports = {
  friendlyName: "Status",

  description: "Status system.",

  inputs: {},

  exits: {},

  fn: async function (inputs) {
    const { res } = this;

    return res.status(200).json({
      message: "Project is live and well",
    });
  },
};
