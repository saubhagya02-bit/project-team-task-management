const request = require("supertest");
const app = require("../src/app");

describe("Auth", () => {
  const user = {
    name: "Test User",
    email: "testuser@example.com",
    password: "Password123",
  };

  it("registers a new team member", async () => {
    const res = await request(app).post("/api/auth/register").send(user);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.role).toBe("team_member");
    expect(res.body.data.accessToken).toBeDefined();
  });

  it("rejects duplicate registration", async () => {
    const res = await request(app).post("/api/auth/register").send(user);
    expect(res.status).toBe(409);
  });

  it("logs in with correct credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: user.email, password: user.password });
    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
  });

  it("rejects login with wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: user.email, password: "wrongpass" });
    expect(res.status).toBe(401);
  });

  it("rejects malformed registration payload", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "a", email: "not-an-email", password: "123" });
    expect(res.status).toBe(422);
  });
});
