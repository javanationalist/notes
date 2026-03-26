import React from 'react';
import { motion } from 'motion/react';

interface WindowFrameProps {
  children: React.ReactNode;
  title?: string;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({ children, title }) => {
  return (
    <div className="flex flex-col h-full w-full bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-zinc-800/50 shadow-2xl overflow-hidden">
      {/* macOS Title Bar */}
      <div className="h-10 flex items-center px-4 bg-white/30 dark:bg-zinc-800/30 border-b border-white/10 dark:border-zinc-800/20 select-none">
        <div className="flex gap-2 mr-4">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
          <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
        </div>
        {title && (
          <div className="flex-1 text-center text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {title}
          </div>
        )}
        <div className="w-16" /> {/* Spacer for balance */}
      </div>
      
      {/* Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {children}
      </div>
    </div>
  );
};
