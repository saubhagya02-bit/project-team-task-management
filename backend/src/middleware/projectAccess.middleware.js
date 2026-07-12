const { Project, ProjectMember } = require("../models");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const loadProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findByPk(req.params.id || req.params.projectId);
  if (!project) throw new ApiError(404, "Project not found");
  req.project = project;
  next();
});

const requireProjectOwner = asyncHandler(async (req, res, next) => {
  if (req.user.role === "admin") return next();
  if (
    req.user.role === "project_manager" &&
    req.project.managerId === req.user.id
  ) {
    return next();
  }
  throw new ApiError(
    403,
    "Only the assigned project manager or an admin can do this",
  );
});

const requireProjectAccess = asyncHandler(async (req, res, next) => {
  if (req.user.role === "admin") return next();
  if (
    req.user.role === "project_manager" &&
    req.project.managerId === req.user.id
  ) {
    return next();
  }
  const membership = await ProjectMember.findOne({
    where: { projectId: req.project.id, userId: req.user.id },
  });
  if (!membership) {
    throw new ApiError(403, "You do not have access to this project");
  }
  return next();
});

module.exports = { loadProject, requireProjectOwner, requireProjectAccess };
