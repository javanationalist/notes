import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  MoreVertical,
  Clock,
  MapPin,
  Calendar as CalendarIcon
} from 'lucide-react';
import { format, addDays, startOfWeek, isSameDay, addWeeks, subWeeks } from 'date-fns';
import { useFirestore } from '../hooks/useFirestore';
import { Event, Subject } from '../types';
import { cn } from '../lib/utils';

export const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { data: events } = useFirestore<Event>('events');
  const { data: subjects } = useFirestore<Subject>('subjects');

  const startDate = startOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));

  const hours = Array.from({ length: 15 }).map((_, i) => i + 8); // 8 AM to 10 PM

  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(new Date(event.startTime), day));
  };

  const getSubjectColor = (subjectId?: string) => {
    if (!subjectId) return 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700';
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? `bg-${subject.color}-500/10 border-${subject.color}-500/30 text-${subject.color}-600 dark:text-${subject.color}-400` : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400';
  };

  return (
    <div className="h-full flex flex-col bg-white/30 dark:bg-zinc-900/30">
      {/* Header */}
      <header className="p-6 border-b border-white/10 dark:border-zinc-800/20 flex items-center justify-between bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
            <button 
              onClick={() => setCurrentDate(subWeeks(currentDate, 1))}
              className="p-1 hover:bg-white dark:hover:bg-zinc-700 rounded transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 text-xs font-semibold hover:bg-white dark:hover:bg-zinc-700 rounded transition-colors"
            >
              Today
            </button>
            <button 
              onClick={() => setCurrentDate(addWeeks(currentDate, 1))}
              className="p-1 hover:bg-white dark:hover:bg-zinc-700 rounded transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
            <button className="px-3 py-1 text-xs font-semibold bg-white dark:bg-zinc-700 shadow-sm rounded transition-colors">Week</button>
            <button className="px-3 py-1 text-xs font-semibold text-zinc-500 hover:bg-white/50 dark:hover:bg-zinc-700/50 rounded transition-colors">Day</button>
          </div>
          <button className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl font-medium transition-all shadow-lg active:scale-95">
            <Plus size={18} />
            Add Event
          </button>
        </div>
      </header>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto relative">
        <div className="min-w-[800px] h-full flex flex-col">
          {/* Days Header */}
          <div className="flex border-b border-white/10 dark:border-zinc-800/20 sticky top-0 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md z-10">
            <div className="w-20 border-r border-white/10 dark:border-zinc-800/20" />
            {weekDays.map((day, i) => (
              <div key={i} className="flex-1 p-4 text-center border-r border-white/10 dark:border-zinc-800/20 last:border-r-0">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{format(day, 'EEE')}</p>
                <p className={cn(
                  "text-xl font-bold mt-1 w-10 h-10 flex items-center justify-center mx-auto rounded-full transition-colors",
                  isSameDay(day, new Date()) ? "bg-indigo-500 text-white" : "text-zinc-800 dark:text-zinc-200"
                )}>
                  {format(day, 'd')}
                </p>
              </div>
            ))}
          </div>

          {/* Time Grid */}
          <div className="flex-1 flex relative">
            {/* Time Labels */}
            <div className="w-20 border-r border-white/10 dark:border-zinc-800/20 flex flex-col">
              {hours.map((hour) => (
                <div key={hour} className="h-24 p-2 text-right border-b border-white/5 dark:border-zinc-800/5">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">
                    {hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
                  </span>
                </div>
              ))}
            </div>

            {/* Day Columns */}
            {weekDays.map((day, i) => {
              const dayEvents = getEventsForDay(day);
              return (
                <div key={i} className="flex-1 border-r border-white/10 dark:border-zinc-800/20 last:border-r-0 relative group">
                  {hours.map((hour) => (
                    <div key={hour} className="h-24 border-b border-white/5 dark:border-zinc-800/5 hover:bg-indigo-500/5 transition-colors cursor-pointer" />
                  ))}
                  
                  {/* Events */}
                  {dayEvents.map((event) => {
                    const start = new Date(event.startTime);
                    const end = new Date(event.endTime);
                    const startHour = start.getHours() + start.getMinutes() / 60;
                    const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                    const top = (startHour - 8) * 96; // 96px per hour
                    const height = duration * 96;

                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ top: `${top}px`, height: `${height}px` }}
                        className={cn(
                          "absolute left-1 right-1 rounded-xl p-3 border-l-4 shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all z-20",
                          getSubjectColor(event.subjectId)
                        )}
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-bold truncate pr-2">{event.title}</h4>
                          <MoreVertical size={12} className="opacity-50" />
                        </div>
                        <div className="flex items-center gap-1 mt-1 opacity-70">
                          <Clock size={10} />
                          <span className="text-[10px] font-medium">
                            {format(start, 'h:mm')} - {format(end, 'h:mm')}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
