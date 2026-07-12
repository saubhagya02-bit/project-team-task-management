const express = require("express");
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const projectRoutes = require("./project.routes");
const taskRoutes = require("./task.routes");
const projectTaskRoutes = require("./projectTask.routes");

const router = express.Router();

router.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/projects/:projectId/tasks", projectTaskRoutes);
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);

module.exports = router;
