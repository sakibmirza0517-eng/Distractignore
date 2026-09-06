export interface VideoItem {
  id: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
  duration?: string;
  topic?: string;
  description?: string;
  publishedAt?: string;
  customNotes?: string;
  priority?: 'High' | 'Medium' | 'Low';
  savedAt?: number;
  tags?: string[];
}

export interface TaskItem {
  id: string;
  title: string;
  time: string;
  completed: boolean;
  dueDate?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  progress: number; // 0 - 100
  videoId?: string;
  updatedAt?: string;
}

export interface UserProfile {
  name: string;
  email?: string;
  avatarUrl: string;
  status: string;
  streakDays: number;
  dailyGoalHours: number;
}

export interface WeeklyActivityDay {
  day: string; // 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'
  hours: number;
  heightPct?: number;
}

export interface MotivationQuote {
  quote: string;
  author: string;
  bgImageUrl?: string;
}

export interface StudyNote {
  id: string;
  videoId: string;
  videoTitle: string;
  timestamp: number; // in seconds
  formattedTime: string; // e.g. "04:15"
  text: string;
  createdAt: number;
}

export interface StudyPlaylist {
  id: string;
  title: string;
  subject: string;
  description?: string;
  videoIds: string[];
  createdAt: number;
}

export interface ExamCountdownData {
  id: string;
  subjectName: string;
  examDate: string; // YYYY-MM-DD
  targetGrade?: string;
  notes?: string;
}

export interface StudySessionStats {
  totalMinutesStudied: number;
  completedPomodoros: number;
  streakDays: number;
  lastStudiedDate: string;
}

export type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

export interface RoomTimerState {
  isRunning: boolean;
  mode: TimerMode;
  remainingSeconds: number;
  totalSeconds: number;
  updatedAt: number;
}

export interface CuratedCategory {
  category: string;
  icon: string;
  description: string;
  videos: VideoItem[];
}

