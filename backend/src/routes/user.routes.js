const express = require("express");
const userController = require("../controllers/user.controller");
const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/rbac.middleware");
const validate = require("../middleware/validate.middleware");
const {
  createUserRules,
  updateUserRules,
  idParamRule,
} = require("../validators/user.validator");

const router = express.Router();

router.use(authenticate);

router.get(
  "/",
  authorize("admin", "project_manager"),
  userController.listUsers,
);
router.get(
  "/:id",
  authorize("admin", "project_manager"),
  validate(idParamRule),
  userController.getUser,
);

router.post(
  "/",
  authorize("admin"),
  validate(createUserRules),
  userController.createUser,
);
router.patch(
  "/:id",
  authorize("admin"),
  validate(updateUserRules),
  userController.updateUser,
);
router.delete(
  "/:id",
  authorize("admin"),
  validate(idParamRule),
  userController.deleteUser,
);

module.exports = router;
