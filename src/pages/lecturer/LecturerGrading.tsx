import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle2, Clock, Search, Send } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { submissions, type Submission } from '../../data/staffMock';
import { addNotification } from '../../utils/notifications';
import { addMessageToThread } from '../../utils/messages';

const readStoredStudentSubmissions = () => {
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

export function LecturerGrading() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'graded'>('pending');
  const [query, setQuery] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [modalMode, setModalMode] = useState<'grade' | 'review'>('grade');
  const [gradeValue, setGradeValue] = useState('90');
  const [messageValue, setMessageValue] = useState('');
  const [submissionList, setSubmissionList] = useState<Submission[]>(() => {
    const stored = readStoredStudentSubmissions();
    const merged = [...submissions];
    stored.forEach((item: Submission) => {
      const exists = merged.some(
        (existing) => existing.id === item.id || (existing.assignment === item.assignment && existing.student === item.student)
      );
      if (!exists) {
        merged.push(item);
      }
    });
    return merged;
  });

  React.useEffect(() => {
    const stored = readStoredStudentSubmissions();
    if (stored.length > 0) {
      const merged = [...submissions];
      stored.forEach((item: Submission) => {
        const exists = merged.some(
          (existing) => existing.id === item.id || (existing.assignment === item.assignment && existing.student === item.student)
        );
        if (!exists) {
          merged.push(item);
          addNotification({
            title: 'New submission received',
            message: `${item.student} submitted ${item.assignment}.`,
            link: '/lecturer/grading'
          });
        }
      });
      setSubmissionList(merged);
    }
  }, []);

  const filtered = submissionList.filter((s) => {
    const matchesFilter = filter === 'all' || s.status === filter;
    const matchesQuery =
      s.student.toLowerCase().includes(query.toLowerCase()) ||
      s.assignment.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  const closeModal = () => {
    setSelectedSubmission(null);
    setModalMode('grade');
    setGradeValue('90');
    setMessageValue('');
  };

  const openGradeModal = (submission: Submission) => {
    setSelectedSubmission(submission);
    setModalMode('grade');
    setGradeValue(submission.grade?.toString() ?? '90');
    setMessageValue('');
  };

  const openReviewModal = (submission: Submission) => {
    setSelectedSubmission(submission);
    setModalMode('review');
  };

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    const grade = Number(gradeValue);
    const safeGrade = Number.isFinite(grade) ? Math.min(100, Math.max(0, grade)) : 0;

    setSubmissionList((prev) =>
      prev.map((item) =>
        item.id === selectedSubmission.id
          ? { ...item, status: 'graded', grade: safeGrade }
          : item
      )
    );

    const studentName = selectedSubmission.student;
    const messageText = messageValue.trim() || `Your grade for ${selectedSubmission.assignment} is ${safeGrade}%.`;

    addNotification({
      title: 'Grade sent',
      message: `You graded ${studentName} with ${safeGrade}% for ${selectedSubmission.assignment}.`,
      link: '/lecturer/grading'
    });

    addMessageToThread({
      name: studentName,
      role: 'Student',
      initials: selectedSubmission.initials,
      color: 'bg-brand-blue',
      text: messageText,
      fromMe: true
    });

    closeModal();
  };

  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Grading"
        subtitle={`${submissionList.filter((s) => s.status === 'pending').length} submissions need your attention`} />

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search student or assignment..."
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-brand-blue dark:text-white" />
        </div>
        <div className="flex gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1">
          {(['all', 'pending', 'graded'] as const).map((f) =>
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
              {f}
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card border border-gray-100 dark:border-gray-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Assignment</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Course</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {filtered.map((sub, i) =>
              <motion.tr
                key={sub.id}
                initial={{
                  opacity: 0,
                  y: 8
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  delay: i * 0.03
                }}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors group">

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center text-xs font-bold">
                        {sub.initials}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {sub.student}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {sub.assignment}
                        </span>
                      </div>
                      {sub.answer ? (
                        <p className="max-w-xl text-xs text-gray-500 dark:text-gray-400">
                          {sub.answer}
                        </p>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300">
                      {sub.course}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {sub.status === 'pending' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-brand-orange/10 text-brand-orange">
                        <Clock className="w-3.5 h-3.5" /> Submitted {sub.submitted}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-brand-green/10 text-brand-green">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Graded: {sub.grade}%
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {sub.status === 'pending' ? (
                      <button
                        type="button"
                        onClick={() => openGradeModal(sub)}
                        className="px-4 py-1.5 bg-brand-blue text-white rounded-lg text-sm font-medium hover:bg-brand-blueDark transition-colors">
                        Grade
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => openReviewModal(sub)}
                        className="px-4 py-1.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                        Review
                      </button>
                    )}
                  </td>
                </motion.tr>
              )}
            </tbody>
          </table>
          {filtered.length === 0 &&
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
              No submissions found.
            </div>
          }
        </div>
      </div>

      {selectedSubmission ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {modalMode === 'review' ? 'Submission review' : 'Grade and send feedback'}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {selectedSubmission.student} · {selectedSubmission.assignment}
                </p>
              </div>
              <button type="button" onClick={closeModal} className="text-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">×</button>
            </div>

            {modalMode === 'review' ? (
              <div className="mt-6 space-y-4">
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/70">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Current grade</p>
                  <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{selectedSubmission.grade ?? 0}%</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/70">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Student submission</p>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{selectedSubmission.answer || 'No detailed answer was provided for this submission.'}</p>
                </div>
                <div className="flex justify-end">
                  <button type="button" onClick={() => { addNotification({ title: 'Review note saved', message: `You reviewed ${selectedSubmission.student}'s submission.`, link: '/lecturer/grading' }); closeModal(); }} className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-medium text-white hover:bg-brand-blueDark">Mark reviewed</button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleGradeSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Grade percentage</label>
                  <input type="number" min="0" max="100" value={gradeValue} onChange={(e) => setGradeValue(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-brand-blue focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Message to student</label>
                  <textarea rows={4} value={messageValue} onChange={(e) => setMessageValue(e.target.value)} placeholder="Add an optional note for the student..." className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-brand-blue focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                </div>

                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/70">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Student submission preview</p>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{selectedSubmission.answer || 'No detailed answer was provided for this submission.'}</p>
                </div>

                <div className="flex justify-end gap-3">
                  <button type="button" onClick={closeModal} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">Cancel</button>
                  <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-brand-blue px-4 py-2 text-sm font-medium text-white hover:bg-brand-blueDark"><Send className="h-4 w-4" /> Send grade</button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      ) : null}
    </div>);
}
