const jwt = require("jsonwebtoken");

module.exports = async function (req, res, proceed) {
  if (req.header("authorization")) {
    const token = req.header("authorization").split("Bearer ")[1];

    if (!token) {
      return res.status(401).json({
        error: "Unathorized",
        message: "No Token Provided",
      });
    }

    return jwt.verify(
      token,
      sails.config.custom.secret,
      async (err, payload) => {
        if (err) {
          return res.status(401).json({
            error: "Unauthorized",
            message: "Invalid/Expired Token",
          });
        }

        if (!payload.user) {
          return res.status(401).json({
            error: "Unauthorized",
            message: "No user ID present in token",
          });
        }

        const userRecord = await User.findOne({
          id: payload.user,
        });

        if (!userRecord) {
          return res.status(401).json({
            error: "Resource Not Found",
            message: "User does not exist in Database",
          });
        }

        req.user = userRecord.id;
        return proceed();
      }
    );
  }

  return res.status(401).json({
    status: "Unauthorized",
    message: "Unauthorized Access from client side",
  });
};
