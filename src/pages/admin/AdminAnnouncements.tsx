import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Plus, Pin } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { announcements, type Announcement } from '../../data/staffMock';

export function AdminAnnouncements() {
  const [items, setItems] = useState<Announcement[]>(announcements);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    audience: 'Everyone',
    pinned: false
  });

  const handleNewAnnouncement = () => {
    setShowForm((current) => !current);
  };

  const handleCreateAnnouncement = (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.title.trim() || !formData.body.trim()) {
      return;
    }

    const nextId = Math.max(0, ...items.map((item) => item.id)) + 1;
    setItems((currentItems) => [
      {
        id: nextId,
        title: formData.title.trim(),
        body: formData.body.trim(),
        audience: formData.audience,
        author: 'University Admin',
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        pinned: formData.pinned,
      },
      ...currentItems,
    ]);

    setFormData({ title: '', body: '', audience: 'Everyone', pinned: false });
    setShowForm(false);
  };

  const handleEditAnnouncement = (id: number) => {
    const announcement = items.find((item) => item.id === id);
    if (!announcement) return;
    const title = window.prompt('Update announcement title', announcement.title);
    const body = window.prompt('Update announcement body', announcement.body);
    if (title === null || body === null) return;
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? {
              ...item,
              title,
              body,
            }
          : item
      )
    );
  };

  const handleDeleteAnnouncement = (id: number) => {
    if (!window.confirm('Delete this announcement?')) return;
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  };
  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Announcements"
        subtitle="Manage global communications"
        action={
        <button
          type="button"
          onClick={handleNewAnnouncement}
          className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg text-sm font-medium hover:bg-brand-blueDark transition-colors shadow-sm shadow-brand-blue/20"
        >
            <Plus className="w-4 h-4" /> New Announcement
          </button>
        } />
      

      {showForm ? (
        <form onSubmit={handleCreateAnnouncement} className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(event) => setFormData((current) => ({ ...current, title: event.target.value }))}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:ring-2 focus:ring-brand-blue dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                placeholder="Semester registration now open"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
              <textarea
                value={formData.body}
                onChange={(event) => setFormData((current) => ({ ...current, body: event.target.value }))}
                className="min-h-28 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:ring-2 focus:ring-brand-blue dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                placeholder="Write the announcement details here..."
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Audience</label>
              <select
                value={formData.audience}
                onChange={(event) => setFormData((current) => ({ ...current, audience: event.target.value }))}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:ring-2 focus:ring-brand-blue dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              >
                <option value="Everyone">Everyone</option>
                <option value="Students">Students</option>
                <option value="Lecturers">Lecturers</option>
                <option value="Staff">Staff</option>
              </select>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-3 dark:border-gray-700">
              <input
                id="pin-announcement"
                type="checkbox"
                checked={formData.pinned}
                onChange={(event) => setFormData((current) => ({ ...current, pinned: event.target.checked }))}
                className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
              />
              <label htmlFor="pin-announcement" className="text-sm font-medium text-gray-700 dark:text-gray-300">Pin this announcement</label>
            </div>
          </div>
          <div className="mt-5 flex gap-3">
            <button type="submit" className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-semibold text-white hover:bg-brand-blueDark">
              Publish announcement
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((a, i) =>
          <motion.div
            key={a.id}
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
            className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-card border ${a.pinned ? 'border-brand-blue/30' : 'border-gray-100 dark:border-gray-700/50'}`}>
            
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  {a.pinned &&
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-blue/10 text-brand-blue">
                      <Pin className="w-3.5 h-3.5" />
                    </span>
                }
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {a.title}
                  </h3>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEditAnnouncement(a.id)}
                    className="text-sm font-medium text-brand-blue hover:text-brand-blueDark"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteAnnouncement(a.id)}
                    className="text-sm font-medium text-red-500 hover:text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{a.body}</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-md font-medium text-gray-700 dark:text-gray-300">
                  Target: {a.audience}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  Posted by {a.author}
                </span>
                <span className="text-gray-500 dark:text-gray-400 ml-auto">
                  {a.date}
                </span>
              </div>
            </motion.div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-brand-blue text-white rounded-2xl p-6 shadow-float relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <Megaphone className="w-8 h-8 mb-4 text-blue-200" />
            <h3 className="text-lg font-semibold mb-2">
              Reach the whole campus
            </h3>
            <p className="text-sm text-blue-100 mb-6">
              Announcements appear on student and lecturer dashboards instantly.
              Use pinned announcements for critical updates.
            </p>
            <button
              type="button"
              onClick={handleNewAnnouncement}
              className="w-full py-2.5 bg-white text-brand-blue rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors"
            >
              Draft New Update
            </button>
          </div>
        </div>
      </div>
    </div>);

}