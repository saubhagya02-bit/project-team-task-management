const { Task, Project, ProjectMember } = require("../models");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const loadTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findByPk(req.params.id);
  if (!task) throw new ApiError(404, "Task not found");

  const project = await Project.findByPk(task.projectId);
  req.task = task;
  req.project = project;
  next();
});

const requireTaskAccess = asyncHandler(async (req, res, next) => {
  if (req.user.role === "admin") return next();
  if (
    req.user.role === "project_manager" &&
    req.project.managerId === req.user.id
  ) {
    return next();
  }
  if (req.task.assignedToId === req.user.id) return next();

  const membership = await ProjectMember.findOne({
    where: { projectId: req.project.id, userId: req.user.id },
  });
  if (!membership)
    throw new ApiError(403, "You do not have access to this task");
  return next();
});

const requireTaskManage = asyncHandler(async (req, res, next) => {
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

module.exports = { loadTask, requireTaskAccess, requireTaskManage };
