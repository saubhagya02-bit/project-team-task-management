"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "../../../components/ProtectedRoute";
import Navbar from "../../../components/Navbar";
import Badge from "../../../components/Badge";
import TaskCard from "../../../components/TaskCard";
import TaskForm from "../../../components/TaskForm";
import MembersPanel from "../../../components/MembersPanel";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../lib/api";
import {
  getErrorMessage,
  PROJECT_STATUS_LABELS,
  STATUS_LABELS,
} from "../../../lib/format";

const COLUMNS = ["todo", "in_progress", "in_review", "done"];

function ProjectDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [projectRes, tasksRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/projects/${id}/tasks`),
      ]);
      setProject(projectRes.data.data);
      setTasks(tasksRes.data.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-6xl px-6 py-10 text-sm text-muted">
          Loading project…
        </main>
      </>
    );
  }

  if (error || !project) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-6xl px-6 py-10 text-sm text-red-600">
          {error || "Project not found"}
        </main>
      </>
    );
  }

  const isManager =
    user.role === "admin" ||
    (user.role === "project_manager" && project.manager?.id === user.id);

  const createTask = async (payload) => {
    const res = await api.post(`/projects/${id}/tasks`, payload);
    setTasks((prev) => [res.data.data, ...prev]);
    setShowTaskForm(false);
  };

  const updateTask = async (payload) => {
    const res = await api.patch(`/tasks/${editingTask.id}`, payload);
    setTasks((prev) =>
      prev.map((t) => (t.id === editingTask.id ? res.data.data : t)),
    );
    setEditingTask(null);
  };

  const handleStatusChange = async (task, status) => {
    const res = await api.patch(`/tasks/${task.id}`, { status });
    setTasks((prev) => prev.map((t) => (t.id === task.id ? res.data.data : t)));
  };

  const deleteTask = async (task) => {
    if (!confirm(`Delete task "${task.title}"?`)) return;
    await api.delete(`/tasks/${task.id}`);
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-10 space-y-8">
        <button
          onClick={() => router.back()}
          className="text-sm text-muted hover:text-ink"
        >
          ← Back
        </button>

        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-2xl font-semibold">
                {project.name}
              </h1>
              <Badge type="status" value={project.status}>
                {PROJECT_STATUS_LABELS[project.status]}
              </Badge>
            </div>
            {project.description && (
              <p className="text-sm text-muted mt-2 max-w-2xl">
                {project.description}
              </p>
            )}
            <p className="text-xs text-muted mt-2">
              Managed by {project.manager?.name}
            </p>
          </div>
          {isManager && (
            <button
              onClick={() => setShowTaskForm((s) => !s)}
              className="btn-primary whitespace-nowrap"
            >
              {showTaskForm ? "Close" : "+ New task"}
            </button>
          )}
        </div>

        {isManager && showTaskForm && (
          <TaskForm
            members={project.members}
            onSubmit={createTask}
            onCancel={() => setShowTaskForm(false)}
          />
        )}

        {isManager && editingTask && (
          <TaskForm
            task={editingTask}
            members={project.members}
            onSubmit={updateTask}
            onCancel={() => setEditingTask(null)}
          />
        )}

        {isManager && <MembersPanel project={project} onChange={setProject} />}

        <div>
          <h2 className="font-display font-semibold mb-4">Tasks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {COLUMNS.map((col) => (
              <div key={col} className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {STATUS_LABELS[col]} ·{" "}
                  {tasks.filter((t) => t.status === col).length}
                </p>
                <div className="space-y-3">
                  {tasks
                    .filter((t) => t.status === col)
                    .map((t) => (
                      <TaskCard
                        key={t.id}
                        task={t}
                        canEditStatus={isManager || t.assignedToId === user.id}
                        canManage={isManager}
                        onStatusChange={handleStatusChange}
                        onEdit={setEditingTask}
                        onDelete={deleteTask}
                      />
                    ))}
                  {tasks.filter((t) => t.status === col).length === 0 && (
                    <p className="text-xs text-muted italic">No tasks</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

export default function ProjectDetailPage() {
  return (
    <ProtectedRoute allow={["admin", "project_manager", "team_member"]}>
      <ProjectDetail />
    </ProtectedRoute>
  );
}
