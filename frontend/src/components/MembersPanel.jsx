"use client";

import { useEffect, useState } from "react";
import api from "../lib/api";
import { getErrorMessage } from "../lib/format";

export default function MembersPanel({ project, onChange }) {
  const [candidates, setCandidates] = useState([]);
  const [selected, setSelected] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api
      .get("/users", { params: { role: "team_member" } })
      .then((res) => setCandidates(res.data.data))
      .catch(() => {});
  }, []);

  const memberIds = new Set(project.members.map((m) => m.id));
  const available = candidates.filter((c) => !memberIds.has(c.id));

  const addMember = async (e) => {
    e.preventDefault();
    if (!selected) return;
    setBusy(true);
    setError("");
    try {
      const res = await api.post(`/projects/${project.id}/members`, {
        userId: selected,
      });
      onChange(res.data.data);
      setSelected("");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const removeMember = async (userId) => {
    setBusy(true);
    try {
      const res = await api.delete(`/projects/${project.id}/members/${userId}`);
      onChange(res.data.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card p-5 space-y-4">
      <h2 className="font-display font-semibold">Team members</h2>
      {error && <p className="text-sm text-red-600">{error}</p>}

      <ul className="space-y-2">
        {project.members.length === 0 && (
          <li className="text-sm text-muted">No members added yet.</li>
        )}
        {project.members.map((m) => (
          <li key={m.id} className="flex items-center justify-between text-sm">
            <span>
              {m.name} <span className="text-muted">({m.email})</span>
            </span>
            <button
              disabled={busy}
              onClick={() => removeMember(m.id)}
              className="text-xs text-red-600 font-medium hover:underline"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <form
        onSubmit={addMember}
        className="flex gap-2 pt-3 border-t border-line"
      >
        <select
          className="input"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          <option value="">Select a team member…</option>
          {available.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.email})
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={busy || !selected}
          className="btn-secondary whitespace-nowrap"
        >
          Add
        </button>
      </form>
    </div>
  );
}
