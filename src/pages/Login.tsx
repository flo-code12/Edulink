import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  BriefcaseBusiness,
  ShieldCheck,
  Mail,
  Lock,
  ArrowRight } from
'lucide-react';
import { Logo } from '../components/Logo';
import { useAuth, ROLE_HOME, type Role } from '../components/AuthProvider';
const roles: {
  id: Role;
  label: string;
  desc: string;
  icon: React.ReactNode;
  ring: string;
  chip: string;
}[] = [
  {
    id: 'student',
    label: 'Student',
    desc: 'Courses, assignments & grades',
    icon: <GraduationCap className="w-5 h-5" />,
    ring: 'border-brand-blue ring-brand-blue/30 bg-brand-blue/5',
    chip: 'bg-brand-blue/10 text-brand-blue'
  },
  {
    id: 'lecturer',
    label: 'Lecturer',
    desc: 'Teach, grade & track students',
    icon: <BriefcaseBusiness className="w-5 h-5" />,
    ring: 'border-brand-green ring-brand-green/30 bg-brand-green/5',
    chip: 'bg-brand-green/10 text-brand-green'
  },
  {
    id: 'admin',
    label: 'Administrator',
    desc: 'Manage the whole institution',
    icon: <ShieldCheck className="w-5 h-5" />,
    ring: 'border-brand-orange ring-brand-orange/30 bg-brand-orange/5',
    chip: 'bg-brand-orange/10 text-brand-orange'
  }
];

