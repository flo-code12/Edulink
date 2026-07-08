export type Message = {
  id: number;
  fromMe: boolean;
  text: string;
  time: string;
};

export type MessageThread = {
  id: number;
  name: string;
  role: string;
  initials: string;
  color: string;
  preview: string;
  unread: number;
  messages: Message[];
};

const STORAGE_KEY = 'edulink_message_threads';

export function readMessageThreads(): MessageThread[] {
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

export function writeMessageThreads(threads: MessageThread[]) {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
  } catch {
    // ignore storage failures
  }
}

export function addMessageToThread(input: {
  name: string;
  role: string;
  initials: string;
  color: string;
  text: string;
  fromMe?: boolean;
}) {
  const threads = readMessageThreads();
  const now = new Date();
  const message: Message = {
    id: Date.now(),
    fromMe: input.fromMe ?? true,
    text: input.text,
    time: now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  };

  const existingIndex = threads.findIndex((thread) => thread.name === input.name);
  const nextThreads = [...threads];

  if (existingIndex >= 0) {
    const existing = nextThreads[existingIndex];
    nextThreads[existingIndex] = {
      ...existing,
      preview: input.text,
      unread: existing.unread + 1,
      messages: [...existing.messages, message]
    };
  } else {
    nextThreads.unshift({
      id: Date.now(),
      name: input.name,
      role: input.role,
      initials: input.initials,
      color: input.color,
      preview: input.text,
      unread: 1,
      messages: [message]
    });
  }

  writeMessageThreads(nextThreads);
  return nextThreads;
}
