const jwt = require("jsonwebtoken");

module.exports = {
  friendlyName: "Login",

  description: "Login auth.",

  inputs: {
    emailAddress: {
      type: "string",
      required: true,
      unique: true,
      isEmail: true,
      maxLength: 200,
      example: "mary.sue@example.com",
    },
    password: {
      type: "string",
      description:
        "Securely hashed representation of the user's login password.",
      protect: true,
      example: "2$28a8eabna301089103-13948134nad",
    },
  },

  exits: {
    success: {
      statusCode: 200,
      description: "The requesting user agent has been successfully logged in",
    },
    badCombo: {
      description:
        "The provided email and password combination does not match any user in the database.",
      responseType: "unauthorized",
    },
  },

  fn: async function ({ emailAddress, password }) {
    const { req, res } = this;
    const userRecord = await User.findOne({
      emailAddress: emailAddress.toLowerCase(),
    });

    if (!userRecord) {
      throw "badCombo";
    }

    await sails.helpers.passwords
      .checkPassword(password, userRecord.password)
      .intercept("incorrect", "badCombo");

    try {
      const now = new Date();

      await User.updateOne({ id: userRecord.id }).set({ lastSeenAt: now });

      return res.status(200).json({
        message: "Successfully logged in user",
        token: jwt.sign(
          {
            user: userRecord.id,
          },
          sails.config.custom.secret,
          {
            expiresIn: "30d",
          }
        ),
      });
    } catch (error) {
      return res.serverError({
        message: "Failed to login user, Updating last seen failed...",
      });
    }
  },
};
