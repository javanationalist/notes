import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Flag, 
  MoreVertical,
  Calendar as CalendarIcon,
  Trash2
} from 'lucide-react';
import { useFirestore } from '../hooks/useFirestore';
import { Task, Subject } from '../types';
import { cn, formatDate } from '../lib/utils';

export const TaskList: React.FC = () => {
  const { data: tasks, add, update, remove } = useFirestore<Task>('tasks');
  const { data: subjects } = useFirestore<Subject>('subjects');
  const [filter, setFilter] = useState<'all' | 'todo' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || (filter === 'todo' && task.status !== 'completed') || (filter === 'completed' && task.status === 'completed');
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const toggleTask = (task: Task) => {
    update(task.id, { status: task.status === 'completed' ? 'todo' : 'completed' });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-orange-500';
      case 'low': return 'text-blue-500';
      default: return 'text-zinc-400';
    }
  };

  return (
    <div className="h-full flex flex-col bg-white/30 dark:bg-zinc-900/30">
      <header className="p-8 pb-4 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Tasks</h2>
          <button className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl font-medium transition-all shadow-lg active:scale-95">
            <Plus size={18} />
            New Task
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input 
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/50 dark:bg-zinc-800/50 border border-white/20 dark:border-zinc-800/20 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
          <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1">
            <button 
              onClick={() => setFilter('all')}
              className={cn("px-4 py-1.5 text-xs font-semibold rounded-lg transition-all", filter === 'all' ? "bg-white dark:bg-zinc-700 shadow-sm" : "text-zinc-500")}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('todo')}
              className={cn("px-4 py-1.5 text-xs font-semibold rounded-lg transition-all", filter === 'todo' ? "bg-white dark:bg-zinc-700 shadow-sm" : "text-zinc-500")}
            >
              To Do
            </button>
            <button 
              onClick={() => setFilter('completed')}
              className={cn("px-4 py-1.5 text-xs font-semibold rounded-lg transition-all", filter === 'completed' ? "bg-white dark:bg-zinc-700 shadow-sm" : "text-zinc-500")}
            >
              Done
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 pt-0">
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredTasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={cn(
                  "group bg-white/50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-white/20 dark:border-zinc-800/20 flex items-center gap-4 hover:bg-white/80 dark:hover:bg-zinc-800/80 transition-all",
                  task.status === 'completed' && "opacity-60"
                )}
              >
                <button 
                  onClick={() => toggleTask(task)}
                  className="text-zinc-400 hover:text-indigo-500 transition-colors"
                >
                  {task.status === 'completed' ? (
                    <CheckCircle2 size={24} className="text-indigo-500" />
                  ) : (
                    <Circle size={24} />
                  )}
                </button>
                
                <div className="flex-1 min-w-0">
                  <h4 className={cn(
                    "font-semibold text-zinc-800 dark:text-zinc-100 transition-all",
                    task.status === 'completed' && "line-through text-zinc-500"
                  )}>
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-4 mt-1">
                    {task.dueDate && (
                      <div className="flex items-center gap-1.5">
                        <CalendarIcon size={12} className="text-zinc-400" />
                        <span className="text-[10px] font-bold text-zinc-400 uppercase">{formatDate(task.dueDate)}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <Flag size={12} className={getPriorityColor(task.priority)} />
                      <span className="text-[10px] font-bold text-zinc-400 uppercase">{task.priority}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => remove(task.id)}
                    className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button className="p-2 text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-all">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredTasks.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} className="text-zinc-300" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">No tasks found</h3>
              <p className="text-zinc-500 text-sm">You're all caught up or try a different filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
