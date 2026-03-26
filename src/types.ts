export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  theme: 'light' | 'dark' | 'system';
  energyLevel: 'morning' | 'night' | 'balanced';
  createdAt: string;
}

export interface Subject {
  id: string;
  uid: string;
  name: string;
  color: string;
  icon: string;
  createdAt: string;
}

export interface Event {
  id: string;
  uid: string;
  subjectId?: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  type: 'class' | 'exam' | 'study' | 'other';
  isRecurring: boolean;
  recurrenceRule?: string;
  createdAt: string;
}

export interface Task {
  id: string;
  uid: string;
  subjectId?: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  isRescheduled: boolean;
  createdAt: string;
}

export interface Note {
  id: string;
  uid: string;
  subjectId?: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export type ViewType = 'dashboard' | 'calendar' | 'tasks' | 'notes' | 'focus' | 'analytics';
