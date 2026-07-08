import React, { useEffect, useState, createContext, useContext } from "react";
import { useScreenInit } from "../useScreenInit";

export type Role = "student" | "lecturer" | "admin" | "staff";

export type User = {
  name: string;
  role: Role;
  initials: string;
  email: string;
  title: string;
};

export type StoredAccount = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  faculty: string;
  status: "Active" | "Pending" | "Suspended" | "Rejected";
};

const ROLE_PROFILES: Record<Role, User> = {
  student: {
    name: "John Doe",
    role: "student",
    initials: "JD",
    email: "john.doe@univ-iug.com",
    title: "BSc Computer Science · Year 3",
  },
  lecturer: {
    name: "Dr. Amina Toure",
    role: "lecturer",
    initials: "AT",
    email: "a.toure@univ-iug.com",
    title: "Faculty of Computing",
  },
  admin: {
    name: "Samuel Adeyemi",
    role: "admin",
    initials: "SA",
    email: "s.adeyemi@univ-iug.com",
    title: "University Administrator",
  },
  staff: {
    name: "University Staff",
    role: "staff",
    initials: "US",
    email: "staff@univ-iug.com",
    title: "University Staff",
  },
};

export const ROLE_HOME: Record<Role, string> = {
  student: "/",
  lecturer: "/lecturer",
  admin: "/admin",
  staff: "/staff",
};

const ACCOUNTS_STORAGE_KEY = "edulink_accounts";
const ROLE_STORAGE_KEY = "edulink_role";

const createInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "US";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const normalizeRole = (value: string): Role => {
  if (
    value === "lecturer" ||
    value === "student" ||
    value === "admin" ||
    value === "staff"
  ) {
    return value;
  }
  return "student";
};

const buildUser = (role: Role, profile?: Partial<User>): User => ({
  ...ROLE_PROFILES[role],
  ...profile,
  role,
  initials:
    profile?.initials ??
    createInitials(profile?.name ?? ROLE_PROFILES[role].name),
  title: profile?.title ?? ROLE_PROFILES[role].title,
  email: profile?.email ?? ROLE_PROFILES[role].email,
  name: profile?.name ?? ROLE_PROFILES[role].name,
});

const readAccounts = (): StoredAccount[] => {
  try {
    const stored = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeAccounts = (accounts: StoredAccount[]) => {
  try {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  } catch {
    // ignore storage errors
  }
};

const SEED_ACCOUNTS: StoredAccount[] = [
  {
    id: "seed-admin",
    name: "Samuel Adeyemi",
    email: "admin@univ-iug.com",
    password: "Admin@123",
    role: "admin",
    faculty: "Administration",
    status: "Active",
  },
  {
    id: "seed-student",
    name: "John Doe",
    email: "john.doe@univ-iug.com",
    password: "Student@123",
    role: "student",
    faculty: "Computing",
    status: "Active",
  },
  {
    id: "seed-lecturer",
    name: "Dr. Amina Toure",
    email: "a.toure@univ-iug.com",
    password: "Lecturer@123",
    role: "lecturer",
    faculty: "Computing",
    status: "Active",
  },
];

const ensureSeedAccounts = () => {
  const accounts = readAccounts();
  const existingEmails = new Set(
    accounts.map((account) => account.email.toLowerCase()),
  );
  const missing = SEED_ACCOUNTS.filter(
    (seed) => !existingEmails.has(seed.email.toLowerCase()),
  );
  if (missing.length > 0) {
    writeAccounts([...accounts, ...missing]);
  }
};

interface AuthContextType {
  user: User | null;
  login: (role: Role, profile?: Partial<User>) => void;
  logout: () => void;
  profileFor: (role: Role) => User;
  authenticateAccount: (
    email: string,
    password: string,
    role: Role,
  ) => User | null;
  createAccount: (account: Omit<StoredAccount, "id">) => StoredAccount;
  register: (name: string, email: string, password: string, role: Role) => User;
  updateAccountPassword: (email: string, newPassword: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const screenInit = useScreenInit() as { role?: string };
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    ensureSeedAccounts();

    if (screenInit?.role) {
      const resolvedRole = normalizeRole(screenInit.role);
      if (ROLE_PROFILES[resolvedRole]) {
        setUser(buildUser(resolvedRole));
        return;
      }
    }

    try {
      const stored = localStorage.getItem(ROLE_STORAGE_KEY);
      const resolvedRole = stored ? normalizeRole(stored) : null;
      if (resolvedRole && ROLE_PROFILES[resolvedRole])
        setUser(buildUser(resolvedRole));
    } catch {
      // ignore
    }
  }, [screenInit?.role]);

  const login = (role: Role, profile?: Partial<User>) => {
    const nextUser = buildUser(role, profile);
    setUser(nextUser);
    try {
      localStorage.setItem(ROLE_STORAGE_KEY, role);
    } catch {
      // ignore
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(ROLE_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const profileFor = (role: Role) => ROLE_PROFILES[role];

  const authenticateAccount = (email: string, password: string, role: Role) => {
    ensureSeedAccounts();
    const accounts = readAccounts();
    const found = accounts.find(
      (account) =>
        account.email.toLowerCase() === email.trim().toLowerCase() &&
        account.password === password &&
        account.role === role,
    );
    if (!found) return null;

    return buildUser(found.role, {
      name: found.name,
      email: found.email,
      title: found.faculty
        ? `${found.faculty} Faculty`
        : ROLE_PROFILES[found.role].title,
      initials: createInitials(found.name),
    });
  };

  const createAccount = (account: Omit<StoredAccount, "id">) => {
    ensureSeedAccounts();
    const accounts = readAccounts();
    const normalizedEmail = account.email.trim().toLowerCase();
    const duplicate = accounts.find(
      (item) => item.email.toLowerCase() === normalizedEmail,
    );

    if (duplicate) {
      throw new Error("An account with this email already exists.");
    }

    const nextAccount: StoredAccount = {
      ...account,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      email: normalizedEmail,
      role: normalizeRole(account.role),
      password: account.password.trim() || "EduLink@2026",
    };

    writeAccounts([...accounts, nextAccount]);
    return nextAccount;
  };

  const register = (
    name: string,
    email: string,
    password: string,
    role: Role,
  ) => {
    const created = createAccount({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim(),
      role,
      faculty: "",
      status: "Active",
    });

    const user = buildUser(created.role, {
      name: created.name,
      email: created.email,
      title: created.faculty
        ? `${created.faculty} Faculty`
        : ROLE_PROFILES[created.role].title,
      initials: createInitials(created.name),
    });

    setUser(user);
    try {
      localStorage.setItem(ROLE_STORAGE_KEY, created.role);
    } catch {
      // ignore
    }

    return user;
  };

  const updateAccountPassword = (email: string, newPassword: string) => {
    ensureSeedAccounts();
    const accounts = readAccounts();
    const normalizedEmail = email.trim().toLowerCase();
    const exists = accounts.some(
      (account) => account.email.toLowerCase() === normalizedEmail,
    );

    if (!exists) return false;

    writeAccounts(
      accounts.map((account) =>
        account.email.toLowerCase() === normalizedEmail
          ? { ...account, password: newPassword }
          : account,
      ),
    );
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        profileFor,
        authenticateAccount,
        createAccount,
        register,
        updateAccountPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
