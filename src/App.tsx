import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider, useAuth, ROLE_HOME } from "./components/AuthProvider";
import { RoleLayout } from "./components/Layout";
import { Login } from "./pages/Login";
// Student
import { Dashboard } from "./pages/Dashboard";
import { Courses } from "./pages/Courses";
import { Assignments } from "./pages/Assignments";
import { Calendar } from "./pages/Calendar";
import { Grades } from "./pages/Grades";
import { Messages } from "./pages/Messages";
// Lecturer
import { LecturerDashboard } from "./pages/lecturer/LecturerDashboard";
import { LecturerCourses } from "./pages/lecturer/LecturerCourses";
import { LecturerGrading } from "./pages/lecturer/LecturerGrading";
import { LecturerStudents } from "./pages/lecturer/LecturerStudents";
// Admin
import { AdminOverview } from "./pages/admin/AdminOverview";
import { AdminUsers } from "./pages/admin/AdminUsers";
import { AdminCourses } from "./pages/admin/AdminCourses";
import { AdminAnnouncements } from "./pages/admin/AdminAnnouncements";
import { AdminAnalytics } from "./pages/admin/AdminAnalytics";
function LoginRoute() {
  const { user } = useAuth();
  if (user) return <Navigate to={ROLE_HOME[user.role]} replace />;
  return <Login />;
}
export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginRoute />} />

            {/* Student portal */}
            <Route element={<RoleLayout role="student" />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/assignments" element={<Assignments />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/grades" element={<Grades />} />
              <Route path="/messages" element={<Messages />} />
            </Route>

            {/* Lecturer portal */}
            <Route element={<RoleLayout role="lecturer" />}>
              <Route path="/lecturer" element={<LecturerDashboard />} />
              <Route path="/lecturer/courses" element={<LecturerCourses />} />
              <Route path="/lecturer/grading" element={<LecturerGrading />} />
              <Route path="/lecturer/students" element={<LecturerStudents />} />
              <Route path="/lecturer/messages" element={<Messages />} />
            </Route>

            {/* Admin portal */}
            <Route element={<RoleLayout role="admin" />}>
              <Route path="/admin" element={<AdminOverview />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/courses" element={<AdminCourses />} />
              <Route
                path="/admin/announcements"
                element={<AdminAnnouncements />}
              />

              <Route path="/admin/analytics" element={<AdminAnalytics />} />
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
