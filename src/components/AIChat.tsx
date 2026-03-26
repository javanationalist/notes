import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Send, 
  X, 
  Bot, 
  User,
  Brain,
  Calendar,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { chatWithAssistant } from '../services/gemini';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm Aura, your personal productivity assistant. How can I help you optimize your study schedule today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));
      
      const response = await chatWithAssistant(history as any, userMessage);
      setMessages(prev => [...prev, { role: 'assistant', content: response || "I'm sorry, I couldn't process that request." }]);
    } catch (error) {
      console.error("AI Chat Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-indigo-500/40 hover:scale-110 active:scale-95 transition-all z-40 group"
      >
        <Sparkles size={28} className="group-hover:rotate-12 transition-transform" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900" />
      </button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 400, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 400, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-8 bottom-8 right-8 w-[400px] bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl rounded-[32px] border border-white/20 dark:border-zinc-800/50 shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 dark:border-zinc-800/20 flex items-center justify-between bg-white/30 dark:bg-zinc-800/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-lg">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-100">Aura AI</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Always Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 hover:bg-white/50 dark:hover:bg-zinc-800/50 rounded-xl transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((msg, i) => (
                <div key={i} className={cn(
                  "flex gap-3",
                  msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                )}>
                  <div className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm",
                    msg.role === 'user' ? "bg-zinc-100 dark:bg-zinc-800" : "bg-indigo-500 text-white"
                  )}>
                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div className={cn(
                    "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed",
                    msg.role === 'user' 
                      ? "bg-indigo-500 text-white rounded-tr-none" 
                      : "bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 shadow-sm rounded-tl-none border border-white/50 dark:border-zinc-700/50"
                  )}>
                    <div className="markdown-body">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500 flex items-center justify-center text-white shadow-sm">
                    <Bot size={14} />
                  </div>
                  <div className="bg-white dark:bg-zinc-800 p-4 rounded-2xl rounded-tl-none border border-white/50 dark:border-zinc-700/50">
                    <div className="flex gap-1">
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="px-6 py-2 flex gap-2 overflow-x-auto no-scrollbar">
              {[
                { icon: Brain, label: 'Study Tip' },
                { icon: Calendar, label: 'Plan Day' },
                { icon: CheckCircle2, label: 'Tasks' },
              ].map((action, i) => (
                <button 
                  key={i}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/50 dark:bg-zinc-800/50 border border-white/20 dark:border-zinc-800/20 rounded-full text-[10px] font-bold text-zinc-600 dark:text-zinc-400 whitespace-nowrap hover:bg-white dark:hover:bg-zinc-700 transition-all"
                >
                  <action.icon size={12} />
                  {action.label}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-6 pt-2">
              <div className="relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask Aura anything..."
                  className="w-full bg-white dark:bg-zinc-800 border border-white/20 dark:border-zinc-800/20 rounded-2xl py-4 pl-4 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none shadow-sm"
                  rows={1}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 disabled:opacity-50 disabled:hover:bg-indigo-500 transition-all active:scale-90"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
