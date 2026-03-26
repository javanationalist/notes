import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, signInWithGoogle, logout } from './firebase';
import { WindowFrame } from './components/WindowFrame';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Calendar } from './components/Calendar';
import { TaskList } from './components/TaskList';
import { FocusMode } from './components/FocusMode';
import { Analytics } from './components/Analytics';
import { Notes } from './components/Notes';
import { AIChat } from './components/AIChat';
import { ViewType } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, Sparkles } from 'lucide-react';

// Placeholder components for now
// (Removed placeholders as they are now imported)

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<ViewType>('dashboard');

  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setActiveView('dashboard');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#F2F2F7] dark:bg-zinc-950 p-4 overflow-hidden relative">
        {/* Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 blur-[120px] rounded-full" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-md bg-white/70 dark:bg-zinc-900/70 backdrop-blur-2xl p-10 rounded-[32px] border border-white/20 dark:border-zinc-800/50 shadow-2xl text-center z-10"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
            <Sparkles size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 tracking-tight">Aura</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mb-10 leading-relaxed">
            The next-generation productivity suite for elite students.
          </p>
          
          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-4 rounded-2xl font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg"
          >
            <LogIn size={20} />
            Continue with Google
          </button>
          
          <p className="mt-8 text-xs text-zinc-400 dark:text-zinc-500">
            By continuing, you agree to Aura's Terms of Service.
          </p>
        </motion.div>
      </div>
    );
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard />;
      case 'calendar': return <Calendar />;
      case 'tasks': return <TaskList />;
      case 'notes': return <Notes />;
      case 'focus': return <FocusMode />;
      case 'analytics': return <Analytics />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="h-screen w-screen bg-[#F2F2F7] dark:bg-zinc-950 p-4 lg:p-8 flex items-center justify-center overflow-hidden relative">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />

      <WindowFrame title={`Aura — ${activeView.charAt(0).toUpperCase() + activeView.slice(1)}`}>
        <Sidebar 
          activeView={activeView} 
          onViewChange={setActiveView} 
          user={user} 
          onLogout={handleLogout} 
        />
        <main className="flex-1 overflow-hidden relative bg-white/40 dark:bg-zinc-900/40">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, x: 10, filter: 'blur(10px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -10, filter: 'blur(10px)' }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="h-full w-full"
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </WindowFrame>
      <AIChat />
    </div>
  );
}
