export type AppNotification = {
  id: number;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
};

const STORAGE_KEY = 'edulink_notifications';

export function readNotifications(): AppNotification[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeNotifications(notifications: AppNotification[]) {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  } catch {
    // ignore storage failures
  }
}

export function addNotification(notification: Omit<AppNotification, 'id' | 'read' | 'createdAt'>) {
  const nextNotification: AppNotification = {
    id: Date.now(),
    read: false,
    createdAt: new Date().toISOString(),
    ...notification
  };

  const current = readNotifications();
  const updated = [nextNotification, ...current].slice(0, 20);
  writeNotifications(updated);
  return nextNotification;
}

export function markNotificationsRead(ids: number[]) {
  const current = readNotifications();
  const updated = current.map((notification) =>
    ids.includes(notification.id) ? { ...notification, read: true } : notification
  );
  writeNotifications(updated);
  return updated;
}

export function getUnreadCount(notifications: AppNotification[]) {
  return notifications.filter((notification) => !notification.read).length;
}
