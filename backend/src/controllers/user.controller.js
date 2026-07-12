const { User } = require("../models");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/apiResponse");

const listUsers = asyncHandler(async (req, res) => {
  const where = {};
  if (req.query.role) where.role = req.query.role;

  const users = await User.findAll({ where, order: [["createdAt", "DESC"]] });
  return success(
    res,
    200,
    "Users retrieved",
    users.map((u) => u.toSafeObject()),
  );
});

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) throw new ApiError(404, "User not found");
  return success(res, 200, "User retrieved", user.toSafeObject());
});

// Admin only: create a user with any role
const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existing = await User.findOne({ where: { email } });
  if (existing)
    throw new ApiError(409, "An account with this email already exists");

  const user = await User.create({ name, email, password, role });
  return success(res, 201, "User created", user.toSafeObject());
});

// Admin only: update role / active status / name
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) throw new ApiError(404, "User not found");

  const { name, role, isActive, password } = req.body;
  if (name !== undefined) user.name = name;
  if (role !== undefined) user.role = role;
  if (isActive !== undefined) user.isActive = isActive;
  if (password) user.password = password;

  await user.save();
  return success(res, 200, "User updated", user.toSafeObject());
});

// Admin only
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) throw new ApiError(404, "User not found");

  if (user.id === req.user.id) {
    throw new ApiError(400, "You cannot deactivate your own account");
  }

  user.isActive = false;
  await user.save();
  return success(res, 200, "User deactivated", user.toSafeObject());
});

module.exports = { listUsers, getUser, createUser, updateUser, deleteUser };
