import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  TrendingUp,
  ArrowRight,
  Plus
} from 'lucide-react';
import { useFirestore } from '../hooks/useFirestore';
import { Task, Event, Subject } from '../types';
import { cn, formatDate, formatTime } from '../lib/utils';

export const Dashboard: React.FC = () => {
  const { data: tasks } = useFirestore<Task>('tasks');
  const { data: events } = useFirestore<Event>('events');
  const { data: subjects } = useFirestore<Subject>('subjects');

  const todayTasks = tasks.filter(t => t.status !== 'completed').slice(0, 3);
  const upcomingEvents = events.slice(0, 3);

  return (
    <div className="p-8 h-full overflow-y-auto space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Good morning, Student
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            {formatDate(new Date())}
          </p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
          <Plus size={18} />
          Quick Add
        </button>
      </header>

      {/* AI Insights Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-3xl p-6 flex items-center gap-6 relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform duration-500">
          <Sparkles size={120} className="text-indigo-500" />
        </div>
        
        <div className="w-14 h-14 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center shadow-lg">
          <Sparkles size={28} className="text-indigo-500" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">AI Daily Planner</h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm max-w-xl">
            You have a free window between 2:00 PM and 4:00 PM. I recommend focusing on your <span className="text-indigo-500 font-medium">Physics Assignment</span> to stay ahead of the deadline.
          </p>
        </div>
        
        <button className="bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 px-4 py-2 rounded-xl text-sm font-semibold shadow-sm hover:shadow-md transition-all active:scale-95">
          View Plan
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Schedule */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
              <CalendarIcon size={20} className="text-indigo-500" />
              Today's Schedule
            </h2>
            <button className="text-sm text-indigo-500 font-medium hover:underline">View All</button>
          </div>
          
          <div className="space-y-3">
            {upcomingEvents.length > 0 ? upcomingEvents.map((event) => (
              <div key={event.id} className="bg-white/50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-white/20 dark:border-zinc-800/20 flex items-center gap-4 hover:bg-white/80 dark:hover:bg-zinc-800/80 transition-all cursor-pointer group">
                <div className="w-12 text-center">
                  <p className="text-xs font-bold text-zinc-400 uppercase">{formatTime(event.startTime).split(' ')[1]}</p>
                  <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100">{formatTime(event.startTime).split(' ')[0]}</p>
                </div>
                <div className="w-1 h-10 rounded-full bg-indigo-500" />
                <div className="flex-1">
                  <h4 className="font-semibold text-zinc-800 dark:text-zinc-100">{event.title}</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{event.description || 'No description'}</p>
                </div>
                <ArrowRight size={16} className="text-zinc-300 group-hover:text-indigo-500 transition-colors" />
              </div>
            )) : (
              <div className="text-center py-10 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
                <p className="text-zinc-400 text-sm">No events scheduled for today.</p>
              </div>
            )}
          </div>
        </div>

        {/* Priority Tasks */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
              <CheckCircle2 size={20} className="text-purple-500" />
              Priority Tasks
            </h2>
          </div>
          
          <div className="space-y-3">
            {todayTasks.length > 0 ? todayTasks.map((task) => (
              <div key={task.id} className="bg-white/50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-white/20 dark:border-zinc-800/20 flex items-center gap-3 hover:bg-white/80 dark:hover:bg-zinc-800/80 transition-all cursor-pointer group">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-orange-500' : 'bg-blue-500'
                )} />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-zinc-800 dark:text-zinc-100 line-clamp-1">{task.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock size={12} className="text-zinc-400" />
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Due Today</span>
                  </div>
                </div>
                <button className="w-6 h-6 rounded-full border border-zinc-200 dark:border-zinc-700 flex items-center justify-center hover:bg-indigo-500 hover:border-indigo-500 transition-all group-hover:scale-110">
                  <CheckCircle2 size={14} className="text-transparent group-hover:text-white" />
                </button>
              </div>
            )) : (
              <div className="text-center py-10 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
                <p className="text-zinc-400 text-sm">All caught up!</p>
              </div>
            )}
          </div>

          {/* Productivity Score */}
          <div className="bg-zinc-900 dark:bg-zinc-100 p-6 rounded-3xl text-white dark:text-zinc-900">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Productivity Score</p>
                <h4 className="text-3xl font-bold mt-1">84%</h4>
              </div>
              <div className="p-2 bg-white/10 dark:bg-zinc-900/10 rounded-lg">
                <TrendingUp size={20} className="text-green-400" />
              </div>
            </div>
            <div className="w-full h-2 bg-white/20 dark:bg-zinc-900/20 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '84%' }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-indigo-400" 
              />
            </div>
            <p className="text-[10px] mt-3 text-zinc-400 dark:text-zinc-500 font-medium">
              You're 12% more productive than last week! Keep it up.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
