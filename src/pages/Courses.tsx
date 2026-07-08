import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Clock,
  MapPin,
  User,
  Search,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { PageHeader, courseColor } from "../components/PageHeader";
import { courses, type Course } from "../data/mock";
export function Courses() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Course | null>(null);
  const filtered = courses.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.code.toLowerCase().includes(query.toLowerCase()) ||
      c.instructor.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="My Courses"
        subtitle={`You're enrolled in ${courses.length} courses this semester`}
        action={
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses..."
              aria-label="Search courses"
              className="w-full sm:w-72 pl-9 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-brand-blue dark:text-white placeholder-gray-400 transition-all"
            />
          </div>
        }
      />

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-gray-500 dark:text-gray-400">
            No courses match “{query}”.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((course, i) => {
            const c = courseColor(course.color);
            return (
              <motion.button
                key={course.id}
                onClick={() => setActive(course)}
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
                className="text-left bg-white dark:bg-gray-800 rounded-2xl shadow-card border border-gray-100 dark:border-gray-700/50 overflow-hidden hover:border-brand-blue/40 hover:-translate-y-0.5 transition-all group"
              >
                <div className={`h-1.5 ${c.solid}`} />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2.5 rounded-xl ${c.bg} ${c.text}`}>
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300">
                      {course.code}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors mb-1">
                    {course.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mb-4">
                    <User className="w-3.5 h-3.5" /> {course.instructor}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {course.schedule}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {course.room}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-gray-500 dark:text-gray-400">
                        Progress
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {course.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full ${c.solid} rounded-full`}
                        style={{
                          width: `${course.progress}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Course detail drawer */}
      {active && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm"
          onClick={() => setActive(null)}
        >
          <motion.aside
            initial={{
              x: "100%",
            }}
            animate={{
              x: 0,
            }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 32,
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md h-full bg-white dark:bg-gray-900 shadow-2xl overflow-y-auto"
            role="dialog"
            aria-label={`${active.name} details`}
          >
            <div className={`h-2 ${courseColor(active.color).solid}`} />
            <div className="p-6">
              <span className="text-xs font-semibold px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-gray-600 dark:text-gray-300">
                {active.code} · {active.credits} credits
              </span>
              <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mt-3">
                {active.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {active.description}
              </p>
              <div className="grid grid-cols-2 gap-3 mt-5">
                {[
                  {
                    label: "Instructor",
                    value: active.instructor,
                  },
                  {
                    label: "Schedule",
                    value: active.schedule,
                  },
                  {
                    label: "Location",
                    value: active.room,
                  },
                  {
                    label: "Progress",
                    value: `${active.progress}%`,
                  },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                  >
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {m.label}
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">
                      {m.value}
                    </p>
                  </div>
                ))}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                Modules
              </h3>
              <ul className="space-y-2">
                {active.modules.map((m) => (
                  <li
                    key={m.title}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                  >
                    {m.done ? (
                      <CheckCircle2 className="w-5 h-5 text-brand-green shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600 shrink-0" />
                    )}
                    <span
                      className={`text-sm ${m.done ? "text-gray-500 dark:text-gray-400 line-through" : "text-gray-800 dark:text-gray-200"}`}
                    >
                      {m.title}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setActive(null)}
                className="mt-6 w-full py-2.5 bg-brand-blue text-white rounded-lg text-sm font-medium hover:bg-brand-blueDark transition-colors"
              >
                Go to course
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </div>
  );
}
