"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";

const ROLE_LABELS = {
  admin: "Administrator",
  project_manager: "Project Manager",
  team_member: "Team Member",
};

export default function Navbar() {
  const { user, logout, roleHome } = useAuth();

  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link
          href={user ? roleHome[user.role] : "/login"}
          className="font-display font-semibold text-lg tracking-tight"
        >
          TaskFlow
        </Link>
        {user && (
          <div className="flex items-center gap-4">
            <div className="text-right leading-tight">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted">{ROLE_LABELS[user.role]}</p>
            </div>
            <button onClick={logout} className="btn-secondary">
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
