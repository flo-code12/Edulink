import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  AlertCircle,
  TrendingUp,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { adminUsers, adminCourses, announcements } from "../../data/staffMock";

type OverviewView =
  | "active-users"
  | "pending-users"
  | "active-courses"
  | "system-uptime";

export function AdminOverview() {
  const [selectedView, setSelectedView] =
    useState<OverviewView>("active-users");
  const navigate = useNavigate();

  const activeUsers = adminUsers.filter((u) => u.status === "Active");
  const pendingUsers = adminUsers.filter((u) => u.status === "Pending");
  const publishedCourses = adminCourses.filter((c) => c.status === "Published");

  const stats = [
    {
      key: "active-users" as const,
      label: "Active Users",
      value: activeUsers.length,
      icon: <Users className="w-5 h-5" />,
      color: "blue",
    },
    {
      key: "pending-users" as const,
      label: "Pending Users",
      value: pendingUsers.length,
      icon: <AlertCircle className="w-5 h-5" />,
      color: "orange",
    },
    {
      key: "active-courses" as const,
      label: "Active Courses",
      value: publishedCourses.length,
      icon: <BookOpen className="w-5 h-5" />,
      color: "green",
    },
    {
      key: "system-uptime" as const,
      label: "System Uptime",
      value: "99.9%",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "blue",
    },
  ];

  const selectedSummary =
    stats.find((stat) => stat.key === selectedView) ?? stats[0];

  return (
    <div className="space-y-8 animate-fade-in-up">
      <PageHeader
        title="University Overview"
        subtitle="System status and key metrics"
        action={
          <button
            type="button"
            onClick={() => navigate("/admin/analytics")}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <Settings className="w-4 h-4" /> System Settings
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const isActive = selectedView === stat.key;

          return (
            <motion.button
              key={stat.label}
              type="button"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedView(stat.key)}
              className={`flex items-center justify-between rounded-2xl border p-5 text-left shadow-card transition-colors ${
                isActive
                  ? "border-brand-blue bg-brand-blue/10 text-brand-blue dark:border-brand-blue/60"
                  : "border-gray-100 bg-white text-gray-900 hover:bg-gray-50 dark:border-gray-700/50 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700/50"
              }`}
            >
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.label}
                </p>
                <p className="mt-1 text-2xl font-bold">{stat.value}</p>
              </div>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full bg-brand-${stat.color}/10 text-brand-${stat.color}`}
              >
                {stat.icon}
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card dark:border-gray-700/50 dark:bg-gray-800">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {selectedSummary.label}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {selectedView === "active-users" &&
                "All currently active staff and student accounts."}
              {selectedView === "pending-users" &&
                "Users waiting for admin approval."}
              {selectedView === "active-courses" &&
                "Courses currently published and available to learners."}
              {selectedView === "system-uptime" &&
                "Current platform availability and health."}
            </p>
          </div>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
            {selectedSummary.value}
          </span>
        </div>

        {selectedView === "active-users" && (
          <div className="space-y-3">
            {activeUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-700/50 dark:bg-gray-700/30"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                    {user.initials}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user.role} · {user.email}
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-brand-green/10 px-2.5 py-1 text-xs font-medium text-brand-green">
                  Active
                </span>
              </div>
            ))}
          </div>
        )}

        {selectedView === "pending-users" && (
          <div className="space-y-3">
            {pendingUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-700/50 dark:bg-gray-700/30"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                    {user.initials}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/admin/users")}
                  className="rounded-lg border border-brand-orange/30 bg-brand-orange/10 px-3 py-1.5 text-sm font-medium text-brand-orange transition-colors hover:bg-brand-orange/20"
                >
                  Review
                </button>
              </div>
            ))}
          </div>
        )}

        {selectedView === "active-courses" && (
          <div className="space-y-3">
            {publishedCourses.map((course) => (
              <div
                key={course.id}
                className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-700/50 dark:bg-gray-700/30"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {course.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {course.code} · {course.lecturer}
                  </p>
                </div>
                <span className="rounded-full bg-brand-green/10 px-2.5 py-1 text-xs font-medium text-brand-green">
                  Published
                </span>
              </div>
            ))}
          </div>
        )}

        {selectedView === "system-uptime" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700/50 dark:bg-gray-700/30">
              <div className="mb-3 flex items-center gap-2 text-brand-green">
                <ShieldCheck className="w-5 h-5" />
                <p className="font-semibold text-gray-900 dark:text-white">
                  Availability
                </p>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                99.9%
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Last 30 days
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700/50 dark:bg-gray-700/30">
              <p className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                Status
              </p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>• Core services are healthy</li>
                <li>• Monitoring alerts are active</li>
                <li>• No critical incidents today</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card dark:border-gray-700/50 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Recent Announcements
          </h2>
          <div className="space-y-4">
            {announcements.slice(0, 3).map((a) => (
              <div
                key={a.id}
                className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700/50 dark:bg-gray-700/30"
              >
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {a.title}
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {a.date}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {a.body}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="rounded-md bg-brand-blue/10 px-2 py-1 text-xs font-medium text-brand-blue">
                    {a.audience}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    by {a.author}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card dark:border-gray-700/50 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => navigate("/admin/users")}
              className="flex w-full items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700/50 dark:bg-gray-700/30 dark:text-gray-200 dark:hover:bg-gray-700/50"
            >
              <span>Review pending users</span>
              <span className="text-brand-orange">{pendingUsers.length}</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/courses")}
              className="flex w-full items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700/50 dark:bg-gray-700/30 dark:text-gray-200 dark:hover:bg-gray-700/50"
            >
              <span>Open published courses</span>
              <span className="text-brand-green">
                {publishedCourses.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/analytics")}
              className="flex w-full items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700/50 dark:bg-gray-700/30 dark:text-gray-200 dark:hover:bg-gray-700/50"
            >
              <span>Monitor system health</span>
              <span className="text-brand-blue">99.9%</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
