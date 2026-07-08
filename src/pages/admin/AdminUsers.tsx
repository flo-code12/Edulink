import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Check, X, UserPlus } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { useAuth } from "../../components/AuthProvider";
import { adminUsers, type AdminUser } from "../../data/staffMock";

type CreateRole = AdminUser["role"];
type Role = "student" | "lecturer" | "admin" | "staff";

const ACCOUNTS_STORAGE_KEY = "edulink_accounts";

const roleFromAuthRole = (role: string): AdminUser["role"] => {
  switch (role) {
    case "lecturer":
      return "Lecturer";
    case "admin":
      return "Admin";
    case "staff":
      return "Staff";
    default:
      return "Student";
  }
};

const loadManagedUsers = (): AdminUser[] => {
  const seededUsers = adminUsers.map((user) => ({ ...user }));
  const userMap = new Map<string, AdminUser>();

  seededUsers.forEach((user) => {
    userMap.set(user.email.toLowerCase(), user);
  });

  try {
    const stored = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (!stored) return seededUsers;

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return seededUsers;

    parsed.forEach((account: Record<string, unknown>) => {
      const email = String(account.email ?? "")
        .trim()
        .toLowerCase();
      if (!email) return;

      userMap.set(email, {
        id: Number(account.id) || Date.now() + Math.random(),
        name: String(account.name ?? "User"),
        initials:
          String(account.name ?? "User")
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0])
            .join("")
            .toUpperCase() || "US",
        email,
        role: roleFromAuthRole(String(account.role ?? "student")),
        faculty: String(account.faculty ?? "Computing"),
        status: (account.status as AdminUser["status"]) ?? "Active",
        password: String(account.password ?? ""),
      });
    });
  } catch {
    // Ignore storage errors and fall back to seeded users.
  }

  return Array.from(userMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
};

