import { motion } from "framer-motion";
import { TrendingUp, Users, Download } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { enrollmentTrend, facultyDistribution } from "../../data/staffMock";
export function AdminAnalytics() {
  const maxEnrollment = Math.max(...enrollmentTrend.map((d) => d.value));
  const handleExportReport = () => {
    const payload = {
      enrollmentTrend,
      facultyDistribution,
      generatedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "admin-analytics-report.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  const totalStudents = facultyDistribution.reduce(
    (sum, f) => sum + f.students,
    0,
  );
  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Analytics"
        subtitle="University enrollment and demographic trends"
        action={
          <button
            type="button"
            onClick={handleExportReport}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Download className="w-4 h-4" /> Export Report
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Enrollment Trend */}
        <motion.div
          initial={{
            opacity: 0,
            y: 16,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-card border border-gray-100 dark:border-gray-700/50 p-6"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Enrollment Trend
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total active students over time
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-brand-green bg-brand-green/10 px-2.5 py-1 rounded-full text-sm font-medium">
              <TrendingUp className="w-4 h-4" /> +39%
            </div>
          </div>

          <div className="h-64 flex items-end gap-2 sm:gap-4">
            {enrollmentTrend.map((d) => {
              const height = (d.value / maxEnrollment) * 100;
              return (
                <div
                  key={d.month}
                  className="flex-1 flex flex-col items-center gap-2 group"
                >
                  <div className="w-full relative flex justify-center h-full items-end">
                    <div
                      className="w-full bg-brand-blue/20 hover:bg-brand-blue/30 dark:bg-brand-blue/30 dark:hover:bg-brand-blue/40 rounded-t-md transition-colors relative"
                      style={{
                        height: `${height}%`,
                      }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10">
                        {d.value.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {d.month}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Faculty Distribution */}
        <motion.div
          initial={{
            opacity: 0,
            y: 16,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.1,
          }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-card border border-gray-100 dark:border-gray-700/50 p-6"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Demographics
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Students by faculty
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-brand-orange/10 text-brand-orange flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-5">
            {facultyDistribution.map((f) => {
              const percent = (f.students / totalStudents) * 100;
              return (
                <div key={f.faculty}>
                  <div className="flex justify-between items-end mb-1.5">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {f.faculty}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {f.students.toLocaleString()} ({percent.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: f.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
