const sequelize = require("../config/database");
const User = require("./user.model");
const Project = require("./project.model");
const ProjectMember = require("./projectMember.model");
const Task = require("./task.model");

// A Project Manager (User) manages many Projects
User.hasMany(Project, { foreignKey: "managerId", as: "managedProjects" });
Project.belongsTo(User, { foreignKey: "managerId", as: "manager" });

// Many-to-many
User.belongsToMany(Project, {
  through: ProjectMember,
  foreignKey: "userId",
  otherKey: "projectId",
  as: "projects",
});
Project.belongsToMany(User, {
  through: ProjectMember,
  foreignKey: "projectId",
  otherKey: "userId",
  as: "members",
});
ProjectMember.belongsTo(User, { foreignKey: "userId", as: "user" });
ProjectMember.belongsTo(Project, { foreignKey: "projectId", as: "project" });

// A Project has many Tasks
Project.hasMany(Task, { foreignKey: "projectId", as: "tasks" });
Task.belongsTo(Project, { foreignKey: "projectId", as: "project" });

// A Task is assigned to one User, and created by one User
User.hasMany(Task, { foreignKey: "assignedToId", as: "assignedTasks" });
Task.belongsTo(User, { foreignKey: "assignedToId", as: "assignee" });

User.hasMany(Task, { foreignKey: "createdById", as: "createdTasks" });
Task.belongsTo(User, { foreignKey: "createdById", as: "creator" });

module.exports = {
  sequelize,
  User,
  Project,
  ProjectMember,
  Task,
};
