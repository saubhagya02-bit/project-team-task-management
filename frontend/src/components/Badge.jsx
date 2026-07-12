const PALETTES = {
  role: {
    admin: "bg-ink text-white",
    project_manager: "bg-accent/10 text-accent",
    team_member: "bg-gray-100 text-gray-700",
  },
  status: {
    planning: "bg-gray-100 text-gray-700",
    active: "bg-accent/10 text-accent",
    on_hold: "bg-amber-100 text-amber-700",
    completed: "bg-green-100 text-green-700",
    todo: "bg-gray-100 text-gray-700",
    in_progress: "bg-accent/10 text-accent",
    in_review: "bg-amber-100 text-amber-700",
    done: "bg-green-100 text-green-700",
  },
  priority: {
    low: "bg-gray-100 text-gray-700",
    medium: "bg-amber-100 text-amber-700",
    high: "bg-red-100 text-red-700",
  },
  boolean: {
    true: "bg-green-100 text-green-700",
    false: "bg-gray-100 text-gray-500",
  },
};

export default function Badge({ type = "status", value, children }) {
  const palette = PALETTES[type]?.[value] || "bg-gray-100 text-gray-700";
  return (
    <span className={`badge ${palette}`}>
      {children ?? String(value).replace("_", " ")}
    </span>
  );
}
