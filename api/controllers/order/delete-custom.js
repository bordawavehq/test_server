module.exports = {
  friendlyName: "Delete custom",

  description: "",

  inputs: {},

  exits: {},

  fn: async function (inputs) {
    const { req, res } = this;
    const { id } = req.params;

    if (!id) {
      return res.badRequest({
        message: "Failed to provide ID of custom order to delete",
      });
    }

    try {
      await Request.destroyOne({ id });

      return res.status(200).json({
        message: "Succesffully deleted custom record",
      });
    } catch (error) {
      sails.log.error(error);

      return res.status(500).json(error);
    }
  },
};
