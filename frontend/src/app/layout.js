import "./globals.css";
import { AuthProvider } from "../context/AuthContext";

export const metadata = {
  title: "TaskFlow - Project & Team Task Management",
  description:
    "Manage projects, teams, and tasks with role-based access control.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
