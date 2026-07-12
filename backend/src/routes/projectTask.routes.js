const express = require("express");
const taskController = require("../controllers/task.controller");
const authenticate = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const {
  loadProject,
  requireProjectOwner,
  requireProjectAccess,
} = require("../middleware/projectAccess.middleware");
const {
  createTaskRules,
  projectIdParamRule,
} = require("../validators/task.validator");

const router = express.Router({ mergeParams: true });

router.use(authenticate);

router.get(
  "/",
  validate(projectIdParamRule),
  loadProject,
  requireProjectAccess,
  taskController.listTasksForProject,
);

router.post(
  "/",
  validate(createTaskRules),
  loadProject,
  requireProjectOwner,
  taskController.createTask,
);

module.exports = router;
