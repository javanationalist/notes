import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Award,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const studyData = [
  { day: 'Mon', hours: 4.5 },
  { day: 'Tue', hours: 3.2 },
  { day: 'Wed', hours: 5.8 },
  { day: 'Thu', hours: 2.5 },
  { day: 'Fri', hours: 4.0 },
  { day: 'Sat', hours: 6.2 },
  { day: 'Sun', hours: 3.5 },
];

const subjectData = [
  { name: 'Physics', value: 35, color: '#6366f1' },
  { name: 'Math', value: 25, color: '#a855f7' },
  { name: 'History', value: 20, color: '#ec4899' },
  { name: 'Computer Science', value: 20, color: '#10b981' },
];

export const Analytics: React.FC = () => {
  return (
    <div className="p-8 h-full overflow-y-auto space-y-8 bg-white/30 dark:bg-zinc-900/30">
      <header>
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Analytics</h2>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">Your productivity insights for this week.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Study Time', value: '29.7h', icon: Clock, color: 'text-indigo-500', trend: '+12%', positive: true },
          { label: 'Tasks Completed', value: '42', icon: Target, color: 'text-purple-500', trend: '+5', positive: true },
          { label: 'Avg. Focus Score', value: '88%', icon: TrendingUp, color: 'text-green-500', trend: '-2%', positive: false },
          { label: 'Deep Work Sessions', value: '18', icon: Award, color: 'text-pink-500', trend: '+3', positive: true },
        ].map((stat, i) => (
          <div key={i} className="bg-white/50 dark:bg-zinc-800/50 p-6 rounded-3xl border border-white/20 dark:border-zinc-800/20 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-3 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm", stat.color)}>
                <stat.icon size={20} />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                stat.positive ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
              )}>
                {stat.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.trend}
              </div>
            </div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{stat.label}</p>
            <h4 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mt-1">{stat.value}</h4>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Study Hours Chart */}
        <div className="bg-white/50 dark:bg-zinc-800/50 p-8 rounded-[32px] border border-white/20 dark:border-zinc-800/20 shadow-sm">
          <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-8">Weekly Study Hours</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={studyData}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#6366f1', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="hours" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Distribution */}
        <div className="bg-white/50 dark:bg-zinc-800/50 p-8 rounded-[32px] border border-white/20 dark:border-zinc-800/20 shadow-sm">
          <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-8">Subject Distribution</h3>
          <div className="h-64 w-full flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subjectData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {subjectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-48 space-y-3">
              {subjectData.map((subject, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: subject.color }} />
                    <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{subject.name}</span>
                  </div>
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-100">{subject.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import { cn } from '../lib/utils';
