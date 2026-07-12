const { verifyAccessToken } = require("../utils/jwt");
const { User } = require("../models");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Authentication token missing");
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (err) {
    throw new ApiError(401, "Invalid or expired token");
  }

  const user = await User.findByPk(decoded.id);
  if (!user || !user.isActive) {
    throw new ApiError(401, "User no longer exists or is deactivated");
  }

  req.user = user;
  next();
});

module.exports = authenticate;
