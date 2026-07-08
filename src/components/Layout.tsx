import { Navigate, Outlet } from "react-router-dom";
import { TopNav, type NavItem } from "./TopNav";
import { EduAI } from "./EduAI";
import { useAuth, ROLE_HOME, type Role } from "./AuthProvider";
export const NAV_CONFIG: Record<Role, NavItem[]> = {
  student: [
    {
      name: "Dashboard",
      path: "/",
    },
    {
      name: "Courses",
      path: "/courses",
    },
    {
      name: "Assignments",
      path: "/assignments",
    },
    {
      name: "Calendar",
      path: "/calendar",
    },
    {
      name: "Grades",
      path: "/grades",
    },
    {
      name: "Messages",
      path: "/messages",
    },
  ],

  lecturer: [
    {
      name: "Dashboard",
      path: "/lecturer",
    },
    {
      name: "My Courses",
      path: "/lecturer/courses",
    },
    {
      name: "Grading",
      path: "/lecturer/grading",
    },
    {
      name: "Students",
      path: "/lecturer/students",
    },
    {
      name: "Messages",
      path: "/lecturer/messages",
    },
  ],

  admin: [
    {
      name: "Overview",
      path: "/admin",
    },
    {
      name: "Users",
      path: "/admin/users",
    },
    {
      name: "Courses",
      path: "/admin/courses",
    },
    {
      name: "Announcements",
      path: "/admin/announcements",
    },
    {
      name: "Analytics",
      path: "/admin/analytics",
    },
  ],
};
export function RoleLayout({ role }: { role: Role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={ROLE_HOME[user.role]} replace />;
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B1120] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
      <TopNav navItems={NAV_CONFIG[role]} homePath={ROLE_HOME[role]} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      {role === "student" && <EduAI />}
    </div>
  );
}
