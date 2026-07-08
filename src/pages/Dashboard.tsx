import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Clock,
  ChevronRight,
  FileText,
  Calendar as CalendarIcon,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";
import { addNotification } from "../utils/notifications";
const courses = [
  {
    id: 1,
    name: "Advanced Machine Learning",
    code: "CS401",
    progress: 75,
    bar: "bg-brand-blue",
    iconBg: "bg-brand-blue/10",
    iconText: "text-brand-blue",
    nextClass: "10:00 AM, Today",
  },
  {
    id: 2,
    name: "Data Structures & Algorithms",
    code: "CS201",
    progress: 90,
    bar: "bg-brand-green",
    iconBg: "bg-brand-green/10",
    iconText: "text-brand-green",
    nextClass: "2:00 PM, Tomorrow",
  },
  {
    id: 3,
    name: "Human-Computer Interaction",
    code: "UX305",
    progress: 45,
    bar: "bg-brand-orange",
    iconBg: "bg-brand-orange/10",
    iconText: "text-brand-orange",
    nextClass: "11:00 AM, Wed",
  },
];

const assignments = [
  {
    id: 1,
    title: "Neural Network Implementation",
    course: "CS401",
    due: "Today, 11:59 PM",
    type: "Project",
  },
  {
    id: 2,
    title: "Binary Trees Quiz",
    course: "CS201",
    due: "Tomorrow, 5:00 PM",
    type: "Quiz",
  },
  {
    id: 3,
    title: "Usability Study Report",
    course: "UX305",
    due: "Friday, 11:59 PM",
    type: "Assignment",
  },
];

export function Dashboard() {
  const navigate = useNavigate();

  const handleJoinNextClass = () => {
    addNotification({
      title: "Next class joined",
      message:
        "You have joined the upcoming class session. Details are available in your calendar.",
      link: "/calendar",
    });
    navigate("/calendar");
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Welcome Section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
            Welcome back, John 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            You have 2 assignments due today and 1 upcoming class.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/calendar")}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            View Schedule
          </button>
          <button
            onClick={handleJoinNextClass}
            className="px-4 py-2 bg-brand-blue text-white rounded-lg text-sm font-medium hover:bg-brand-blueDark transition-colors shadow-sm shadow-brand-blue/20"
          >
            Join Next Class
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Courses Grid */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Current Courses
              </h2>
              <button
                onClick={() => navigate("/courses")}
                className="text-sm font-medium text-brand-blue hover:text-brand-blueDark flex items-center"
              >
                View all <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.1,
                  }}
                  onClick={() => navigate("/courses")}
                  className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-card border border-gray-100 dark:border-gray-700/50 hover:border-brand-blue/30 dark:hover:border-brand-blue/30 transition-all group cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div
                      className={`p-2 rounded-lg ${course.iconBg} ${course.iconText}`}
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
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <Clock className="w-4 h-4 mr-1.5" />
                    {course.nextClass}
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
                        className={`h-full ${course.bar} rounded-full`}
                        style={{
                          width: `${course.progress}%`,
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Recent Grades / Performance */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Academic Overview
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-card border border-gray-100 dark:border-gray-700/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Current GPA
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                    3.84
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
              <div className="space-y-4">
                {[
                  {
                    label: "Midterm Exam - CS401",
                    score: "94/100",
                    grade: "A",
                  },
                  {
                    label: "Project Phase 1 - UX305",
                    score: "88/100",
                    grade: "B+",
                  },
                ].map((item, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => navigate("/grades")}
                    className="w-full text-left flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        {item.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {item.score}
                      </span>
                      <span className="text-sm font-bold text-brand-green">
                        {item.grade}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          {/* Upcoming Assignments */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-100 dark:border-gray-700/50 overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700/50 flex justify-between items-center">
              <h2 className="font-semibold text-gray-900 dark:text-white">
                Upcoming Deadlines
              </h2>
              <span className="bg-brand-orange/10 text-brand-orange text-xs font-bold px-2 py-1 rounded-full">
                3 Due
              </span>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {assignments.map((task) => (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => navigate("/assignments")}
                  className="w-full text-left p-5 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors"
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1 pr-4">
                      {task.title}
                    </h3>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 shrink-0">
                      {task.course}
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-brand-orange mt-2">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    {task.due}
                  </div>
                </button>
              ))}
            </div>
            <div className="p-3 border-t border-gray-100 dark:border-gray-700/50">
              <button
                onClick={() => navigate("/assignments")}
                className="w-full py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-blue dark:hover:text-brand-blue transition-colors"
              >
                View all assignments
              </button>
            </div>
          </section>

          {/* Quick Schedule */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-100 dark:border-gray-700/50 p-5">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2 text-brand-blue" />
              Today's Schedule
            </h2>
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 dark:before:via-gray-700 before:to-transparent">
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-brand-blue bg-white dark:bg-gray-800 text-brand-blue shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg border border-brand-blue/20 bg-brand-blue/5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-brand-blue">
                      10:00 AM
                    </span>
                    <span className="text-xs text-gray-500">Room 402</span>
                  </div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    Advanced ML
                  </h4>
                </div>
              </div>
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-500">
                      2:00 PM
                    </span>
                    <span className="text-xs text-gray-500">Online</span>
                  </div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Data Structures
                  </h4>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
