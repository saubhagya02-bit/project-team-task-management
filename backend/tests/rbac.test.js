const request = require("supertest");
const app = require("../src/app");
const { User } = require("../src/models");
const { signAccessToken } = require("../src/utils/jwt");

describe("Role-based access control", () => {
  let adminToken, pmToken, memberToken, memberId, projectId, taskId;

  beforeAll(async () => {
    const admin = await User.create({
      name: "Admin",
      email: "admin@example.com",
      password: "Password123",
      role: "admin",
    });
    adminToken = signAccessToken({ id: admin.id, role: admin.role });
  });

  it("admin creates a project manager", async () => {
    const res = await request(app)
      .post("/api/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "PM One",
        email: "pm1@example.com",
        password: "Password123",
        role: "project_manager",
      });
    expect(res.status).toBe(201);

    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: "pm1@example.com", password: "Password123" });
    pmToken = login.body.data.accessToken;
  });

  it("team member self-registers", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Member One",
      email: "member1@example.com",
      password: "Password123",
    });
    memberId = res.body.data.user.id;
    memberToken = res.body.data.accessToken;
    expect(res.body.data.user.role).toBe("team_member");
  });

  it("team member cannot create a project", async () => {
    const res = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${memberToken}`)
      .send({ name: "Should Fail" });
    expect(res.status).toBe(403);
  });

  it("project manager creates a project", async () => {
    const res = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${pmToken}`)
      .send({ name: "Website Revamp", description: "Rebuild marketing site" });
    expect(res.status).toBe(201);
    projectId = res.body.data.id;
    expect(res.body.data.manager.email).toBe("pm1@example.com");
  });

  it("PM adds the team member to the project", async () => {
    const res = await request(app)
      .post(`/api/projects/${projectId}/members`)
      .set("Authorization", `Bearer ${pmToken}`)
      .send({ userId: memberId });
    expect(res.status).toBe(201);
  });

  it("PM creates a task assigned to the member", async () => {
    const res = await request(app)
      .post(`/api/projects/${projectId}/tasks`)
      .set("Authorization", `Bearer ${pmToken}`)
      .send({
        title: "Design homepage",
        assignedToId: memberId,
        priority: "high",
      });
    expect(res.status).toBe(201);
    taskId = res.body.data.id;
  });

  it("team member can update status of their own task", async () => {
    const res = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${memberToken}`)
      .send({ status: "in_progress" });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("in_progress");
  });

  it("team member cannot change task priority", async () => {
    const res = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${memberToken}`)
      .send({ priority: "low" });
    expect(res.status).toBe(403);
  });

  it("a stranger team member cannot view the task", async () => {
    const outsider = await request(app).post("/api/auth/register").send({
      name: "Outsider",
      email: "outsider@example.com",
      password: "Password123",
    });
    const res = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${outsider.body.data.accessToken}`);
    expect(res.status).toBe(403);
  });

  it("rejects requests with no auth token", async () => {
    const res = await request(app).get("/api/projects");
    expect(res.status).toBe(401);
  });
});
