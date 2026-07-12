export function getErrorMessage(error) {
  const data = error?.response?.data;
  if (!data) return "Something went wrong. Please try again.";
  if (data.errors?.length) {
    return data.errors.map((e) => e.message).join(", ");
  }
  return data.message || "Something went wrong. Please try again.";
}

export function formatDate(dateString) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export const STATUS_LABELS = {
  todo: "To Do",
  in_progress: "In Progress",
  in_review: "In Review",
  done: "Done",
};

export const PROJECT_STATUS_LABELS = {
  planning: "Planning",
  active: "Active",
  on_hold: "On Hold",
  completed: "Completed",
};
