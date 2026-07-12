const { body, param } = require("express-validator");

const createTaskRules = [
  param("projectId").isUUID(),
  body("title")
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage("Title must be 2-200 characters"),
  body("description").optional({ nullable: true }).isString(),
  body("priority").optional().isIn(["low", "medium", "high"]),
  body("status").optional().isIn(["todo", "in_progress", "in_review", "done"]),
  body("dueDate").optional({ nullable: true }).isISO8601(),
  body("assignedToId").optional({ nullable: true }).isUUID(),
];

const updateTaskRules = [
  param("id").isUUID(),
  body("title").optional().trim().isLength({ min: 2, max: 200 }),
  body("description").optional({ nullable: true }).isString(),
  body("priority").optional().isIn(["low", "medium", "high"]),
  body("status").optional().isIn(["todo", "in_progress", "in_review", "done"]),
  body("dueDate").optional({ nullable: true }).isISO8601(),
  body("assignedToId").optional({ nullable: true }).isUUID(),
];

const idParamRule = [param("id").isUUID().withMessage("Invalid task id")];
const projectIdParamRule = [
  param("projectId").isUUID().withMessage("Invalid project id"),
];

module.exports = {
  createTaskRules,
  updateTaskRules,
  idParamRule,
  projectIdParamRule,
};
