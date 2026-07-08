import { motion } from "framer-motion";
import { TrendingUp, Award, BookOpen } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { grades } from "../data/mock";
export function Grades() {
  const totalCredits = grades.reduce((s, g) => s + g.credits, 0);
  const gpa = (
    grades.reduce((s, g) => s + g.gpa * g.credits, 0) / totalCredits
  ).toFixed(2);
  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Grades"
        subtitle="Your academic performance this semester"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          {
            label: "Cumulative GPA",
            value: gpa,
            icon: <TrendingUp className="w-5 h-5" />,
            color: "green",
          },
          {
            label: "Credits Earned",
            value: totalCredits,
            icon: <Award className="w-5 h-5" />,
            color: "blue",
          },
          {
            label: "Active Courses",
            value: grades.length,
            icon: <BookOpen className="w-5 h-5" />,
            color: "orange",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-card border border-gray-100 dark:border-gray-700/50 flex items-center justify-between"
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
              className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.color === "green" ? "bg-brand-green/10 text-brand-green" : stat.color === "blue" ? "bg-brand-blue/10 text-brand-blue" : "bg-brand-orange/10 text-brand-orange"}`}
            >
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {grades.map((g, i) => (
          <motion.div
            key={g.course}
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: i * 0.05,
            }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-card border border-gray-100 dark:border-gray-700/50 overflow-hidden"
          >
            <div className="p-5 flex items-center justify-between border-b border-gray-100 dark:border-gray-700/50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">
                    {g.course}
                  </span>
                  <span className="text-xs text-gray-400">
                    {g.credits} credits
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mt-1">
                  {g.courseName}
                </h3>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-brand-blue">
                  {g.letter}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {g.percent}%
                </p>
              </div>
            </div>
            <div className="p-5 space-y-2">
              {g.items.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between text-sm py-1.5"
                >
                  <span className="text-gray-700 dark:text-gray-300">
                    {item.label}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-400">{item.weight}</span>
                    <span className="font-medium text-gray-900 dark:text-white w-16 text-right">
                      {item.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
