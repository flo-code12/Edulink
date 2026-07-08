import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Send,
  FileText,
  BrainCircuit,
  GraduationCap,
  ChevronDown,
} from "lucide-react";
type Message = {
  id: string;
  sender: "user" | "ai";
  text: string;
  isTyping?: boolean;
};
export function EduAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: "Hi John! I'm EduAI. How can I help you with your studies today?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const handleSend = (text: string = inputValue) => {
    if (!text.trim()) return;
    const newUserMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text,
    };
    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue("");
    // Simulate AI typing
    const typingId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      {
        id: typingId,
        sender: "ai",
        text: "",
        isTyping: true,
      },
    ]);
    setTimeout(() => {
      setMessages((prev) => prev.filter((m) => m.id !== typingId));
      let aiResponse =
        "I can certainly help with that. Let me analyze your course materials...";
      if (text.toLowerCase().includes("quiz")) {
        aiResponse =
          "I've generated a 5-question practice quiz based on your recent CS401 lectures on Neural Networks. Would you like to start?";
      } else if (text.toLowerCase().includes("summarize")) {
        aiResponse =
          "Here's a summary of Chapter 4: The chapter covers the fundamentals of backpropagation, detailing the chain rule application in deep networks and common pitfalls like vanishing gradients.";
      }
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          sender: "ai",
          text: aiResponse,
        },
      ]);
    }, 1500);
  };
  const quickActions = [
    {
      icon: <BrainCircuit className="w-4 h-4" />,
      label: "Generate Quiz",
      prompt: "Can you generate a practice quiz for my next CS401 class?",
    },
    {
      icon: <FileText className="w-4 h-4" />,
      label: "Summarize PDF",
      prompt: "Please summarize the latest reading assignment for UX305.",
    },
    {
      icon: <GraduationCap className="w-4 h-4" />,
      label: "Study Plan",
      prompt: "Help me create a study plan for my midterms next week.",
    },
  ];

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        className="fixed bottom-6 right-6 w-14 h-14 bg-brand-blue text-white rounded-full shadow-float flex items-center justify-center hover:bg-brand-blueDark transition-colors z-50"
        whileHover={{
          scale: 1.05,
        }}
        whileTap={{
          scale: 0.95,
        }}
        onClick={() => setIsOpen(true)}
        initial={false}
        animate={{
          scale: isOpen ? 0 : 1,
          opacity: isOpen ? 0 : 1,
        }}
      >
        <Sparkles className="w-6 h-6" />
      </motion.button>

      {/* AI Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.95,
            }}
            transition={{
              duration: 0.2,
            }}
            className="fixed bottom-6 right-6 w-full max-w-[380px] h-[600px] max-h-[80vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-brand-blue to-brand-blueDark text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Edu AI</h3>
                  <p className="text-xs text-blue-100">
                    Your personal study assistant
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-[#0B1120]/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.sender === "user" ? "bg-brand-blue text-white rounded-br-sm" : "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-sm shadow-sm"}`}
                  >
                    {msg.isTyping ? (
                      <div className="flex gap-1 items-center h-5 px-1">
                        <motion.div
                          className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                          animate={{
                            y: [0, -4, 0],
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.6,
                            delay: 0,
                          }}
                        />

                        <motion.div
                          className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                          animate={{
                            y: [0, -4, 0],
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.6,
                            delay: 0.2,
                          }}
                        />

                        <motion.div
                          className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                          animate={{
                            y: [0, -4, 0],
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.6,
                            delay: 0.4,
                          }}
                        />
                      </div>
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-2 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(action.prompt)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium whitespace-nowrap transition-colors"
                >
                  {action.icon}
                  {action.label}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="relative flex items-center"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask EduAI anything..."
                  className="w-full pl-4 pr-12 py-3 bg-gray-100 dark:bg-gray-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-brand-blue dark:text-white placeholder-gray-500 transition-all"
                />

                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="absolute right-2 p-1.5 bg-brand-blue text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-blueDark transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
