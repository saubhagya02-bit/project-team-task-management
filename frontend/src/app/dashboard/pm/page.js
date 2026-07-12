"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../../../components/ProtectedRoute";
import Navbar from "../../../components/Navbar";
import ProjectCard from "../../../components/ProjectCard";
import api from "../../../lib/api";
import { getErrorMessage } from "../../../lib/format";

function CreateProjectForm({ onCreated }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = { ...form };
      if (!payload.startDate) delete payload.startDate;
      if (!payload.endDate) delete payload.endDate;
      const res = await api.post("/projects", payload);
      onCreated(res.data.data);
      setForm({ name: "", description: "", startDate: "", endDate: "" });
      setOpen(false);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="btn-primary">
        + New project
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card p-5 space-y-3">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div>
        <label className="label">Project name</label>
        <input
          required
          className="input"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>
      <div>
        <label className="label">Description</label>
        <textarea
          className="input"
          rows={2}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Start date</label>
          <input
            type="date"
            className="input"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          />
        </div>
        <div>
          <label className="label">End date</label>
          <input
            type="date"
            className="input"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? "Creating…" : "Create project"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function PmDashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/projects")
      .then((res) => setProjects(res.data.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ProtectedRoute allow={["project_manager"]}>
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-10 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold">
              Your projects
            </h1>
            <p className="text-sm text-muted mt-1">
              Create projects, assign team members, and track task progress.
            </p>
          </div>
        </div>

        <CreateProjectForm
          onCreated={(p) => setProjects((prev) => [p, ...prev])}
        />

        {loading ? (
          <p className="text-sm text-muted">Loading projects…</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : projects.length === 0 ? (
          <p className="text-sm text-muted">
            No projects yet. Create your first one above.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
}
