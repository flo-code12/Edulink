import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Send, Search } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { useAuth } from '../components/AuthProvider';
type Msg = {
  id: number;
  fromMe: boolean;
  text: string;
  time: string;
};
type Thread = {
  id: number;
  name: string;
  role: string;
  initials: string;
  color: string;
  preview: string;
  unread: number;
  messages: Msg[];
};
const studentThreads: Thread[] = [
  {
    id: 1,
    name: 'John Doe',
    role: 'Student · CS401',
    initials: 'JD',
    color: 'bg-brand-blue',
    preview: 'I submitted my assignment and wanted to confirm the deadline.',
    unread: 1,
    messages: [
      {
        id: 1,
        fromMe: false,
        text: 'Hello Dr. Toure, I submitted my assignment and wanted to confirm the deadline.',
        time: '9:12 AM'
      },
      {
        id: 2,
        fromMe: true,
        text: 'Thanks John, your submission is received and I will review it shortly.',
        time: '9:30 AM'
      }
    ]
  },
  {
    id: 2,
    name: 'Maria Santos',
    role: 'Student · CS401',
    initials: 'MS',
    color: 'bg-brand-green',
    preview: 'I would like to ask about the latest quiz feedback.',
    unread: 0,
    messages: [
      {
        id: 1,
        fromMe: false,
        text: 'I would like to ask about the latest quiz feedback.',
        time: 'Yesterday'
      }
    ]
  },
  {
    id: 3,
    name: 'Omar Farah',
    role: 'Student · CS310',
    initials: 'OF',
    color: 'bg-brand-orange',
    preview: 'Can you clarify the submission instructions for the lab?',
    unread: 0,
    messages: [
      {
        id: 1,
        fromMe: false,
        text: 'Can you clarify the submission instructions for the lab?',
        time: 'Mon'
      }
    ]
  }
];

const lecturerThreads: Thread[] = [
  {
    id: 1,
    name: 'Dr. Amina Toure',
    role: 'CS401 Instructor',
    initials: 'AT',
    color: 'bg-brand-blue',
    preview: 'The project deadline is confirmed for tonight.',
    unread: 2,
    messages: [
      {
        id: 1,
        fromMe: false,
        text: 'Hi John, just confirming your project submission for tonight.',
        time: '9:12 AM'
      },
      {
        id: 2,
        fromMe: true,
        text: 'Thanks Dr. Toure, almost done with the final layer tuning.',
        time: '9:30 AM'
      }
    ]
  }
];

export function Messages() {
  const location = useLocation();
  const { user } = useAuth();
  const isLecturer = user?.role === 'lecturer';
  const defaultThreads = isLecturer ? studentThreads : lecturerThreads;
  const [threads, setThreads] = useState<Thread[]>(defaultThreads);
  const [activeId, setActiveId] = useState(defaultThreads[0]?.id ?? 1);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const active = threads.find((t) => t.id === activeId)!;
  useEffect(() => {
    const nextThreads = isLecturer ? studentThreads : lecturerThreads;
    setThreads(nextThreads);

    const studentParam = new URLSearchParams(location.search).get('student');
    if (studentParam) {
      const match = nextThreads.find((thread) => thread.name.toLowerCase() === studentParam.toLowerCase());
      if (match) {
        setActiveId(match.id);
        return;
      }

      if (isLecturer) {
        const newThread: Thread = {
          id: Date.now(),
          name: studentParam,
          role: 'Student',
          initials: studentParam.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase(),
          color: 'bg-brand-blue',
          preview: 'New conversation',
          unread: 0,
          messages: []
        };
        setThreads([newThread, ...nextThreads]);
        setActiveId(newThread.id);
        return;
      }
    }

    setActiveId(nextThreads[0]?.id ?? 1);
  }, [isLecturer, location.search]);

  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
    inputRef.current?.focus();
  }, [activeId, threads]);
  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setThreads((prev) =>
    prev.map((t) =>
    t.id === activeId ?
    {
      ...t,
      messages: [
      ...t.messages,
      {
        id: Date.now(),
        fromMe: true,
        text: input,
        time: 'Now'
      }]

    } :
    t
    )
    );
    setInput('');
  };
  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Messages"
        subtitle={isLecturer ? 'Conversations with your students' : 'Conversations with instructors and peers'} />
      
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card border border-gray-100 dark:border-gray-700/50 overflow-hidden flex h-[600px]">
        {/* Thread list */}
        <aside className="w-full max-w-xs border-r border-gray-100 dark:border-gray-700/50 flex flex-col">
          <div className="p-3 border-b border-gray-100 dark:border-gray-700/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                placeholder="Search messages"
                aria-label="Search messages"
                className="w-full pl-9 pr-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm border-none focus:ring-2 focus:ring-brand-blue dark:text-white" />
              
            </div>
          </div>
          <div className="overflow-y-auto flex-1">
            {threads.map((t) =>
            <button
              key={t.id}
              onClick={() => {
                setActiveId(t.id);
                setThreads((prev) =>
                prev.map((x) =>
                x.id === t.id ?
                {
                  ...x,
                  unread: 0
                } :
                x
                )
                );
              }}
              className={`w-full text-left p-3 flex gap-3 items-center border-l-2 transition-colors ${t.id === activeId ? 'border-brand-blue bg-brand-blue/5' : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-700/30'}`}>
              
                <div
                className={`w-10 h-10 rounded-full ${t.color} text-white flex items-center justify-center text-sm font-semibold shrink-0`}>
                
                  {t.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {t.name}
                    </p>
                    {t.unread > 0 &&
                  <span className="ml-2 bg-brand-blue text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shrink-0">
                        {t.unread}
                      </span>
                  }
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {t.preview}
                  </p>
                </div>
              </button>
            )}
          </div>
        </aside>

        {/* Conversation */}
        <section className="flex-1 flex flex-col min-w-0">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700/50 flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full ${active.color} text-white flex items-center justify-center text-sm font-semibold`}>
              
              {active.initials}
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {active.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {active.role}
              </p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50 dark:bg-[#0B1120]/40">
            {active.messages.map((m) =>
            <div
              key={m.id}
              className={`flex ${m.fromMe ? 'justify-end' : 'justify-start'}`}>
              
                <div
                className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm ${m.fromMe ? 'bg-brand-blue text-white rounded-br-sm' : 'bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 text-gray-800 dark:text-gray-100 rounded-bl-sm'}`}>
                
                  <p>{m.text}</p>
                  <p
                  className={`text-[10px] mt-1 ${m.fromMe ? 'text-blue-100' : 'text-gray-400'}`}>
                  
                    {m.time}
                  </p>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
          <form
            onSubmit={send}
            className="p-3 border-t border-gray-100 dark:border-gray-700/50 flex gap-2">
            
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message…"
              aria-label="Type a message"
              className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-sm border-none focus:ring-2 focus:ring-brand-blue dark:text-white" />
            
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-4 bg-brand-blue text-white rounded-xl disabled:opacity-50 hover:bg-brand-blueDark transition-colors"
              aria-label="Send message">
              
              <Send className="w-4 h-4" />
            </button>
          </form>
        </section>
      </div>
    </div>);

}