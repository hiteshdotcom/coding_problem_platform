const User = require("../model/user");
const BigPromise = require("./bigPromise");
const CustomError = require("../utils/customeError");
const jwt = require("jsonwebtoken");
exports.isLoggedIn = BigPromise(async (req, res, next) => {
  const token = req.cookies.token || req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return next(new CustomError("Login first to access this page", 401, res));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decoded.id);
  next();
});
exports.customRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new CustomError("You are not allowed for this resource", 403, res)
      );
    }
    next();
  };
};
