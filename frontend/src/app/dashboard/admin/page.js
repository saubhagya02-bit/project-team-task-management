"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../../../components/ProtectedRoute";
import Navbar from "../../../components/Navbar";
import Badge from "../../../components/Badge";
import ProjectCard from "../../../components/ProjectCard";
import api from "../../../lib/api";
import { getErrorMessage } from "../../../lib/format";

function CreateUserForm({ onCreated }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "team_member",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await api.post("/users", form);
      onCreated(res.data.data);
      setForm({ name: "", email: "", password: "", role: "team_member" });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-5 space-y-3">
      <h2 className="font-display font-semibold">Add a user</h2>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Name</label>
          <input
            required
            className="input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Role</label>
          <select
            className="input"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="team_member">Team Member</option>
            <option value="project_manager">Project Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <label className="label">Email</label>
          <input
            required
            type="email"
            className="input"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Temporary password</label>
          <input
            required
            minLength={6}
            type="password"
            className="input"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
      </div>
      <button type="submit" disabled={submitting} className="btn-primary">
        {submitting ? "Adding…" : "Add user"}
      </button>
    </form>
  );
}

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    setLoading(true);
    try {
      const [usersRes, projectsRes] = await Promise.all([
        api.get("/users"),
        api.get("/projects"),
      ]);
      setUsers(usersRes.data.data);
      setProjects(projectsRes.data.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const changeRole = async (id, role) => {
    const res = await api.patch(`/users/${id}`, { role });
    setUsers((prev) => prev.map((u) => (u.id === id ? res.data.data : u)));
  };

  const toggleActive = async (user) => {
    if (user.isActive) {
      const res = await api.delete(`/users/${user.id}`);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? res.data.data : u)),
      );
    } else {
      const res = await api.patch(`/users/${user.id}`, { isActive: true });
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? res.data.data : u)),
      );
    }
  };

  return (
    <ProtectedRoute allow={["admin"]}>
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-10 space-y-8">
        <div>
          <h1 className="font-display text-2xl font-semibold">
            User management
          </h1>
          <p className="text-sm text-muted mt-1">
            Create accounts, assign roles, and control system access.
          </p>
        </div>

        <CreateUserForm onCreated={(u) => setUsers((prev) => [u, ...prev])} />

        <div className="card overflow-hidden">
          {loading ? (
            <p className="p-6 text-sm text-muted">Loading users…</p>
          ) : error ? (
            <p className="p-6 text-sm text-red-600">{error}</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-canvas text-left text-xs uppercase text-muted">
                <tr>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="px-5 py-3 font-medium">{u.name}</td>
                    <td className="px-5 py-3 text-muted">{u.email}</td>
                    <td className="px-5 py-3">
                      <select
                        className="input py-1"
                        value={u.role}
                        onChange={(e) => changeRole(u.id, e.target.value)}
                      >
                        <option value="team_member">Team Member</option>
                        <option value="project_manager">Project Manager</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-5 py-3">
                      <Badge type="boolean" value={String(u.isActive)}>
                        {u.isActive ? "Active" : "Deactivated"}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => toggleActive(u)}
                        className={u.isActive ? "btn-danger" : "btn-secondary"}
                      >
                        {u.isActive ? "Deactivate" : "Reactivate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold mb-1">
            All projects
          </h2>
          <p className="text-sm text-muted mb-4">
            System-wide view across every project manager.
          </p>
          {projects.length === 0 ? (
            <p className="text-sm text-muted">No projects created yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