export function Login() {
  const { login, authenticateAccount, updateAccountPassword } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  const currentRole = roles.find((item) => item.id === role) ?? roles[0];

  const selectRole = (r: Role) => {
    setRole(r);
    setError('');
  };
  const handleAccess = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password to continue.');
      setResetMessage('');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      setResetMessage('');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setResetMessage('');
      return;
    }

    const authenticated = authenticateAccount(email.trim().toLowerCase(), password, role);
    if (!authenticated) {
      setError('Incorrect email, password, or selected role.');
      setResetMessage('');
      return;
    }

    setError('');
    setResetMessage('');
    login(role, {
      name: authenticated.name,
      email: authenticated.email,
      title: authenticated.title,
      initials: authenticated.initials
    });
    navigate(ROLE_HOME[role]);
  };
  const submit = (e: React.FormEvent) => {
    handleAccess(e);
  };
  const openResetModal = () => {
    setError('');
    setResetMessage('');
    setNewPassword('');
    setConfirmPassword('');
    setShowResetModal(true);
  };
  const closeResetModal = () => {
    setShowResetModal(false);
    setError('');
    setResetMessage('');
    setNewPassword('');
    setConfirmPassword('');
  };
  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Please enter your email address to reset your password.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const updated = updateAccountPassword(email.trim().toLowerCase(), newPassword);
    if (!updated) {
      setError('No account was found for that email.');
      return;
    }

    setPassword(newPassword);
    setError('');
    setShowResetModal(false);
    setNewPassword('');
    setConfirmPassword('');
    setResetMessage('Password updated successfully. Please sign in with your new password.');
  };
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-[#0B1120]">
      {/* Brand panel */}
      <div className={`hidden lg:flex w-1/2 ${role === 'admin' ? 'bg-brand-orange' : role === 'lecturer' ? 'bg-brand-green' : 'bg-brand-blue'} text-white p-12 flex-col justify-between relative overflow-hidden`}>
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-white/5" />
        <div className="relative z-10 bg-white rounded-xl px-4 py-3 w-fit">
          <Logo />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-display font-bold leading-tight">
            The connected campus,
            <br />
            powered by AI.
          </h1>
          <p className="mt-4 text-blue-100 max-w-md">
            EduLink brings courses, grading, scheduling and Edu AI into one
            secure platform for the entire University community.
          </p>
          <div className="flex gap-8 mt-10">
            {[
            {
              v: '12k+',
              l: 'Students'
            },
            {
              v: '840',
              l: 'Courses'
            },
            {
              v: '98%',
              l: 'Satisfaction'
            }].
            map((s) =>
            <div key={s.l}>
                <p className="text-2xl font-bold">{s.v}</p>
                <p className="text-sm text-blue-100">{s.l}</p>
              </div>
            )}
          </div>
        </div>
        <p className="relative z-10 text-sm text-blue-200">
          Learn · Connect · Grow
        </p>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{
            opacity: 0,
            y: 16
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className="w-full max-w-md">
          
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo />
          </div>
          <div className={`rounded-2xl border px-4 py-3 mb-5 ${role === 'admin' ? 'border-brand-orange/20 bg-brand-orange/5 text-brand-orange' : role === 'lecturer' ? 'border-brand-green/20 bg-brand-green/5 text-brand-green' : 'border-brand-blue/20 bg-brand-blue/5 text-brand-blue'}`}>
            <p className="text-sm font-semibold">{currentRole.label} portal</p>
            <p className="text-xs mt-1">{currentRole.desc}</p>
          </div>
          <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
            {role === 'admin' ? 'Admin access' : role === 'lecturer' ? 'Lecturer access' : 'Student access'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1 mb-6">
            {role === 'admin' ? 'Manage users, courses, announcements, and analytics.' : role === 'lecturer' ? 'Teach, grade, and track your students with ease.' : 'View your courses, assignments, and grades in one place.'}
          </p>

          <fieldset className="mb-5">
            <legend className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              I am a…
            </legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {roles.map((r) => {
                const selected = role === r.id;
                return (
                  <button
                    type="button"
                    key={r.id}
                    onClick={() => selectRole(r.id)}
                    className={`p-3 rounded-xl border text-center transition-all ${selected ? `${r.ring} ring-2` : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'}`}
                    aria-pressed={selected}>
                    
                    <span
                      className={`inline-flex p-2 rounded-lg mb-1.5 ${r.chip}`}>
                      
                      {r.icon}
                    </span>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">
                      {r.label}
                    </p>
                  </button>);

              })}
            </div>
          </fieldset>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
                htmlFor="email">
                
                Email
              </label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                    if (resetMessage) setResetMessage('');
                  }}
                  className="w-full pl-10 pr-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-brand-blue dark:text-white" />
                
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  htmlFor="password">
                  
                  Password
                </label>
                <button
                  type="button"
                  onClick={openResetModal}
                  className="text-xs text-brand-blue hover:underline">
                  
                  Forgot password?
                </button>
              </div>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full pl-10 pr-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-brand-blue dark:text-white" />
                
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue" />
              
              Remember me on this device
            </label>
            {error ? (
              <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
            ) : null}
            {resetMessage ? (
              <p className="text-sm text-green-600 dark:text-green-400">{resetMessage}</p>
            ) : null}
            <button
              type="submit"
              disabled={!email.trim() || !password.trim()}
              className={`w-full flex items-center justify-center gap-2 py-2.5 ${role === 'admin' ? 'bg-brand-orange hover:bg-orange-600' : role === 'lecturer' ? 'bg-brand-green hover:bg-green-600' : 'bg-brand-blue hover:bg-brand-blueDark'} text-white rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed`}>
              
              {role === 'admin' ? 'Enter admin workspace' : role === 'lecturer' ? 'Open lecturer dashboard' : 'Enter student portal'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            {role === 'admin' ? 'Use your admin credentials to manage the platform.' : role === 'lecturer' ? 'Use your lecturer credentials to access teaching tools.' : 'Use your student credentials to access your learning dashboard.'}
          </p>
        </motion.div>
      </div>

      {showResetModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Reset your password
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Enter your email and choose a new password.
                </p>
              </div>
              <button
                type="button"
                onClick={closeResetModal}
                className="text-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                ×
              </button>
            </div>

            <form onSubmit={handleSavePassword} className="mt-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="reset-email">
                  Email
                </label>
                <input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:ring-2 focus:ring-brand-blue dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="new-password">
                  New password
                </label>
                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (error) setError('');
                  }}
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:ring-2 focus:ring-brand-blue dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="confirm-password">
                  Confirm password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (error) setError('');
                  }}
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:ring-2 focus:ring-brand-blue dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              {error ? <p className="text-sm text-red-500 dark:text-red-400">{error}</p> : null}

              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeResetModal}
                  className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-brand-blue px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-blueDark">
                  Save password
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      ) : null}
    </div>);

}