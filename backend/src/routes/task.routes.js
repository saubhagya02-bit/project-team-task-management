const express = require("express");
const taskController = require("../controllers/task.controller");
const authenticate = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const {
  loadTask,
  requireTaskAccess,
  requireTaskManage,
} = require("../middleware/taskAccess.middleware");
const {
  updateTaskRules,
  idParamRule,
} = require("../validators/task.validator");

const router = express.Router();

router.use(authenticate);

router.get("/my", taskController.myTasks);

router.get(
  "/:id",
  validate(idParamRule),
  loadTask,
  requireTaskAccess,
  taskController.getTask,
);

router.patch(
  "/:id",
  validate(updateTaskRules),
  loadTask,
  requireTaskAccess,
  taskController.updateTask,
);

router.delete(
  "/:id",
  validate(idParamRule),
  loadTask,
  requireTaskManage,
  taskController.deleteTask,
);

module.exports = router;
