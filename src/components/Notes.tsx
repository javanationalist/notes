import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  FileText, 
  MoreVertical, 
  Trash2, 
  Edit3,
  BookOpen,
  Clock
} from 'lucide-react';
import { useFirestore } from '../hooks/useFirestore';
import { Note, Subject } from '../types';
import { cn, formatDate } from '../lib/utils';

export const Notes: React.FC = () => {
  const { data: notes, add, update, remove } = useFirestore<Note>('notes');
  const { data: subjects } = useFirestore<Subject>('subjects');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex bg-white/30 dark:bg-zinc-900/30">
      {/* Notes List Sidebar */}
      <div className="w-80 border-r border-white/10 dark:border-zinc-800/20 flex flex-col bg-white/20 dark:bg-zinc-900/20">
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Notes</h2>
            <button className="p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all active:scale-95">
              <Plus size={18} />
            </button>
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input 
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/50 dark:bg-zinc-800/50 border border-white/20 dark:border-zinc-800/20 rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredNotes.map((note) => (
            <button
              key={note.id}
              onClick={() => setSelectedNote(note)}
              className={cn(
                "w-full text-left p-4 rounded-2xl transition-all group relative",
                selectedNote?.id === note.id 
                  ? "bg-white dark:bg-zinc-800 shadow-sm border border-white/50 dark:border-zinc-700/50" 
                  : "hover:bg-white/40 dark:hover:bg-zinc-800/40"
              )}
            >
              <h4 className="font-bold text-zinc-800 dark:text-zinc-100 text-sm truncate pr-4">{note.title}</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                {note.content}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <Clock size={10} className="text-zinc-400" />
                <span className="text-[10px] font-bold text-zinc-400 uppercase">{formatDate(note.updatedAt || note.createdAt)}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Note Editor Area */}
      <div className="flex-1 flex flex-col bg-white/40 dark:bg-zinc-900/40">
        <AnimatePresence mode="wait">
          {selectedNote ? (
            <motion.div 
              key={selectedNote.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 flex flex-col p-12 max-w-4xl mx-auto w-full"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-500/10 rounded-2xl">
                    <BookOpen size={24} className="text-indigo-500" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{selectedNote.title}</h3>
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">Last edited {formatDate(selectedNote.updatedAt || selectedNote.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-3 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-100 hover:bg-white dark:hover:bg-zinc-800 rounded-xl transition-all shadow-sm">
                    <Edit3 size={20} />
                  </button>
                  <button 
                    onClick={() => {
                      remove(selectedNote.id);
                      setSelectedNote(null);
                    }}
                    className="p-3 text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all shadow-sm"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 text-zinc-700 dark:text-zinc-300 leading-relaxed text-lg whitespace-pre-wrap">
                {selectedNote.content}
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
              <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-800 rounded-[32px] flex items-center justify-center mb-6">
                <FileText size={48} className="text-zinc-300" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">Select a note to view</h3>
              <p className="text-zinc-500 max-w-xs mt-2">Choose a note from the sidebar or create a new one to get started.</p>
              <button className="mt-8 flex items-center gap-2 bg-indigo-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-indigo-600 transition-all active:scale-95">
                <Plus size={20} />
                Create New Note
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
