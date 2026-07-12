import Link from "next/link";
import Badge from "./Badge";
import { formatDate, PROJECT_STATUS_LABELS } from "../lib/format";

export default function ProjectCard({ project }) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="card p-5 flex flex-col gap-3 hover:border-accent/50 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display font-semibold text-base">{project.name}</h3>
        <Badge type="status" value={project.status}>
          {PROJECT_STATUS_LABELS[project.status] || project.status}
        </Badge>
      </div>
      {project.description && (
        <p className="text-sm text-muted line-clamp-2">{project.description}</p>
      )}
      <div className="flex items-center justify-between text-xs text-muted mt-auto pt-2 border-t border-line">
        <span>Manager: {project.manager?.name || "—"}</span>
        <span>{project.members?.length || 0} member(s)</span>
      </div>
      {(project.startDate || project.endDate) && (
        <p className="text-xs text-muted">
          {formatDate(project.startDate)} → {formatDate(project.endDate)}
        </p>
      )}
    </Link>
  );
}
