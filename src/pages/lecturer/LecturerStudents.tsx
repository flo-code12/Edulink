import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Mail,
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
} from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { enrolledStudents } from "../../data/staffMock";
import { taughtCourses } from "../../data/staffMock";

export function LecturerStudents() {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const courseFilter = useMemo(
    () =>
      new URLSearchParams(location.search).get("course")?.toLowerCase() ?? "",
    [location.search],
  );
  const courseGroups = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return taughtCourses
      .map((course) => {
        const students = enrolledStudents.filter(
          (student) => student.course === course.code,
        );
        const filteredStudents = students.filter((student) => {
          const matchesCourse =
            !courseFilter ||
            course.code.toLowerCase() === courseFilter ||
            student.course.toLowerCase() === courseFilter;
          const matchesQuery =
            !normalizedQuery ||
            `${student.name} ${student.studentId} ${student.course} ${course.name} ${course.code}`
              .toLowerCase()
              .includes(normalizedQuery);
          return matchesCourse && matchesQuery;
        });

        return {
          ...course,
          students: filteredStudents,
        };
      })
      .filter((group) => group.students.length > 0);
  }, [query, courseFilter]);

  const statusColor = (status: string) => {
    if (status === "Excelling") return "text-brand-green bg-brand-green/10";
    if (status === "At risk") return "text-red-500 bg-red-500/10";
    return "text-brand-blue bg-brand-blue/10";
  };
  const statusIcon = (status: string) => {
    if (status === "Excelling") return <TrendingUp className="w-3.5 h-3.5" />;
    if (status === "At risk") return <TrendingDown className="w-3.5 h-3.5" />;
    return <Minus className="w-3.5 h-3.5" />;
  };

  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Students"
        subtitle="View your roster by course and track performance"
      />

      <div className="mb-6 max-w-md relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, ID, course, or class..."
          className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-brand-blue dark:text-white"
        />
      </div>

      {courseFilter ? (
        <div className="mb-4 rounded-xl border border-brand-blue/20 bg-brand-blue/10 px-4 py-3 text-sm text-brand-blue">
          Showing the roster for {courseFilter.toUpperCase()}.
        </div>
      ) : null}

      {courseGroups.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
          <Users className="mx-auto mb-3 h-10 w-10 text-gray-400" />
          <p className="font-medium text-gray-700 dark:text-gray-300">
            No students match your search.
          </p>
          <p className="mt-1 text-sm">Try another name, ID, or course title.</p>
        </div>
      ) : (
        courseGroups.map((group, groupIndex) => (
          <section key={group.id} className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {group.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {group.code} · {group.students.length} student
                  {group.students.length === 1 ? "" : "s"}
                </p>
              </div>
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                {group.room}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.students.map((student, i) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: groupIndex * 0.04 + i * 0.03 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-card border border-gray-100 dark:border-gray-700/50 flex flex-col"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm font-bold text-gray-600 dark:text-gray-300">
                        {student.initials}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {student.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {student.studentId}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/lecturer/messages?student=${encodeURIComponent(student.name)}`,
                        )
                      }
                      className="p-1.5 text-gray-400 hover:text-brand-blue hover:bg-brand-blue/10 rounded-lg transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300">
                      {student.course}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${statusColor(student.status)}`}
                    >
                      {statusIcon(student.status)} {student.status}
                    </span>
                  </div>

                  <div className="mt-auto grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700/50">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Attendance
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {student.attendance}%
                        </span>
                        <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand-blue rounded-full"
                            style={{ width: `${student.attendance}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Current Grade
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {student.avg}%
                        </span>
                        <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${student.avg >= 85 ? "bg-brand-green" : student.avg < 70 ? "bg-red-500" : "bg-brand-orange"}`}
                            style={{ width: `${student.avg}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
