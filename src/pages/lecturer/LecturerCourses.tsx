import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Users,
  Clock,
  MapPin,
  Search,
  ChevronRight,
  Plus } from
'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { taughtCourses, type TaughtCourse } from '../../data/staffMock';
import { addNotification } from '../../utils/notifications';

type CourseModalState =
  | { type: 'create' }
  | { type: 'syllabus'; course: TaughtCourse }
  | { type: null };

const readStoredCourses = () => {
  if (typeof window === 'undefined') return taughtCourses;
  try {
    const stored = localStorage.getItem('edulink_lecturer_courses');
    if (!stored) return taughtCourses;
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : taughtCourses;
  } catch {
    return taughtCourses;
  }
};

export function LecturerCourses() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [courses, setCourses] = useState<TaughtCourse[]>(() => readStoredCourses());
  const [modalState, setModalState] = useState<CourseModalState>({ type: null });
  const [draftCourse, setDraftCourse] = useState({
    name: '',
    code: '',
    room: '',
    schedule: '',
    color: 'blue' as TaughtCourse['color']
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('edulink_lecturer_courses', JSON.stringify(courses));
    }
  }, [courses]);

  const filtered = courses.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.code.toLowerCase().includes(query.toLowerCase())
  );

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftCourse.name.trim() || !draftCourse.code.trim()) return;

    const newCourse: TaughtCourse = {
      id: Date.now(),
      name: draftCourse.name.trim(),
      code: draftCourse.code.trim().toUpperCase(),
      students: 0,
      schedule: draftCourse.schedule.trim() || 'TBA',
      room: draftCourse.room.trim() || 'TBA',
      color: draftCourse.color,
      ungraded: 0,
      avgGrade: 0
    };

    setCourses((current) => [newCourse, ...current]);
    setDraftCourse({ name: '', code: '', room: '', schedule: '', color: 'blue' });
    setModalState({ type: null });
    addNotification({
      title: 'Course created',
      message: `${newCourse.name} is now available to your roster.`,
      link: '/lecturer/courses'
    });
  };

  const openSyllabus = (course: TaughtCourse) => setModalState({ type: 'syllabus', course });
  const openRoster = (course: TaughtCourse) => {
    navigate(`/lecturer/students?course=${encodeURIComponent(course.code)}`);
    addNotification({
      title: 'Roster opened',
      message: `You opened the roster for ${course.name}.`,
      link: `/lecturer/students?course=${encodeURIComponent(course.code)}`
    });
  };

  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="My Courses"
        subtitle={`You are teaching ${courses.length} courses this semester`}
        action={
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search courses..."
                className="w-full sm:w-64 pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-brand-blue dark:text-white" />
            </div>
            <button
              type="button"
              onClick={() => setModalState({ type: 'create' })}
              className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg text-sm font-medium hover:bg-brand-blueDark transition-colors shadow-sm shadow-brand-blue/20">
              <Plus className="w-4 h-4" /> New Course
            </button>
          </div>
        } />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filtered.map((course, i) =>
        <motion.div
          key={course.id}
          initial={{
            opacity: 0,
            y: 16
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: i * 0.05
          }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-card border border-gray-100 dark:border-gray-700/50 overflow-hidden group">

            <div className={`h-2 bg-brand-${course.color}`} />
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-semibold px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300 mb-2 inline-block">
                    {course.code}
                  </span>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors">
                    {course.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => openSyllabus(course)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4 text-gray-400" />
                  {course.schedule}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {course.room}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100 dark:border-gray-700/50">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <Users className="w-3.5 h-3.5" /> Enrolled
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {course.students}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <BookOpen className="w-3.5 h-3.5" /> Avg Grade
                  </div>
                  <p className="font-semibold text-brand-green">
                    {course.avgGrade}%
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <Clock className="w-3.5 h-3.5" /> To Grade
                  </div>
                  <p className="font-semibold text-brand-orange">
                    {course.ungraded}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-t border-gray-100 dark:border-gray-700/50 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => openSyllabus(course)}
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                Manage Syllabus
              </button>
              <button
                type="button"
                onClick={() => openRoster(course)}
                className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                View Roster
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {modalState.type === 'create' ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create a new course</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Add a course and make it available in your lecturing roster.</p>
              </div>
              <button type="button" onClick={() => setModalState({ type: null })} className="text-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">×</button>
            </div>
            <form onSubmit={handleCreateCourse} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Course name</label>
                  <input value={draftCourse.name} onChange={(e) => setDraftCourse((current) => ({ ...current, name: e.target.value }))} className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white" required />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Course code</label>
                  <input value={draftCourse.code} onChange={(e) => setDraftCourse((current) => ({ ...current, code: e.target.value }))} className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white" placeholder="CS401" required />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Schedule</label>
                  <input value={draftCourse.schedule} onChange={(e) => setDraftCourse((current) => ({ ...current, schedule: e.target.value }))} className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white" placeholder="Mon · Wed · 9:00 AM" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Room</label>
                  <input value={draftCourse.room} onChange={(e) => setDraftCourse((current) => ({ ...current, room: e.target.value }))} className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white" placeholder="Room 402" />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Color theme</label>
                <select value={draftCourse.color} onChange={(e) => setDraftCourse((current) => ({ ...current, color: e.target.value as TaughtCourse['color'] }))} className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="orange">Orange</option>
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setModalState({ type: null })} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">Cancel</button>
                <button type="submit" className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-medium text-white hover:bg-brand-blueDark">Create course</button>
              </div>
            </form>
          </motion.div>
        </div>
      ) : null}

      {modalState.type === 'syllabus' && modalState.course ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Manage syllabus</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{modalState.course.name} · {modalState.course.code}</p>
              </div>
              <button type="button" onClick={() => setModalState({ type: null })} className="text-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">×</button>
            </div>
            <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/70">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Current syllabus outline</p>
              <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Week 1: Foundations and orientation</li>
                <li>• Week 2: Core concepts and practical exercises</li>
                <li>• Week 3: Assessment and feedback checkpoints</li>
              </ul>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setModalState({ type: null })} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">Close</button>
              <button type="button" onClick={() => { addNotification({ title: 'Syllabus updated', message: `You updated the syllabus for ${modalState.course.name}.`, link: '/lecturer/courses' }); setModalState({ type: null }); }} className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-medium text-white hover:bg-brand-blueDark">Save changes</button>
            </div>
          </motion.div>
        </div>
      ) : null}
    </div>);
}
