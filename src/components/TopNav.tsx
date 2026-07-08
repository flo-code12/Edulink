import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "./Logo";
import { useTheme } from "./ThemeProvider";
import { useAuth, type User } from "./AuthProvider";
import {
  getUnreadCount,
  markNotificationsRead,
  readNotifications,
  type AppNotification,
} from "../utils/notifications";
import {
  Bell,
  Search,
  Moon,
  Sun,
  Menu,
  X,
  LogOut,
  ChevronDown,
} from "lucide-react";
export type NavItem = {
  name: string;
  path: string;
};
const roleBadge: Record<
  User["role"],
  {
    label: string;
    chip: string;
  }
> = {
  student: {
    label: "Student",
    chip: "bg-brand-blue/10 text-brand-blue",
  },
  lecturer: {
    label: "Lecturer",
    chip: "bg-brand-green/10 text-brand-green",
  },
  admin: {
    label: "Admin",
    chip: "bg-brand-orange/10 text-brand-orange",
  },
  staff: {
    label: "Staff",
    chip: "bg-gray-100 text-gray-700",
  },
};
export function TopNav({
  navItems,
  homePath,
}: {
  navItems: NavItem[];
  homePath: string;
}) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  if (!user) return null;

  useEffect(() => {
    setNotifications(readNotifications());
  }, []);

  const unreadCount = getUnreadCount(notifications);
  const openNotifications = () => {
    setNotificationsOpen((value) => !value);
    if (notifications.some((notification) => !notification.read)) {
      setNotifications(
        markNotificationsRead(
          notifications
            .filter((notification) => !notification.read)
            .map((notification) => notification.id),
        ),
      );
    }
  };
  const badge = roleBadge[user.role];
  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-6">
            <NavLink to={homePath} className="flex-shrink-0">
              <Logo />
            </NavLink>
            <nav className="hidden lg:flex space-x-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.path === homePath}
                  className={({ isActive }) =>
                    `relative px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? "text-brand-blue dark:text-brand-blue" : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.name}
                      {isActive && (
                        <motion.div
                          layoutId="nav-indicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue rounded-t-full"
                          initial={false}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                aria-label="Search"
                className="w-56 pl-9 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-none rounded-full text-sm focus:ring-2 focus:ring-brand-blue dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
              />
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>

            <div className="relative">
              <button
                onClick={openNotifications}
                className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 ? (
                  <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-orange px-1 text-[10px] font-semibold text-white">
                    {unreadCount}
                  </span>
                ) : null}
              </button>

              <AnimatePresence>
                {notificationsOpen ? (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setNotificationsOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="absolute right-0 mt-2 w-80 rounded-xl border border-gray-100 bg-white p-2 shadow-card z-50 dark:border-gray-700 dark:bg-gray-800"
                    >
                      <div className="flex items-center justify-between px-2 py-2">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          Notifications
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setNotifications(
                              markNotificationsRead(
                                notifications.map(
                                  (notification) => notification.id,
                                ),
                              ),
                            );
                            setNotificationsOpen(false);
                          }}
                          className="text-xs text-brand-blue hover:underline"
                        >
                          Mark all read
                        </button>
                      </div>
                      <div className="max-h-72 space-y-2 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="rounded-lg border border-dashed border-gray-200 px-3 py-4 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                            No notifications yet.
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <button
                              key={notification.id}
                              type="button"
                              onClick={() => {
                                setNotifications(
                                  markNotificationsRead([notification.id]),
                                );
                                if (notification.link) {
                                  navigate(notification.link);
                                }
                                setNotificationsOpen(false);
                              }}
                              className={`w-full rounded-lg border px-3 py-3 text-left transition-colors ${notification.read ? "border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800" : "border-brand-blue/20 bg-brand-blue/5 dark:border-brand-blue/30 dark:bg-brand-blue/10"}`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {notification.title}
                                  </p>
                                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                                    {notification.message}
                                  </p>
                                </div>
                                {!notification.read ? (
                                  <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-brand-orange" />
                                ) : null}
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                ) : null}
              </AnimatePresence>
            </div>

            {/* Profile menu */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <div className="w-8 h-8 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center font-semibold text-sm">
                  {user.initials}
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setMenuOpen(false)}
                    />

                    <motion.div
                      initial={{
                        opacity: 0,
                        y: -6,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: -6,
                      }}
                      className="absolute right-0 mt-2 w-60 bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-100 dark:border-gray-700 p-2 z-50"
                      role="menu"
                    >
                      <div className="px-3 py-2">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {user.name}
                          </p>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${badge.chip}`}
                          >
                            {badge.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {user.email}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {user.title}
                        </p>
                      </div>
                      <div className="border-t border-gray-100 dark:border-gray-700 my-1" />
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                        role="menuitem"
                      >
                        <LogOut className="w-4 h-4" /> Sign out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <button
              className="lg:hidden p-2 text-gray-500"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            className="lg:hidden overflow-hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827]"
          >
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.path === homePath}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-brand-blue/10 text-brand-blue" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"}`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
