import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { calendarEvents, type CalendarEvent } from "../data/mock";
const typeStyle: Record<CalendarEvent["type"], string> = {
  class: "bg-brand-blue/10 text-brand-blue border-brand-blue/20",
  assignment: "bg-brand-orange/10 text-brand-orange border-brand-orange/20",
  exam: "bg-red-500/10 text-red-500 border-red-500/20",
};
const dotStyle: Record<CalendarEvent["type"], string> = {
  class: "bg-brand-blue",
  assignment: "bg-brand-orange",
  exam: "bg-red-500",
};
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TODAY = new Date(2026, 5, 26);

export function Calendar() {
  const [viewDate, setViewDate] = useState<Date>(TODAY);
  const [selected, setSelected] = useState<number>(TODAY.getDate());

  const monthLabel = viewDate.toLocaleString("en", {
    month: "long",
    year: "numeric",
  });
  const firstWeekday = new Date(
    viewDate.getFullYear(),
    viewDate.getMonth(),
    1,
  ).getDay();
  const daysInMonth = new Date(
    viewDate.getFullYear(),
    viewDate.getMonth() + 1,
    0,
  ).getDate();
  const monthIsJune2026 =
    viewDate.getFullYear() === 2026 && viewDate.getMonth() === 5;

  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const eventsFor = (day: number) =>
    monthIsJune2026 ? calendarEvents.filter((e) => e.day === day) : [];
  const selectedEvents = eventsFor(selected);

  const changeMonth = (direction: -1 | 1) => {
    setViewDate((current) => {
      const next = new Date(
        current.getFullYear(),
        current.getMonth() + direction,
        1,
      );
      return next;
    });
    setSelected(1);
  };

  const handleSelectDay = (day: number) => {
    if (day > daysInMonth) return;
    setSelected(day);
  };

  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Calendar"
        subtitle="June 2026"
        action={
          <div className="flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1">
            <button
              onClick={() => changeMonth(-1)}
              className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium px-2 text-gray-700 dark:text-gray-200">
              {monthLabel.split(" ")[0]}
            </span>
            <button
              onClick={() => changeMonth(1)}
              className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Month grid */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-card border border-gray-100 dark:border-gray-700/50 p-4">
          <div className="grid grid-cols-7 mb-2">
            {WEEKDAYS.map((d) => (
              <div
                key={d}
                className="text-center text-xs font-semibold text-gray-400 dark:text-gray-500 py-2"
              >
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, idx) => {
              if (day === null) return <div key={`e-${idx}`} />;
              const evs = eventsFor(day);
              const isToday =
                day === TODAY.getDate() &&
                viewDate.getFullYear() === TODAY.getFullYear() &&
                viewDate.getMonth() === TODAY.getMonth();
              const isSelected = day === selected;
              return (
                <button
                  key={day}
                  onClick={() => handleSelectDay(day)}
                  className={`aspect-square rounded-lg p-1.5 flex flex-col items-center transition-colors border ${isSelected ? "border-brand-blue bg-brand-blue/5" : "border-transparent hover:bg-gray-50 dark:hover:bg-gray-700/40"}`}
                >
                  <span
                    className={`text-sm flex items-center justify-center w-7 h-7 rounded-full ${isToday ? "bg-brand-blue text-white font-semibold" : "text-gray-700 dark:text-gray-200"}`}
                  >
                    {day}
                  </span>
                  <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
                    {evs.slice(0, 3).map((e, i) => (
                      <span
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full ${dotStyle[e.type]}`}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Day detail */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card border border-gray-100 dark:border-gray-700/50 p-5">
          <h2 className="font-semibold text-gray-900 dark:text-white">
            {viewDate.toLocaleString("en", { month: "long" })} {selected},{" "}
            {viewDate.getFullYear()}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {selectedEvents.length} event
            {selectedEvents.length !== 1 ? "s" : ""}
          </p>
          {selectedEvents.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">
              No events scheduled.
            </p>
          ) : (
            <div className="space-y-3">
              {selectedEvents.map((e, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg border ${typeStyle[e.type]}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold capitalize">
                      {e.type}
                    </span>
                    <span className="text-xs">{e.time}</span>
                  </div>
                  <p className="text-sm font-medium mt-1">{e.title}</p>
                  <p className="text-xs opacity-70">{e.course}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
