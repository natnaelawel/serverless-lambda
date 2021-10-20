const Jwt = require("jsonwebtoken");

const authorizeUser = (req, res, next) => {
  console.log(req.headers);
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const decoded = Jwt.decode(token);
  req.headers["x-amzn-oidc-data"] = decoded;
  req.user = decoded;
  next();
};

module.exports.authorizeUser = authorizeUser;
