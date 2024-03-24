module.exports = {
  friendlyName: "Generate license",

  description: "",

  inputs: {},

  exits: {},

  fn: async function (inputs) {
    const { req, res } = this;
    const { number } = req.params;

    if (!number || number === 0) {
      return res.badRequest({
        message:
          "Invalid Request, Failed to specify number or number set to zero",
      });
    }

    function generateKey() {
      var key = "";
      var charset = "ABCDEFGHIJKLMONPQRSTUVWXYZ0123456789";

      for (var i = 0; i < 16; i++)
        key += charset.charAt(Math.floor(Math.random() * charset.length));
      return key;
    }

    try {
      for (let i = 0; i < number; i++) {
        await License.create({
          licenseKey: generateKey(),
        });
      }

      return res.redirect("/dashboard");
    } catch (error) {
      return res.serverError({ message: "Failed to generate license key(s)" });
    }
  },
};
