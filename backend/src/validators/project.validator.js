const { body, param } = require("express-validator");

const createProjectRules = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage("Name must be 2-150 characters"),
  body("description").optional({ nullable: true }).isString(),
  body("status")
    .optional()
    .isIn(["planning", "active", "on_hold", "completed"]),
  body("startDate")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("startDate must be a valid date"),
  body("endDate")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("endDate must be a valid date"),
  body("managerId")
    .optional()
    .isUUID()
    .withMessage("managerId must be a valid id"),
];

const updateProjectRules = [
  param("id").isUUID(),
  body("name").optional().trim().isLength({ min: 2, max: 150 }),
  body("description").optional({ nullable: true }).isString(),
  body("status")
    .optional()
    .isIn(["planning", "active", "on_hold", "completed"]),
  body("startDate").optional({ nullable: true }).isISO8601(),
  body("endDate").optional({ nullable: true }).isISO8601(),
];

const idParamRule = [param("id").isUUID().withMessage("Invalid project id")];

const addMemberRules = [
  param("id").isUUID(),
  body("userId").isUUID().withMessage("A valid userId is required"),
];

const removeMemberRules = [param("id").isUUID(), param("userId").isUUID()];

module.exports = {
  createProjectRules,
  updateProjectRules,
  idParamRule,
  addMemberRules,
  removeMemberRules,
};
