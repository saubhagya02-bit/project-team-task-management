const { Op } = require("sequelize");
const { Project, User, ProjectMember, Task } = require("../models");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/apiResponse");

const projectInclude = [
  { model: User, as: "manager", attributes: ["id", "name", "email"] },
  {
    model: User,
    as: "members",
    attributes: ["id", "name", "email"],
    through: { attributes: [] },
  },
];

// GET /api/projects
// Admin -> all projects. PM -> projects they manage. Team member -> projects they belong to.
const listProjects = asyncHandler(async (req, res) => {
  let projects;

  if (req.user.role === "admin") {
    projects = await Project.findAll({
      include: projectInclude,
      order: [["createdAt", "DESC"]],
    });
  } else if (req.user.role === "project_manager") {
    projects = await Project.findAll({
      where: { managerId: req.user.id },
      include: projectInclude,
      order: [["createdAt", "DESC"]],
    });
  } else {
    const memberships = await ProjectMember.findAll({
      where: { userId: req.user.id },
    });
    const projectIds = memberships.map((m) => m.projectId);
    projects = await Project.findAll({
      where: { id: { [Op.in]: projectIds } },
      include: projectInclude,
      order: [["createdAt", "DESC"]],
    });
  }

  return success(res, 200, "Projects retrieved", projects);
});

// GET /api/projects/:id
const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findByPk(req.project.id, {
    include: projectInclude,
  });
  return success(res, 200, "Project retrieved", project);
});

// POST /api/projects  (admin or project_manager)
const createProject = asyncHandler(async (req, res) => {
  const { name, description, status, startDate, endDate } = req.body;

  // Admins may create a project on behalf of a specific PM.
  let managerId = req.user.id;
  if (req.user.role === "admin" && req.body.managerId) {
    const manager = await User.findByPk(req.body.managerId);
    if (!manager || manager.role !== "project_manager") {
      throw new ApiError(400, "managerId must belong to a project_manager");
    }
    managerId = manager.id;
  }

  const project = await Project.create({
    name,
    description,
    status,
    startDate,
    endDate,
    managerId,
  });

  const created = await Project.findByPk(project.id, {
    include: projectInclude,
  });
  return success(res, 201, "Project created", created);
});

// PATCH /api/projects/:id  (admin or owning PM)
const updateProject = asyncHandler(async (req, res) => {
  const { name, description, status, startDate, endDate } = req.body;
  const project = req.project;

  if (name !== undefined) project.name = name;
  if (description !== undefined) project.description = description;
  if (status !== undefined) project.status = status;
  if (startDate !== undefined) project.startDate = startDate;
  if (endDate !== undefined) project.endDate = endDate;

  await project.save();
  const updated = await Project.findByPk(project.id, {
    include: projectInclude,
  });
  return success(res, 200, "Project updated", updated);
});

// DELETE /api/projects/:id  (admin or owning PM)
const deleteProject = asyncHandler(async (req, res) => {
  await Task.destroy({ where: { projectId: req.project.id } });
  await ProjectMember.destroy({ where: { projectId: req.project.id } });
  await req.project.destroy();
  return success(res, 200, "Project deleted");
});

// POST /api/projects/:id/members  { userId }  (admin or owning PM)
const addMember = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  const user = await User.findByPk(userId);
  if (!user) throw new ApiError(404, "User not found");
  if (user.role !== "team_member") {
    throw new ApiError(400, "Only team members can be added to a project");
  }

  const existing = await ProjectMember.findOne({
    where: { projectId: req.project.id, userId },
  });
  if (existing)
    throw new ApiError(409, "User is already a member of this project");

  await ProjectMember.create({ projectId: req.project.id, userId });

  const project = await Project.findByPk(req.project.id, {
    include: projectInclude,
  });
  return success(res, 201, "Member added", project);
});

// DELETE /api/projects/:id/members/:userId  (admin or owning PM)
const removeMember = asyncHandler(async (req, res) => {
  const membership = await ProjectMember.findOne({
    where: { projectId: req.project.id, userId: req.params.userId },
  });
  if (!membership)
    throw new ApiError(404, "This user is not a member of the project");

  await membership.destroy();
  const project = await Project.findByPk(req.project.id, {
    include: projectInclude,
  });
  return success(res, 200, "Member removed", project);
});

module.exports = {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
};
