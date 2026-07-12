"use client";

import { useState } from "react";
import { getErrorMessage } from "../lib/format";

const defaultForm = (task) => ({
  title: task?.title || "",
  description: task?.description || "",
  priority: task?.priority || "medium",
  status: task?.status || "todo",
  dueDate: task?.dueDate || "",
  assignedToId: task?.assignedToId || task?.assignee?.id || "",
});

export default function TaskForm({ task, members, onSubmit, onCancel }) {
  const [form, setForm] = useState(defaultForm(task));
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = { ...form };
      if (!payload.dueDate) delete payload.dueDate;
      if (!payload.assignedToId) payload.assignedToId = null;
      await onSubmit(payload);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-5 space-y-3">
      <h2 className="font-display font-semibold">
        {task ? "Edit task" : "New task"}
      </h2>
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div>
        <label className="label">Title</label>
        <input
          required
          className="input"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
      </div>

      <div>
        <label className="label">Description</label>
        <textarea
          rows={2}
          className="input"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Priority</label>
          <select
            className="input"
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label className="label">Status</label>
          <select
            className="input"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="in_review">In Review</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div>
          <label className="label">Due date</label>
          <input
            type="date"
            className="input"
            value={form.dueDate?.slice(0, 10) || ""}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Assignee</label>
          <select
            className="input"
            value={form.assignedToId || ""}
            onChange={(e) => setForm({ ...form, assignedToId: e.target.value })}
          >
            <option value="">Unassigned</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-2">
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? "Saving…" : task ? "Save changes" : "Create task"}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}
