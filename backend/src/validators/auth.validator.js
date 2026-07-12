const { body } = require("express-validator");

const registerRules = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be 2-100 characters"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("A valid email is required")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const loginRules = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("A valid email is required")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

const refreshRules = [
  body("refreshToken").notEmpty().withMessage("refreshToken is required"),
];

module.exports = { registerRules, loginRules, refreshRules };
