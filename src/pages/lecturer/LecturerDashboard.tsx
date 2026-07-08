import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  Clock,
  ChevronRight,
  MessageSquare,
} from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { taughtCourses, submissions } from "../../data/staffMock";
import { addNotification } from "../../utils/notifications";

export function LecturerDashboard() {
  const navigate = useNavigate();
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [officeHoursOpen, setOfficeHoursOpen] = useState(false);
  const pendingGrading = submissions.filter((s) => s.status === "pending");
  const totalStudents = taughtCourses.reduce((sum, c) => sum + c.students, 0);
  const courseList = useMemo(() => taughtCourses, []);

  const handleOfficeHoursToggle = () => {
    const nextState = !officeHoursOpen;
    setOfficeHoursOpen(nextState);
    addNotification({
      title: nextState ? "Office hours started" : "Office hours paused",
      message: nextState
        ? "Students can now join your office hours queue."
        : "Office hours are currently paused for this session.",
      link: "/lecturer/dashboard",
    });
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <PageHeader
        title="Lecturer Dashboard"
        subtitle="Welcome back, Dr. Toure. Here's what's happening today."
        action={
          <button
            type="button"
            onClick={handleOfficeHoursToggle}
            className="px-4 py-2 bg-brand-blue text-white rounded-lg text-sm font-medium hover:bg-brand-blueDark transition-colors shadow-sm shadow-brand-blue/20"
          >
            {officeHoursOpen ? "Pause Office Hours" : "Start Office Hours"}
          </button>
        }
      />

      {officeHoursOpen ? (
        <div className="rounded-xl border border-brand-blue/20 bg-brand-blue/10 px-4 py-3 text-sm text-brand-blue">
          Office hours are active. Students can reach you from the messages
          panel.
        </div>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total Students",
            value: totalStudents,
            icon: <Users className="w-5 h-5" />,
            color: "blue",
            action: () => navigate("/lecturer/students"),
          },
          {
            label: "Active Courses",
            value: taughtCourses.length,
            icon: <BookOpen className="w-5 h-5" />,
            color: "green",
            action: () => navigate("/lecturer/courses"),
          },
          {
            label: "To Grade",
            value: pendingGrading.length,
            icon: <Clock className="w-5 h-5" />,
            color: "orange",
            action: () => navigate("/lecturer/grading"),
          },
        ].map((stat, i) => {
          const isClickable = Boolean(stat.action);
          return (
            <motion.div
              key={stat.label}
              initial={{
                opacity: 0,
                y: 16,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: i * 0.05,
              }}
              onClick={isClickable ? stat.action : undefined}
              className={`bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-card border border-gray-100 dark:border-gray-700/50 flex items-center justify-between ${isClickable ? "cursor-pointer hover:border-brand-blue/30 transition-all" : ""}`}
            >
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {stat.value}
                </p>
              </div>
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center bg-brand-${stat.color}/10 text-brand-${stat.color}`}
              >
                {stat.icon}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              My Courses
            </h2>
            <button
              type="button"
              onClick={() => setShowAllCourses(true)}
              className="text-sm font-medium text-brand-blue hover:text-brand-blueDark flex items-center"
            >
              View all <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {courseList.slice(0, 4).map((course, i) => (
              <motion.div
                key={course.id}
                initial={{
                  opacity: 0,
                  y: 16,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: i * 0.05,
                }}
                className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-card border border-gray-100 dark:border-gray-700/50 hover:border-brand-blue/30 transition-all group cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <div
                    className={`p-2 rounded-lg bg-brand-${course.color}/10 text-brand-${course.color}`}
                  >
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300">
                    {course.code}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-brand-blue transition-colors line-clamp-1">
                  {course.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {course.schedule}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700/50">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Students
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {course.students}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Avg Grade
                    </p>
                    <p className="font-medium text-brand-green">
                      {course.avgGrade}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      To Grade
                    </p>
                    <p className="font-medium text-brand-orange">
                      {course.ungraded}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Needs Grading
            </h2>
            <span className="bg-brand-orange/10 text-brand-orange text-xs font-bold px-2 py-1 rounded-full">
              {pendingGrading.length}
            </span>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-100 dark:border-gray-700/50 overflow-hidden">
            <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {pendingGrading.slice(0, 5).map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300 shrink-0">
                    {sub.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {sub.student}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {sub.assignment}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-medium text-gray-900 dark:text-white">
                      {sub.course}
                    </p>
                    <p className="text-[10px] text-brand-orange mt-0.5">
                      {sub.submitted}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/lecturer/messages?student=${encodeURIComponent(sub.student)}`,
                        )
                      }
                      className="mt-2 inline-flex items-center gap-1 rounded-full bg-brand-blue/10 px-2 py-1 text-[10px] font-semibold text-brand-blue hover:bg-brand-blue/20"
                    >
                      <MessageSquare className="h-3 w-3" /> Message
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-gray-100 dark:border-gray-700/50">
              <button
                type="button"
                onClick={() => navigate("/lecturer/grading")}
                className="w-full py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-blue dark:hover:text-brand-blue transition-colors"
              >
                Go to Grading
              </button>
            </div>
          </div>
        </div>
      </div>

      {showAllCourses ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  All my courses
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Browse every course you are currently teaching.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAllCourses(false)}
                className="text-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                ×
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              {courseList.map((course) => (
                <div
                  key={course.id}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/70"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {course.name}
                      </p>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {course.code} · {course.room}
                      </p>
                    </div>
                    <span className="rounded-full bg-brand-blue/10 px-2.5 py-1 text-[11px] font-semibold text-brand-blue">
                      {course.schedule}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                    <span>{course.students} students</span>
                    <span>{course.ungraded} to grade</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      ) : null}
    </div>
  );
}
