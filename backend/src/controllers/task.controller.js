const { Task, User, Project, ProjectMember } = require("../models");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/apiResponse");

const taskInclude = [
  { model: User, as: "assignee", attributes: ["id", "name", "email"] },
  { model: User, as: "creator", attributes: ["id", "name", "email"] },
];

// GET /api/projects/:projectId/tasks
const listTasksForProject = asyncHandler(async (req, res) => {
  const where = { projectId: req.project.id };
  if (req.query.status) where.status = req.query.status;
  if (req.query.assignedToId) where.assignedToId = req.query.assignedToId;

  const tasks = await Task.findAll({
    where,
    include: taskInclude,
    order: [["createdAt", "DESC"]],
  });
  return success(res, 200, "Tasks retrieved", tasks);
});

// GET /api/tasks/my
const myTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.findAll({
    where: { assignedToId: req.user.id },
    include: [
      ...taskInclude,
      { model: Project, as: "project", attributes: ["id", "name", "status"] },
    ],
    order: [["dueDate", "ASC"]],
  });
  return success(res, 200, "Your tasks retrieved", tasks);
});

// POST /api/projects/:projectId/tasks  (owning PM or admin)
const createTask = asyncHandler(async (req, res) => {
  const { title, description, priority, status, dueDate, assignedToId } =
    req.body;

  if (assignedToId) {
    const membership = await ProjectMember.findOne({
      where: { projectId: req.project.id, userId: assignedToId },
    });
    if (!membership) {
      throw new ApiError(400, "assignedToId must be a member of this project");
    }
  }

  const task = await Task.create({
    title,
    description,
    priority,
    status,
    dueDate,
    assignedToId: assignedToId || null,
    projectId: req.project.id,
    createdById: req.user.id,
  });

  const created = await Task.findByPk(task.id, { include: taskInclude });
  return success(res, 201, "Task created", created);
});

// GET /api/tasks/:id
const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findByPk(req.task.id, { include: taskInclude });
  return success(res, 200, "Task retrieved", task);
});

// PATCH /api/tasks/:id

const updateTask = asyncHandler(async (req, res) => {
  const task = req.task;
  const isManager =
    req.user.role === "admin" ||
    (req.user.role === "project_manager" &&
      req.project.managerId === req.user.id);

  if (!isManager) {
    const allowedKeys = Object.keys(req.body);
    const onlyStatus = allowedKeys.every((k) => k === "status");
    if (!onlyStatus) {
      throw new ApiError(
        403,
        "You can only update the status of your assigned tasks",
      );
    }
    if (req.body.status !== undefined) task.status = req.body.status;
  } else {
    const { title, description, priority, status, dueDate, assignedToId } =
      req.body;

    if (assignedToId !== undefined && assignedToId !== null) {
      const membership = await ProjectMember.findOne({
        where: { projectId: task.projectId, userId: assignedToId },
      });
      if (!membership)
        throw new ApiError(
          400,
          "assignedToId must be a member of this project",
        );
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (assignedToId !== undefined) task.assignedToId = assignedToId;
  }

  await task.save();
  const updated = await Task.findByPk(task.id, { include: taskInclude });
  return success(res, 200, "Task updated", updated);
});

// DELETE /api/tasks/:id  (owning PM or admin)
const deleteTask = asyncHandler(async (req, res) => {
  await req.task.destroy();
  return success(res, 200, "Task deleted");
});

module.exports = {
  listTasksForProject,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  myTasks,
};
