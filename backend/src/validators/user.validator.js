const { body, param } = require("express-validator");

const createUserRules = [
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
  body("role")
    .isIn(["admin", "project_manager", "team_member"])
    .withMessage("Role must be admin, project_manager, or team_member"),
];

const updateUserRules = [
  param("id").isUUID().withMessage("Invalid user id"),
  body("name").optional().trim().isLength({ min: 2, max: 100 }),
  body("role").optional().isIn(["admin", "project_manager", "team_member"]),
  body("isActive").optional().isBoolean(),
];

const idParamRule = [param("id").isUUID().withMessage("Invalid user id")];

module.exports = { createUserRules, updateUserRules, idParamRule };
