import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  BookOpen,
  Users,
  GraduationCap,
  ClipboardList,
} from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { adminCourses, type AdminCourse } from "../../data/staffMock";

export function AdminCourses() {
  const [query, setQuery] = useState("");
  const [courses, setCourses] = useState<AdminCourse[]>(adminCourses);
  const filtered = courses.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.code.toLowerCase().includes(query.toLowerCase()) ||
      c.lecturer.toLowerCase().includes(query.toLowerCase()) ||
      c.faculty.toLowerCase().includes(query.toLowerCase()),
  );
  const publishedCount = courses.filter(
    (course) => course.status === "Published",
  ).length;
  const draftCount = courses.filter(
    (course) => course.status === "Draft",
  ).length;
  const totalEnrollment = courses.reduce(
    (sum, course) => sum + course.enrolled,
    0,
  );

  const handleCreateCourse = () => {
    const nextId = Math.max(0, ...courses.map((c) => c.id)) + 1;
    setCourses((currentCourses) => [
      {
        id: nextId,
        name: `New Course ${nextId}`,
        code: `NC${nextId}`,
        faculty: "General Studies",
        lecturer: "Unassigned",
        enrolled: 0,
        capacity: 40,
        status: "Draft",
      },
      ...currentCourses,
    ]);
  };

  const toggleCourseStatus = (courseId: number) => {
    setCourses((currentCourses) =>
      currentCourses.map((course) =>
        course.id === courseId
          ? {
              ...course,
              status: course.status === "Published" ? "Draft" : "Published",
            }
          : course,
      ),
    );
  };

  const handleManageRoster = (courseId: number) => {
    setCourses((currentCourses) =>
      currentCourses.map((course) =>
        course.id === courseId
          ? {
              ...course,
              enrolled: Math.min(course.capacity, course.enrolled + 5),
            }
          : course,
      ),
    );
  };

  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Course Catalog"
        subtitle="Manage university courses and assignments"
        action={
          <button
            type="button"
            onClick={handleCreateCourse}
            className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg text-sm font-medium hover:bg-brand-blueDark transition-colors shadow-sm shadow-brand-blue/20"
          >
            <Plus className="w-4 h-4" /> Create Course
          </button>
        }
      />

      <div className="mb-6 grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses by name, code, lecturer, or faculty..."
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-brand-blue dark:text-white"
          />
        </div>

        <div className="grid grid-cols-3 gap-2 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
          <div className="rounded-lg bg-brand-blue/10 p-2 text-center">
            <p className="text-lg font-semibold text-brand-blue">
              {courses.length}
            </p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Courses
            </p>
          </div>
          <div className="rounded-lg bg-brand-green/10 p-2 text-center">
            <p className="text-lg font-semibold text-brand-green">
              {publishedCount}
            </p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Published
            </p>
          </div>
          <div className="rounded-lg bg-brand-orange/10 p-2 text-center">
            <p className="text-lg font-semibold text-brand-orange">
              {draftCount}
            </p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Drafts
            </p>
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <ClipboardList className="w-4 h-4" />
        <span>
          {filtered.length} course{filtered.length === 1 ? "" : "s"} shown
        </span>
        <span className="text-gray-300">•</span>
        <span>{totalEnrollment} students enrolled across the catalog</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3 rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
            <GraduationCap className="mx-auto mb-3 h-10 w-10 text-gray-400" />
            <p className="font-medium text-gray-700 dark:text-gray-300">
              No courses match your search.
            </p>
            <p className="mt-1 text-sm">
              Try another course name, code, lecturer, or faculty.
            </p>
          </div>
        ) : (
          filtered.map((course, i) => (
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
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-card border border-gray-100 dark:border-gray-700/50 overflow-hidden flex flex-col"
            >
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-semibold px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300">
                    {course.code}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${course.status === "Published" ? "bg-brand-green/10 text-brand-green" : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"}`}
                  >
                    {course.status}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 leading-tight">
                  {course.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {course.faculty}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      Lecturer:
                    </span>
                    <span
                      className={`font-medium ${course.lecturer === "Unassigned" ? "text-brand-orange" : "text-gray-900 dark:text-white"}`}
                    >
                      {course.lecturer}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      Enrollment:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {course.enrolled} / {course.capacity}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mt-1">
                    <div
                      className={`h-full rounded-full ${course.enrolled >= course.capacity ? "bg-red-500" : "bg-brand-blue"}`}
                      style={{
                        width: `${Math.min(100, (course.enrolled / course.capacity) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-t border-gray-100 dark:border-gray-700/50 flex gap-2">
                <button
                  type="button"
                  onClick={() => toggleCourseStatus(course.id)}
                  className="flex-1 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  Edit Details
                </button>
                <button
                  type="button"
                  onClick={() => handleManageRoster(course.id)}
                  className="flex-1 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  Manage Roster
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
