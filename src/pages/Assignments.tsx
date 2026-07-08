import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Award,
  Send } from
'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { useAuth } from '../components/AuthProvider';
import { assignments, type Assignment } from '../data/mock';
import { addNotification } from '../utils/notifications';
const filters = [
{
  id: 'all',
  label: 'All'
},
{
  id: 'pending',
  label: 'To Do'
},
{
  id: 'submitted',
  label: 'Submitted'
},
{
  id: 'graded',
  label: 'Graded'
},
{
  id: 'overdue',
  label: 'Overdue'
}] as
const;
const statusStyle: Record<
  Assignment['status'],
  {
    label: string;
    chip: string;
    icon: React.ReactNode;
  }> =
{
  pending: {
    label: 'To Do',
    chip: 'bg-brand-orange/10 text-brand-orange',
    icon: <Clock className="w-4 h-4" />
  },
  submitted: {
    label: 'Submitted',
    chip: 'bg-brand-blue/10 text-brand-blue',
    icon: <CheckCircle2 className="w-4 h-4" />
  },
  graded: {
    label: 'Graded',
    chip: 'bg-brand-green/10 text-brand-green',
    icon: <Award className="w-4 h-4" />
  },
  overdue: {
    label: 'Overdue',
    chip: 'bg-red-500/10 text-red-500',
    icon: <AlertTriangle className="w-4 h-4" />
  }
};
const readStoredSubmissions = () => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('edulink_student_submissions');
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export function Assignments() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<(typeof filters)[number]['id']>('all');
  const [assignmentList, setAssignmentList] = useState<Assignment[]>(() => {
    const storedSubmissions = readStoredSubmissions();
    return assignments.map((assignment) =>
      storedSubmissions.some((item: { assignmentId?: number }) => item.assignmentId === assignment.id)
        ? { ...assignment, status: 'submitted' as const }
        : assignment
    );
  });
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const list = assignmentList.filter(
    (a) => filter === 'all' || a.status === filter
  );
  const counts = {
    pending: assignmentList.filter((a) => a.status === 'pending').length,
    overdue: assignmentList.filter((a) => a.status === 'overdue').length,
    graded: assignmentList.filter((a) => a.status === 'graded').length
  };
  const openAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setAnswer('');
    setFeedback('');
  };
  const submitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;
    if (!answer.trim()) {
      setFeedback('Please write an answer before submitting your work.');
      return;
    }

    const storedSubmissions = readStoredSubmissions();
    const replacementSubmissions = storedSubmissions.filter(
      (item: { assignmentId?: number }) => item.assignmentId !== selectedAssignment.id
    );
    replacementSubmissions.push({
      id: Date.now(),
      student: user?.name || 'Student',
      initials: user?.initials || 'ST',
      course: selectedAssignment.course,
      assignment: selectedAssignment.title,
      submitted: 'Just now',
      status: 'pending',
      assignmentId: selectedAssignment.id,
      answer: answer.trim()
    });

    try {
      localStorage.setItem('edulink_student_submissions', JSON.stringify(replacementSubmissions));
    } catch {
      // ignore local storage errors
    }

    addNotification({
      title: 'Assignment submitted',
      message: `${selectedAssignment.title} was sent to your lecturer.`,
      link: '/assignments'
    });

    setAssignmentList((current) =>
      current.map((item) => (item.id === selectedAssignment.id ? { ...item, status: 'submitted' } : item))
    );
    setFeedback('Your answer was submitted successfully. The lecturer can review it now.');
    setSelectedAssignment(null);
    setAnswer('');
  };
  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Assignments"
        subtitle={`${counts.pending} to do · ${counts.overdue} overdue · ${counts.graded} graded`} />
      

      {feedback ? (
        <div className="mb-4 rounded-lg border border-brand-green/20 bg-brand-green/10 px-4 py-3 text-sm text-brand-green">
          {feedback}
        </div>
      ) : null}

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {filters.map((f) =>
        <button
          key={f.id}
          onClick={() => setFilter(f.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === f.id ? 'bg-brand-blue text-white' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-brand-blue/40'}`}>
          
            {f.label}
          </button>
        )}
      </div>

      <div className="space-y-3">
        {list.length === 0 ?
        <div className="text-center py-16">
            <CheckCircle2 className="w-12 h-12 mx-auto text-brand-green mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              Nothing here — you're all caught up!
            </p>
          </div> :

        list.map((a, i) => {
          const s = statusStyle[a.status];
          return (
            <motion.div
              key={a.id}
              initial={{
                opacity: 0,
                y: 12
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: i * 0.04
              }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-100 dark:border-gray-700/50 p-4 sm:p-5 flex items-center gap-4 hover:border-brand-blue/30 transition-colors">
              
                <div className="w-11 h-11 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-300 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {a.title}
                    </h3>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                      {a.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {a.course} · {a.courseName}
                  </p>
                </div>
                <div className="hidden sm:block text-right shrink-0">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {a.dueLabel}
                  </p>
                  {a.grade ?
                <p className="text-sm font-bold text-brand-green mt-0.5">
                      {a.grade}
                    </p> :

                <p className="text-xs text-gray-400 mt-0.5">
                      {a.points} pts
                    </p>
                }
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span
                  className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full ${s.chip}`}>
                  
                    {s.icon}
                    <span className="hidden xs:inline">{s.label}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => openAssignment(a)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">
                    
                    {a.status === 'submitted' ? 'View answer' : 'Answer'}
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>);

        })
        }
      </div>

      {selectedAssignment ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedAssignment.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {selectedAssignment.course} · {selectedAssignment.courseName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedAssignment(null);
                  setAnswer('');
                  setFeedback('');
                }}
                className="text-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                ×
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/70">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Teacher note</p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{selectedAssignment.description}</p>
                <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-200">Instructions</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{selectedAssignment.instructions}</p>
              </div>

              <form onSubmit={submitAnswer} className="space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="student-answer">
                  Your answer
                </label>
                <textarea
                  id="student-answer"
                  rows={8}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Write your response for the lecturer here..."
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm focus:ring-2 focus:ring-brand-blue dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />

                <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAssignment(null);
                      setAnswer('');
                      setFeedback('');
                    }}
                    className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-brand-blue px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-blueDark">
                    Submit to lecturer
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      ) : null}
    </div>);

}