"use client";

import Badge from "./Badge";
import { formatDate, STATUS_LABELS } from "../lib/format";

export default function TaskCard({
  task,
  canEditStatus,
  canManage,
  onStatusChange,
  onEdit,
  onDelete,
}) {
  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-medium text-sm leading-snug">{task.title}</h4>
        <Badge type="priority" value={task.priority} />
      </div>

      {task.description && (
        <p className="text-xs text-muted line-clamp-2">{task.description}</p>
      )}

      {task.project?.name && (
        <p className="text-xs text-muted">Project: {task.project.name}</p>
      )}

      <div className="flex items-center justify-between text-xs text-muted">
        <span>{task.assignee ? task.assignee.name : "Unassigned"}</span>
        <span>Due {formatDate(task.dueDate)}</span>
      </div>

      {canEditStatus ? (
        <select
          className="input py-1 text-xs"
          value={task.status}
          onChange={(e) => onStatusChange(task, e.target.value)}
        >
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      ) : (
        <Badge type="status" value={task.status}>
          {STATUS_LABELS[task.status]}
        </Badge>
      )}

      {canManage && (
        <div className="flex gap-2 pt-1 border-t border-line">
          <button
            onClick={() => onEdit(task)}
            className="text-xs text-accent font-medium hover:underline"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task)}
            className="text-xs text-red-600 font-medium hover:underline"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
