const express = require("express");
const authController = require("../controllers/auth.controller");
const authenticate = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const {
  registerRules,
  loginRules,
  refreshRules,
} = require("../validators/auth.validator");

const router = express.Router();

router.post("/register", validate(registerRules), authController.register);
router.post("/login", validate(loginRules), authController.login);
router.post("/refresh", validate(refreshRules), authController.refresh);
router.get("/me", authenticate, authController.me);

module.exports = router;
