import React from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Calendar, 
  CheckSquare, 
  FileText, 
  Focus, 
  BarChart3, 
  Settings,
  LogOut,
  User
} from 'lucide-react';
import { cn } from '../lib/utils';
import { ViewType } from '../types';

interface SidebarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  user: any;
  onLogout: () => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'calendar', label: 'Schedule', icon: Calendar },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'notes', label: 'Notes', icon: FileText },
  { id: 'focus', label: 'Focus', icon: Focus },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
] as const;

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, user, onLogout }) => {
  return (
    <div className="w-64 h-full bg-white/20 dark:bg-zinc-900/20 border-r border-white/10 dark:border-zinc-800/20 flex flex-col p-4">
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-lg">A</span>
        </div>
        <span className="font-semibold text-zinc-800 dark:text-zinc-100 tracking-tight">Aura</span>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as ViewType)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative",
                isActive 
                  ? "bg-white/50 dark:bg-zinc-800/50 text-indigo-600 dark:text-indigo-400 shadow-sm" 
                  : "text-zinc-500 dark:text-zinc-400 hover:bg-white/30 dark:hover:bg-zinc-800/30 hover:text-zinc-800 dark:hover:text-zinc-200"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav"
                  className="absolute left-0 w-1 h-4 bg-indigo-500 rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon size={18} className={cn("transition-transform duration-200 group-hover:scale-110", isActive && "text-indigo-500")} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-white/10 dark:border-zinc-800/20">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="User" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <User size={16} className="text-zinc-500" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100 truncate">
              {user?.displayName || 'Student'}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
              {user?.email}
            </p>
          </div>
        </div>
        
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Log Out</span>
        </button>
      </div>
    </div>
  );
};
