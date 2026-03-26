import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Coffee, 
  Brain, 
  Music, 
  Volume2, 
  VolumeX,
  Settings,
  Sparkles
} from 'lucide-react';
import { cn } from '../lib/utils';

export const FocusMode: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play sound notification here
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const switchMode = (newMode: 'focus' | 'break') => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (timeLeft / (mode === 'focus' ? 25 * 60 : 5 * 60)) * 100;

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-indigo-500/5 to-purple-500/5">
      <div className="w-full max-w-2xl flex flex-col items-center">
        {/* Mode Selector */}
        <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-2xl mb-12 shadow-sm">
          <button 
            onClick={() => switchMode('focus')}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
              mode === 'focus' ? "bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-zinc-500"
            )}
          >
            <Brain size={18} />
            Focus Session
          </button>
          <button 
            onClick={() => switchMode('break')}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
              mode === 'break' ? "bg-white dark:bg-zinc-700 text-purple-600 dark:text-purple-400 shadow-sm" : "text-zinc-500"
            )}
          >
            <Coffee size={18} />
            Short Break
          </button>
        </div>

        {/* Timer Display */}
        <div className="relative w-80 h-80 flex items-center justify-center mb-12">
          {/* Progress Circle */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="160"
              cy="160"
              r="150"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-zinc-100 dark:text-zinc-800"
            />
            <motion.circle
              cx="160"
              cy="160"
              r="150"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={2 * Math.PI * 150}
              initial={{ strokeDashoffset: 2 * Math.PI * 150 }}
              animate={{ strokeDashoffset: (2 * Math.PI * 150) * (progress / 100) }}
              transition={{ duration: 0.5, ease: "linear" }}
              className={cn(
                "transition-colors duration-500",
                mode === 'focus' ? "text-indigo-500" : "text-purple-500"
              )}
            />
          </svg>

          <div className="text-center z-10">
            <motion.h2 
              key={timeLeft}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-7xl font-bold text-zinc-900 dark:text-zinc-100 font-mono tracking-tighter"
            >
              {formatTime(timeLeft)}
            </motion.h2>
            <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs mt-2">
              {isActive ? 'Keep going' : 'Ready to focus?'}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6 mb-12">
          <button 
            onClick={resetTimer}
            className="p-4 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-all active:scale-90"
          >
            <RotateCcw size={24} />
          </button>
          
          <button 
            onClick={toggleTimer}
            className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl transition-all active:scale-95",
              mode === 'focus' ? "bg-indigo-500 shadow-indigo-500/30" : "bg-purple-500 shadow-purple-500/30"
            )}
          >
            {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
          </button>

          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="p-4 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-all active:scale-90"
          >
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>
        </div>

        {/* AI Focus Tip */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/50 dark:bg-zinc-800/50 p-6 rounded-3xl border border-white/20 dark:border-zinc-800/20 flex items-center gap-4 max-w-md"
        >
          <div className="p-3 bg-indigo-500/10 rounded-2xl">
            <Sparkles size={20} className="text-indigo-500" />
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed italic">
            "Your brain is most effective in 25-minute bursts. During this session, try to eliminate all digital distractions."
          </p>
        </motion.div>
      </div>
    </div>
  );
};
