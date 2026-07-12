const express = require("express");
const projectController = require("../controllers/project.controller");
const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/rbac.middleware");
const validate = require("../middleware/validate.middleware");
const {
  loadProject,
  requireProjectOwner,
  requireProjectAccess,
} = require("../middleware/projectAccess.middleware");
const {
  createProjectRules,
  updateProjectRules,
  idParamRule,
  addMemberRules,
  removeMemberRules,
} = require("../validators/project.validator");

const router = express.Router();

router.use(authenticate);

router.get("/", projectController.listProjects);

router.post(
  "/",
  authorize("admin", "project_manager"),
  validate(createProjectRules),
  projectController.createProject,
);

router.get(
  "/:id",
  validate(idParamRule),
  loadProject,
  requireProjectAccess,
  projectController.getProject,
);

router.patch(
  "/:id",
  validate(updateProjectRules),
  loadProject,
  requireProjectOwner,
  projectController.updateProject,
);

router.delete(
  "/:id",
  validate(idParamRule),
  loadProject,
  requireProjectOwner,
  projectController.deleteProject,
);

router.post(
  "/:id/members",
  validate(addMemberRules),
  loadProject,
  requireProjectOwner,
  projectController.addMember,
);

router.delete(
  "/:id/members/:userId",
  validate(removeMemberRules),
  loadProject,
  requireProjectOwner,
  projectController.removeMember,
);

module.exports = router;
