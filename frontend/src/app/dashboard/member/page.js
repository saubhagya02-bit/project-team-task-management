"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../../../components/ProtectedRoute";
import Navbar from "../../../components/Navbar";
import TaskCard from "../../../components/TaskCard";
import api from "../../../lib/api";
import { getErrorMessage, STATUS_LABELS } from "../../../lib/format";

export default function MemberDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get("/tasks/my");
      setTasks(res.data.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleStatusChange = async (task, status) => {
    const res = await api.patch(`/tasks/${task.id}`, { status });
    setTasks((prev) => prev.map((t) => (t.id === task.id ? res.data.data : t)));
  };

  return (
    <ProtectedRoute allow={["team_member"]}>
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-10 space-y-6">
        <div>
          <h1 className="font-display text-2xl font-semibold">Your tasks</h1>
          <p className="text-sm text-muted mt-1">
            Update the status of tasks assigned to you as you make progress.
          </p>
        </div>

        {loading ? (
          <p className="text-sm text-muted">Loading tasks…</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : tasks.length === 0 ? (
          <p className="text-sm text-muted">
            No tasks assigned yet. Ask your project manager to add you to a
            project.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((t) => (
              <TaskCard
                key={t.id}
                task={t}
                canEditStatus
                canManage={false}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}

        <div className="text-xs text-muted">
          Status options: {Object.values(STATUS_LABELS).join(" · ")}
        </div>
      </main>
    </ProtectedRoute>
  );
}