export function AdminUsers() {
  const { createAccount } = useAuth();
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [users, setUsers] = useState<AdminUser[]>(() => loadManagedUsers());
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Student" as CreateRole,
    faculty: "Computing",
    password: "",
  });

  const handleAddUser = () => {
    setShowForm((prev) => !prev);
    setMessage(null);
  };

  const roleToAuthRole = (role: CreateRole): Role => {
    switch (role) {
      case "Lecturer":
        return "lecturer";
      case "Admin":
        return "admin";
      case "Staff":
        return "staff";
      default:
        return "student";
    }
  };

  const generatePassword = (
    name: string,
    email: string,
    role: CreateRole,
    faculty: string,
  ) => {
    const cleanName = name.trim().split(/\s+/).filter(Boolean).join("");
    const localPart = email.trim().split("@")[0] || "user";
    const shortRole = role.toLowerCase().slice(0, 3);
    const shortFaculty =
      faculty.trim().toLowerCase().replace(/\s+/g, "").slice(0, 3) || "edu";
    return `${cleanName.charAt(0).toUpperCase()}${cleanName.slice(1).toLowerCase()}@${shortRole}${shortFaculty}${localPart.length}`.replace(
      /[^A-Za-z0-9@]/g,
      "",
    );
  };

  const handleCreateUser = (event: React.FormEvent) => {
    event.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const faculty = formData.faculty.trim() || "Computing";

    if (!name || !email) {
      setMessage({
        type: "error",
        text: "Please provide both the full name and email address.",
      });
      return;
    }

    const password =
      formData.password.trim() ||
      generatePassword(name, email, formData.role, faculty);

    try {
      const createdAccount = createAccount({
        name,
        email,
        password,
        role: roleToAuthRole(formData.role),
        faculty,
        status: "Active",
      });

      const initials =
        name
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 2)
          .map((part) => part[0])
          .join("")
          .toUpperCase() || "NU";

      const nextId = Math.max(0, ...users.map((user) => user.id)) + 1;
      setUsers((currentUsers) => [
        {
          id: nextId,
          name,
          initials,
          email,
          role: formData.role,
          faculty,
          status: "Active",
          password: createdAccount.password,
        },
        ...currentUsers,
      ]);

      setFormData({
        name: "",
        email: "",
        role: "Student",
        faculty: "Computing",
        password: "",
      });
      setShowForm(false);
      setMessage({
        type: "success",
        text: `Account created successfully. Temporary password: ${password}`,
      });
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Unable to create account.",
      });
    }
  };

  const filtered = useMemo(
    () =>
      users.filter((user) => {
        const matchesQuery =
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase());
        const matchesRole = roleFilter === "All" || user.role === roleFilter;
        return matchesQuery && matchesRole;
      }),
    [query, roleFilter, users],
  );

  const statusBadge = (status: string) => {
    if (status === "Active") return "bg-brand-green/10 text-brand-green";
    if (status === "Pending") return "bg-brand-orange/10 text-brand-orange";
    if (status === "Rejected") return "bg-amber-500/10 text-amber-600";
    return "bg-red-500/10 text-red-500";
  };

  const handleDecision = (userId: number, decision: "approve" | "reject") => {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: decision === "approve" ? "Active" : "Rejected",
            }
          : user,
      ),
    );
  };

  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="User Management"
        subtitle={`Managing ${users.length} total users`}
        action={
          <button
            type="button"
            onClick={handleAddUser}
            className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg text-sm font-medium hover:bg-brand-blueDark transition-colors shadow-sm shadow-brand-blue/20"
          >
            <UserPlus className="w-4 h-4" />{" "}
            {showForm ? "Close form" : "Add User"}
          </button>
        }
      />

      {message ? (
        <div
          className={`mb-6 rounded-xl border px-4 py-3 text-sm ${message.type === "success" ? "border-brand-green/30 bg-brand-green/10 text-brand-green" : "border-red-300 bg-red-50 text-red-700"}`}
        >
          {message.text}
        </div>
      ) : null}

      {showForm ? (
        <form
          onSubmit={handleCreateUser}
          className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:ring-2 focus:ring-brand-blue dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                placeholder="Jane Doe"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:ring-2 focus:ring-brand-blue dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                placeholder="jane.doe@univ-iug.com"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    role: event.target.value as CreateRole,
                  }))
                }
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:ring-2 focus:ring-brand-blue dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              >
                <option value="Student">Student</option>
                <option value="Lecturer">Lecturer</option>
                <option value="Staff">Staff</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Faculty
              </label>
              <input
                type="text"
                value={formData.faculty}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    faculty: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:ring-2 focus:ring-brand-blue dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                placeholder="Computing"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Temporary password
              </label>
              <input
                type="text"
                value={formData.password}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    password: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:ring-2 focus:ring-brand-blue dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                placeholder="Leave blank to auto-generate"
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                If left blank, the system will generate a password from the user
                details.
              </p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-semibold text-white hover:bg-brand-blueDark"
            >
              Create account
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search users by name or email..."
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-brand-blue dark:text-white"
          />
        </div>
        <div className="flex gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1">
          {["All", "Student", "Lecturer", "Admin", "Staff"].map((roleValue) => (
            <button
              key={roleValue}
              onClick={() => setRoleFilter(roleValue)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${roleFilter === roleValue ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
            >
              {roleValue}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card border border-gray-100 dark:border-gray-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Faculty
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Password
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {filtered.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                        {user.initials}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {user.faculty}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
                      {user.password ? user.password : "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge(user.status)}`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {user.status === "Pending" ? (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleDecision(user.id, "approve")}
                          className="inline-flex items-center gap-1 rounded-lg border border-brand-green/30 bg-brand-green/10 px-3 py-1.5 text-sm font-medium text-brand-green transition-colors hover:bg-brand-green/20"
                        >
                          <Check className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleDecision(user.id, "reject")}
                          className="inline-flex items-center gap-1 rounded-lg border border-red-300 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
                        >
                          <X className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {user.status === "Active" ? "Approved" : "Reviewed"}
                      </span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-500 dark:text-gray-400">
              No users found matching your criteria.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
