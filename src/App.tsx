import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  Play, 
  Clock, 
  Bookmark, 
  Settings, 
  CheckSquare, 
  FolderGit2, 
  FileText, 
  BarChart2, 
  Plus, 
  Trash2, 
  Edit2, 
  Volume2, 
  Sparkles, 
  Download, 
  Upload, 
  RotateCcw, 
  Check, 
  AlertCircle,
  Search,
  Flame,
  ArrowRight
} from 'lucide-react';

// Data types
import { 
  VideoItem, 
  StudyNote, 
  TaskItem, 
  ProjectItem, 
  UserProfile, 
  WeeklyActivityDay, 
  MotivationQuote,
  TimerMode 
} from './types';

// Components
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { DashboardView } from './components/DashboardView';
import { TasksView } from './components/TasksView';
import { ProjectsView } from './components/ProjectsView';
import { SavedLecturesView } from './components/SavedLecturesView';
import { VideoPlayer } from './components/VideoPlayer';
import { YouTubeSearchExplorer } from './components/YouTubeSearchExplorer';
import { PomodoroTimer } from './components/PomodoroTimer';
import { StudyNotes } from './components/StudyNotes';
import { ExamCountdown } from './components/ExamCountdown';
import { AmbientMixer } from './components/AmbientMixer';
import { OfflineBanner } from './components/OfflineBanner';
import { useAmbientAudio } from './hooks/useAmbientAudio';

// Modals for Edit & Delete
import { EditSavedModal } from './components/EditSavedModal';
import { EditTaskModal } from './components/EditTaskModal';
import { EditProjectModal } from './components/EditProjectModal';
import { EditNoteModal } from './components/EditNoteModal';
import { EditProfileModal } from './components/EditProfileModal';
import { EditWeeklyHoursModal } from './components/EditWeeklyHoursModal';
import { EditQuoteModal } from './components/EditQuoteModal';

// Static Curated Collections & YouTube ID extractor
import { DEFAULT_CURATED_COLLECTIONS, extractYouTubeId } from './data/curatedData';

// Clean initial empty video placeholder
const EMPTY_VIDEO: VideoItem = {
  id: '',
  title: 'No Lecture Loaded',
  channelTitle: 'Search YouTube or paste a URL to begin distraction-free study',
  duration: '00:00',
  topic: 'Academic Study',
  thumbnail: '',
};

const DEFAULT_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const DEFAULT_PROFILE: UserProfile = {
  name: 'Student',
  email: '',
  status: 'Deep focus, exam prep, continuous learning',
  streakDays: 0,
  dailyGoalHours: 6,
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
};

const DEFAULT_QUOTE: MotivationQuote = {
  quote: 'Discipline is the bridge between goals and success.',
  author: 'Jim Rohn',
  bgImageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
};

// Sanitizer helpers to remove any legacy dummy test items
const isDummyTaskId = (id: string) => ['t1', 't2', 't3', 't4', 't5', 't6'].includes(id);
const isDummyProjectId = (id: string) => ['p1', 'p2', 'p3'].includes(id);
const isDummyNoteId = (id: string) => ['n1', 'n2', 'n3', 'n4'].includes(id);
const isDummyVideoId = (id: string) => ['WUvTyaaNkzM', '8hly31xKli0', 'jfA7m4lKkG4'].includes(id);

// Safe LocalStorage helpers that prevent crashes in private browsing or storage quota errors
const safeGetItem = (key: string): string | null => {
  try {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeSetItem = (key: string, value: string) => {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn(`localStorage write failed for ${key}:`, e);
  }
};

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Toast notification state (in place of window.alert)
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // User Profile State (editable)
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = safeGetItem('bm_user_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            name: parsed.name && parsed.name !== 'Sakib Mirza' ? String(parsed.name) : DEFAULT_PROFILE.name,
            email: parsed.email ? String(parsed.email) : '',
            status: parsed.status ? String(parsed.status) : DEFAULT_PROFILE.status,
            streakDays: typeof parsed.streakDays === 'number' && !isNaN(parsed.streakDays) ? Math.max(0, parsed.streakDays) : 0,
            dailyGoalHours: typeof parsed.dailyGoalHours === 'number' && parsed.dailyGoalHours > 0 ? parsed.dailyGoalHours : 6,
            avatarUrl: parsed.avatarUrl ? String(parsed.avatarUrl) : DEFAULT_PROFILE.avatarUrl,
          };
        }
      } catch {}
    }
    return DEFAULT_PROFILE;
  });

  // Daily Tasks State (empty by default, dummy purged)
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    const saved = safeGetItem('bm_tasks');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed
            .filter((t: TaskItem) => t && t.id && !isDummyTaskId(t.id))
            .map((t: TaskItem) => ({
              id: String(t.id),
              title: String(t.title || 'Untitled Task'),
              time: String(t.time || 'Today'),
              completed: Boolean(t.completed),
            }));
        }
      } catch {}
    }
    return [];
  });

  // Projects State (empty by default, dummy purged)
  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    const saved = safeGetItem('bm_projects');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed
            .filter((p: ProjectItem) => p && p.id && !isDummyProjectId(p.id))
            .map((p: ProjectItem) => ({
              id: String(p.id),
              title: String(p.title || 'Untitled Project'),
              category: String(p.category || 'General'),
              progress: typeof p.progress === 'number' && !isNaN(p.progress) ? Math.min(100, Math.max(0, p.progress)) : 0,
            }));
        }
      } catch {}
    }
    return [];
  });

  // Saved / Bookmarked Lectures State (empty by default, dummy purged)
  const [savedVideos, setSavedVideos] = useState<VideoItem[]>(() => {
    const saved = safeGetItem('maktub_bookmarks');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed
            .filter((v: VideoItem) => v && v.id && !isDummyVideoId(v.id))
            .map((v: VideoItem) => ({
              id: String(v.id),
              title: String(v.title || 'Lecture'),
              channelTitle: String(v.channelTitle || 'YouTube'),
              duration: v.duration ? String(v.duration) : undefined,
              topic: v.topic ? String(v.topic) : undefined,
              description: v.description ? String(v.description) : undefined,
              thumbnail: v.thumbnail ? String(v.thumbnail) : `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
              priority: v.priority || 'Medium',
              customNotes: v.customNotes || '',
            }));
        }
      } catch {}
    }
    return [];
  });

  // Video Player State
  const [currentVideo, setCurrentVideo] = useState<VideoItem>(() => {
    const saved = safeGetItem('maktub_current_video');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id && !isDummyVideoId(parsed.id)) {
          return {
            id: String(parsed.id),
            title: String(parsed.title || 'Lecture'),
            channelTitle: String(parsed.channelTitle || 'YouTube'),
            duration: parsed.duration ? String(parsed.duration) : undefined,
            topic: parsed.topic ? String(parsed.topic) : undefined,
            description: parsed.description ? String(parsed.description) : undefined,
            thumbnail: parsed.thumbnail ? String(parsed.thumbnail) : `https://i.ytimg.com/vi/${parsed.id}/hqdefault.jpg`,
          };
        }
      } catch {}
    }
    return EMPTY_VIDEO;
  });

  const [seekTimestamp, setSeekTimestamp] = useState<number>(0);
  const [isZenMode, setIsZenMode] = useState<boolean>(false);

  // Search & Recommendations State (pre-populated with high-yield fallback topics)
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<VideoItem[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [curatedCategories, setCuratedCategories] = useState<any[]>(DEFAULT_CURATED_COLLECTIONS);

  // Notes State (empty by default, dummy purged)
  const [notes, setNotes] = useState<StudyNote[]>(() => {
    const saved = safeGetItem('maktub_notes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed
            .filter((n: StudyNote) => n && n.id && !isDummyNoteId(n.id))
            .map((n: StudyNote) => ({
              id: String(n.id),
              videoId: String(n.videoId || 'general'),
              videoTitle: String(n.videoTitle || 'Lecture Note'),
              timestamp: typeof n.timestamp === 'number' ? n.timestamp : 0,
              formattedTime: String(n.formattedTime || '00:00'),
              text: String(n.text || ''),
              createdAt: typeof n.createdAt === 'number' ? n.createdAt : Date.now(),
            }));
        }
      } catch {}
    }
    return [];
  });

  // Weekly Activity Hours (Mon to Sun)
  const [thisWeekHours, setThisWeekHours] = useState<WeeklyActivityDay[]>(() => {
    const saved = safeGetItem('maktub_this_week_hours');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 7) {
          return DEFAULT_DAYS.map((day, idx) => {
            const found = parsed.find((r: any) => r && r.day === day) || parsed[idx];
            return { day, hours: typeof found?.hours === 'number' && !isNaN(found.hours) ? Math.max(0, found.hours) : 0 };
          });
        }
      } catch {}
    }
    return DEFAULT_DAYS.map((day) => ({ day, hours: 0 }));
  });

  const [lastWeekHours, setLastWeekHours] = useState<WeeklyActivityDay[]>(() => {
    const saved = safeGetItem('maktub_last_week_hours');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 7) {
          return DEFAULT_DAYS.map((day, idx) => {
            const found = parsed.find((r: any) => r && r.day === day) || parsed[idx];
            return { day, hours: typeof found?.hours === 'number' && !isNaN(found.hours) ? Math.max(0, found.hours) : 0 };
          });
        }
      } catch {}
    }
    return DEFAULT_DAYS.map((day) => ({ day, hours: 0 }));
  });

  // Motivational Quote State
  const [motivationQuote, setMotivationQuote] = useState<MotivationQuote>(() => {
    const saved = safeGetItem('maktub_motivation_quote');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.quote) {
          return {
            quote: String(parsed.quote),
            author: parsed.author ? String(parsed.author) : DEFAULT_QUOTE.author,
            bgImageUrl: parsed.bgImageUrl ? String(parsed.bgImageUrl) : DEFAULT_QUOTE.bgImageUrl,
          };
        }
      } catch {}
    }
    return DEFAULT_QUOTE;
  });

  // Modals Active State
  const [editingSavedVideo, setEditingSavedVideo] = useState<VideoItem | null>(null);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState<boolean>(false);
  const [editingNote, setEditingNote] = useState<StudyNote | null>(null);
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isWeeklyHoursModalOpen, setIsWeeklyHoursModalOpen] = useState<boolean>(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState<boolean>(false);

  // Ambient Audio hook
  const { activeSound, volume, setActiveSound, setVolume, playChime } = useAmbientAudio();

  // Real-time multi-tab BroadcastChannel
  const broadcastRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    try {
      const channel = new BroadcastChannel('maktub_realtime_sync');
      broadcastRef.current = channel;

      channel.onmessage = (event) => {
        const data = event.data;
        if (data.type === 'NEW_NOTE') {
          setNotes((prev) => {
            if (prev.some((n) => n.id === data.note.id)) return prev;
            return [data.note, ...prev];
          });
        } else if (data.type === 'DELETE_NOTE') {
          setNotes((prev) => prev.filter((n) => n.id !== data.noteId));
        } else if (data.type === 'SWITCH_VIDEO') {
          setCurrentVideo(data.video);
        }
      };
    } catch {
      // Sandbox fallback
    }

    return () => {
      if (broadcastRef.current) {
        broadcastRef.current.close();
      }
    };
  }, []);

  // Sync state to LocalStorage safely
  useEffect(() => {
    safeSetItem('maktub_current_video', JSON.stringify(currentVideo));
  }, [currentVideo]);

  useEffect(() => {
    safeSetItem('maktub_bookmarks', JSON.stringify(savedVideos));
  }, [savedVideos]);

  useEffect(() => {
    safeSetItem('maktub_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    safeSetItem('bm_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    safeSetItem('bm_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    safeSetItem('bm_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    safeSetItem('maktub_this_week_hours', JSON.stringify(thisWeekHours));
  }, [thisWeekHours]);

  useEffect(() => {
    safeSetItem('maktub_last_week_hours', JSON.stringify(lastWeekHours));
  }, [lastWeekHours]);

  useEffect(() => {
    safeSetItem('maktub_motivation_quote', JSON.stringify(motivationQuote));
  }, [motivationQuote]);

  // Load Curated categories on initial mount (with safe fallback for static/Vercel hosts)
  useEffect(() => {
    fetch('/api/curated')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data && data.categories && Array.isArray(data.categories) && data.categories.length > 0) {
          setCuratedCategories(data.categories);
        }
      })
      .catch((err) => {
        // Fallback already pre-populated from DEFAULT_CURATED_COLLECTIONS
        console.log('Using static curated collections:', err);
      });
  }, []);

  // Automatically log Pomodoro sessions into today's focus hours
  const handlePomodoroSessionComplete = (mode: TimerMode) => {
    if (mode === 'pomodoro') {
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const todayStr = dayNames[new Date().getDay()];
      setThisWeekHours((prev) =>
        prev.map((d) =>
          d.day === todayStr ? { ...d, hours: +(d.hours + 0.42).toFixed(2) } : d
        )
      );
      showToast('Pomodoro session complete! Added 25 mins focus time to today.');
    }
  };

  // Handle Search Execution (works with both API and offline/Vercel fallback)
  const executeSearch = async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    setActiveTab('curated');

    // If query is an 11-char ID or direct YouTube URL, create a playable card immediately
    const directId = extractYouTubeId(trimmed);
    if (directId) {
      const directVideo: VideoItem = {
        id: directId,
        title: `YouTube Lecture (${directId})`,
        channelTitle: 'YouTube Academic Lecture',
        thumbnail: `https://i.ytimg.com/vi/${directId}/hqdefault.jpg`,
        topic: 'Direct Lecture',
        duration: 'Ready',
        description: 'Directly loaded lecture video.',
      };
      setSearchResults([directVideo]);
      setIsSearching(false);
      return;
    }

    try {
      const res = await fetch(`/api/youtube/search?q=${encodeURIComponent(trimmed)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.results && Array.isArray(data.results) && data.results.length > 0) {
          setSearchResults(data.results);
          setIsSearching(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Backend search unavailable, searching client-side recommendations:', err);
    }

    // Client-side fallback search across curated categories
    const allCuratedVideos: VideoItem[] = (curatedCategories || DEFAULT_CURATED_COLLECTIONS).flatMap(
      (cat: any) => cat.videos || []
    );
    const qLower = trimmed.toLowerCase();
    const matched = allCuratedVideos.filter((v: VideoItem) => {
      return (
        (v.title && v.title.toLowerCase().includes(qLower)) ||
        (v.topic && v.topic.toLowerCase().includes(qLower)) ||
        (v.description && v.description.toLowerCase().includes(qLower)) ||
        (v.channelTitle && v.channelTitle.toLowerCase().includes(qLower))
      );
    });

    if (matched.length > 0) {
      setSearchResults(matched);
    } else {
      setSearchResults(allCuratedVideos.slice(0, 6));
      showToast(`Showing recommendations for "${trimmed}"`);
    }
    setIsSearching(false);
  };

  // Direct paste of YouTube URL or ID (supports both backend and pure client-side on Vercel)
  const handlePasteUrl = async (url: string) => {
    const vidId = extractYouTubeId(url);

    try {
      const res = await fetch(`/api/youtube/video-info?url=${encodeURIComponent(url)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.video) {
          handleSelectVideo(data.video);
          setActiveTab('sanctuary');
          showToast(`Loaded: ${data.video.title}`);
          return;
        }
      }
    } catch (err) {
      console.warn('Backend video info endpoint unavailable, falling back to client-side parsing:', err);
    }

    if (vidId) {
      const fallbackVideo: VideoItem = {
        id: vidId,
        title: `YouTube Lecture (${vidId})`,
        channelTitle: 'YouTube',
        thumbnail: `https://i.ytimg.com/vi/${vidId}/hqdefault.jpg`,
        topic: 'Lecture',
        duration: 'Study Session',
        description: 'Pasted YouTube video ready for distraction-free study with notes and formulas.',
      };
      handleSelectVideo(fallbackVideo);
      setActiveTab('sanctuary');
      showToast('Loaded YouTube lecture!');
    } else {
      showToast('Please verify YouTube URL or 11-character video ID.');
    }
  };

  // Select video to play in Sanctuary
  const handleSelectVideo = (video: VideoItem) => {
    setCurrentVideo(video);
    setSeekTimestamp(0);
    setActiveTab('sanctuary');

    if (broadcastRef.current) {
      broadcastRef.current.postMessage({ type: 'SWITCH_VIDEO', video });
    }
  };

  // Toggle bookmark / saved video
  const handleToggleBookmark = (video: VideoItem) => {
    if (!video || !video.id) return;
    setSavedVideos((prev) => {
      const exists = prev.some((b) => b.id === video.id);
      if (exists) {
        showToast(`Removed from saved library.`);
        return prev.filter((b) => b.id !== video.id);
      } else {
        showToast(`Saved "${video.title}" to library!`);
        return [...prev, { ...video, priority: 'Medium', customNotes: '' }];
      }
    });
  };

  // CRUD for Saved Videos
  const handleUpdateSavedVideo = (updated: VideoItem) => {
    setSavedVideos((prev) =>
      prev.map((v) => (v.id === updated.id ? updated : v))
    );
    showToast('Updated saved lecture notes.');
  };

  const handleDeleteSavedVideo = (id: string) => {
    setSavedVideos((prev) => prev.filter((v) => v.id !== id));
    showToast('Deleted lecture from library.');
  };

  // CRUD for Tasks
  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleSaveTask = (task: TaskItem) => {
    setTasks((prev) => {
      const exists = prev.some((t) => t.id === task.id);
      if (exists) {
        return prev.map((t) => (t.id === task.id ? task : t));
      }
      return [task, ...prev];
    });
    showToast('Task saved.');
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast('Task deleted.');
  };

  const handleAddTaskFromVideo = (video: VideoItem) => {
    const newTask: TaskItem = {
      id: `t-${Date.now()}`,
      title: `Watch: ${video.title}`,
      time: 'Today',
      completed: false,
    };
    handleSaveTask(newTask);
    showToast(`Added "${video.title}" to today's tasks!`);
  };

  // CRUD for Projects
  const handleSaveProject = (project: ProjectItem) => {
    setProjects((prev) => {
      const exists = prev.some((p) => p.id === project.id);
      if (exists) {
        return prev.map((p) => (p.id === project.id ? project : p));
      }
      return [project, ...prev];
    });
    showToast('Project saved.');
  };

  const handleDeleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    showToast('Project deleted.');
  };

  // CRUD for Notes
  const handleAddNote = (timestamp: number, formattedTime: string, text: string) => {
    const newNote: StudyNote = {
      id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      videoId: currentVideo.id || 'general',
      videoTitle: currentVideo.title || 'General Notes',
      timestamp,
      formattedTime,
      text,
      createdAt: Date.now(),
    };

    setNotes((prev) => [newNote, ...prev]);
    showToast('Study note added.');

    if (broadcastRef.current) {
      broadcastRef.current.postMessage({ type: 'NEW_NOTE', note: newNote });
    }
  };

  const handleSaveNote = (note: StudyNote) => {
    setNotes((prev) => {
      const exists = prev.some((n) => n.id === note.id);
      if (exists) {
        return prev.map((n) => (n.id === note.id ? note : n));
      }
      return [note, ...prev];
    });
    showToast('Note updated.');
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    showToast('Note deleted.');
    if (broadcastRef.current) {
      broadcastRef.current.postMessage({ type: 'DELETE_NOTE', noteId });
    }
  };

  const handleJumpToTimestamp = (timestamp: number) => {
    setSeekTimestamp(timestamp);
  };

  // Save weekly hours
  const handleSaveWeeklyHours = (
    thisWeek: WeeklyActivityDay[],
    lastWeek: WeeklyActivityDay[]
  ) => {
    setThisWeekHours(thisWeek);
    setLastWeekHours(lastWeek);
    showToast('Weekly study hours updated.');
  };

  // Save motivational quote
  const handleSaveQuote = (quote: MotivationQuote) => {
    setMotivationQuote(quote);
    showToast('Motivational quote updated.');
  };

  // Clear all data (Clean slate)
  const handleClearAllData = () => {
    setTasks([]);
    setProjects([]);
    setNotes([]);
    setSavedVideos([]);
    setThisWeekHours(DEFAULT_DAYS.map((day) => ({ day, hours: 0 })));
    setLastWeekHours(DEFAULT_DAYS.map((day) => ({ day, hours: 0 })));
    setCurrentVideo(EMPTY_VIDEO);
    localStorage.removeItem('bm_tasks');
    localStorage.removeItem('bm_projects');
    localStorage.removeItem('maktub_notes');
    localStorage.removeItem('maktub_bookmarks');
    localStorage.removeItem('maktub_current_video');
    localStorage.removeItem('maktub_this_week_hours');
    localStorage.removeItem('maktub_last_week_hours');
    showToast('All dummy data cleared! Ready for your own data.');
  };

  // Export data as JSON
  const handleExportData = () => {
    const backup = {
      version: 2,
      exportedAt: new Date().toISOString(),
      userProfile,
      tasks,
      projects,
      notes,
      savedVideos,
      thisWeekHours,
      lastWeekHours,
      motivationQuote,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `maktub-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data exported successfully!');
  };

  // Import data from JSON file
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.userProfile) setUserProfile(parsed.userProfile);
        if (Array.isArray(parsed.tasks)) setTasks(parsed.tasks);
        if (Array.isArray(parsed.projects)) setProjects(parsed.projects);
        if (Array.isArray(parsed.notes)) setNotes(parsed.notes);
        if (Array.isArray(parsed.savedVideos)) setSavedVideos(parsed.savedVideos);
        if (Array.isArray(parsed.thisWeekHours)) setThisWeekHours(parsed.thisWeekHours);
        if (Array.isArray(parsed.lastWeekHours)) setLastWeekHours(parsed.lastWeekHours);
        if (parsed.motivationQuote) setMotivationQuote(parsed.motivationQuote);
        showToast('Data imported successfully!');
      } catch (err) {
        showToast('Failed to parse JSON backup file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const isCurrentBookmarked = Boolean(
    currentVideo.id && savedVideos.some((b) => b.id === currentVideo.id)
  );

  // Analytics totals
  const totalFocusThisWeek = thisWeekHours.reduce((acc, d) => acc + d.hours, 0);
  const totalFocusLastWeek = lastWeekHours.reduce((acc, d) => acc + d.hours, 0);
  const focusDiff = +(totalFocusThisWeek - totalFocusLastWeek).toFixed(1);

  return (
    <div className="min-h-screen bg-[#02040a] text-[#e2e8f0] flex antialiased selection:bg-blue-500/30 selection:text-blue-200">
      {/* Offline Status */}
      <OfflineBanner />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-2xl shadow-blue-500/40 border border-blue-400/40 animate-fade-in">
          <Sparkles className="w-4 h-4 text-blue-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Left Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        tasksCount={tasks.filter((t) => !t.completed).length}
        savedCount={savedVideos.length}
      />

      {/* Main Content Area (Offset by sidebar width on lg screens) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header Bar with YouTube Suggest & User Profile */}
        <TopBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchSubmit={executeSearch}
          onPasteUrl={handlePasteUrl}
          userProfile={userProfile}
          onOpenProfileModal={() => setIsProfileModalOpen(true)}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        {/* View Routing */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
          {/* VIEW 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <DashboardView
              userProfile={userProfile}
              onOpenProfileModal={() => setIsProfileModalOpen(true)}
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onOpenAddTask={() => {
                setEditingTask(null);
                setIsAddTaskModalOpen(true);
              }}
              onEditTask={(task) => {
                setEditingTask(task);
                setIsAddTaskModalOpen(true);
              }}
              onDeleteTask={handleDeleteTask}
              projects={projects}
              onOpenAddProject={() => {
                setEditingProject(null);
                setIsAddProjectModalOpen(true);
              }}
              onEditProject={(proj) => {
                setEditingProject(proj);
                setIsAddProjectModalOpen(true);
              }}
              onDeleteProject={handleDeleteProject}
              notes={notes}
              onOpenAddNote={() => {
                setEditingNote(null);
                setIsAddNoteModalOpen(true);
              }}
              onEditNote={(note) => {
                setEditingNote(note);
                setIsAddNoteModalOpen(true);
              }}
              onDeleteNote={handleDeleteNote}
              currentVideo={currentVideo}
              onSelectTab={setActiveTab}
              onPlayCurrentVideo={() => setActiveTab('sanctuary')}
              isBookmarked={isCurrentBookmarked}
              onToggleBookmark={handleToggleBookmark}
              thisWeekHours={thisWeekHours}
              lastWeekHours={lastWeekHours}
              onOpenEditWeeklyHours={() => setIsWeeklyHoursModalOpen(true)}
              quote={motivationQuote}
              onOpenEditQuote={() => setIsQuoteModalOpen(true)}
            />
          )}

          {/* VIEW 2: SANCTUARY PLAYER MIRROR */}
          {activeTab === 'sanctuary' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Player & Meta */}
                <div className="lg:col-span-8 space-y-4">
                  <VideoPlayer
                    video={currentVideo}
                    initialTimestamp={seekTimestamp}
                    onAddNoteAtTimestamp={(sec, fmt) => handleAddNote(sec, fmt, '')}
                    isZenMode={isZenMode}
                    onToggleZenMode={() => setIsZenMode(!isZenMode)}
                    onPasteUrl={handlePasteUrl}
                  />

                  {/* Video Meta info */}
                  {currentVideo.id && (
                    <div className="p-5 rounded-2xl bg-[#0f1426] border border-white/10 shadow-xl space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <h1 className="text-lg sm:text-xl font-bold text-white">
                            {currentVideo.title}
                          </h1>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {currentVideo.channelTitle} • {currentVideo.duration || 'Lecture Stream'}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleBookmark(currentVideo)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition cursor-pointer border ${
                              isCurrentBookmarked
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow'
                                : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                            }`}
                          >
                            <Bookmark className={`w-3.5 h-3.5 ${isCurrentBookmarked ? 'fill-current' : ''}`} />
                            <span>{isCurrentBookmarked ? 'Saved in Library' : 'Save to Library'}</span>
                          </button>
                        </div>
                      </div>

                      {currentVideo.description && (
                        <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-white/5">
                          {currentVideo.description}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Right Column: Notes & Audio */}
                <div className="lg:col-span-4 space-y-5">
                  <StudyNotes
                    notes={notes}
                    currentVideoId={currentVideo.id}
                    currentVideoTitle={currentVideo.title}
                    onAddNote={handleAddNote}
                    onDeleteNote={handleDeleteNote}
                    onJumpToTimestamp={handleJumpToTimestamp}
                    currentVideoTime={seekTimestamp}
                  />

                  <AmbientMixer
                    activeSound={activeSound}
                    onSelectSound={setActiveSound}
                    volume={volume}
                    onVolumeChange={setVolume}
                  />
                </div>
              </div>
            </div>
          )}

          {/* VIEW 3: YOUTUBE TOPIC SEARCH & RECOMMENDATIONS EXPLORER */}
          {activeTab === 'curated' && (
            <YouTubeSearchExplorer
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSearchSubmit={executeSearch}
              videos={
                searchResults.length > 0
                  ? searchResults
                  : curatedCategories[0]?.videos || []
              }
              isLoading={isSearching}
              onSelectVideo={handleSelectVideo}
              savedVideos={savedVideos}
              onToggleBookmark={handleToggleBookmark}
              onAddTaskFromVideo={handleAddTaskFromVideo}
            />
          )}

          {/* VIEW 4: TASKS MANAGEMENT (Edit & Delete) */}
          {activeTab === 'tasks' && (
            <TasksView
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onOpenAddTask={() => {
                setEditingTask(null);
                setIsAddTaskModalOpen(true);
              }}
              onEditTask={(task) => {
                setEditingTask(task);
                setIsAddTaskModalOpen(true);
              }}
              onDeleteTask={handleDeleteTask}
            />
          )}

          {/* VIEW 5: POMODORO FOCUS */}
          {activeTab === 'pomodoro' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                <PomodoroTimer
                  onPlayChime={playChime}
                  onSessionComplete={handlePomodoroSessionComplete}
                />
                <AmbientMixer
                  activeSound={activeSound}
                  onSelectSound={setActiveSound}
                  volume={volume}
                  onVolumeChange={setVolume}
                />
                <ExamCountdown />
              </div>
            </div>
          )}

          {/* VIEW 6: ANALYTICS (REAL DATA) */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-2xl bg-[#0f1426] border border-white/10 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-indigo-400" />
                    <h2 className="text-lg font-bold text-white">Study Analytics & Focus Efficiency</h2>
                  </div>
                  <button
                    onClick={() => setIsWeeklyHoursModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Study Hours</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                    <span className="text-xs text-slate-400">Total Hours Focused This Week</span>
                    <p className="text-2xl font-bold text-white">{totalFocusThisWeek.toFixed(1)}h</p>
                    <span className={`text-[11px] ${focusDiff >= 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {focusDiff >= 0 ? `+${focusDiff}h compared to last week` : `${focusDiff}h compared to last week`}
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                    <span className="text-xs text-slate-400">Tasks Completed</span>
                    <p className="text-2xl font-bold text-white">
                      {tasks.filter((t) => t.completed).length} / {tasks.length}
                    </p>
                    <span className="text-[11px] text-blue-400">
                      {tasks.length > 0 ? `${Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100)}% complete` : 'No tasks created'}
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                    <span className="text-xs text-slate-400">Active Streak</span>
                    <p className="text-2xl font-bold text-amber-400">{userProfile.streakDays} Days 🔥</p>
                    <button
                      onClick={() => setIsProfileModalOpen(true)}
                      className="text-[11px] text-slate-400 hover:text-white underline"
                    >
                      Update streak
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 7: PROJECTS MANAGEMENT (Edit & Delete) */}
          {activeTab === 'projects' && (
            <ProjectsView
              projects={projects}
              onOpenAddProject={() => {
                setEditingProject(null);
                setIsAddProjectModalOpen(true);
              }}
              onEditProject={(proj) => {
                setEditingProject(proj);
                setIsAddProjectModalOpen(true);
              }}
              onDeleteProject={handleDeleteProject}
            />
          )}

          {/* VIEW 8: NOTES (Edit & Delete Notes) */}
          {activeTab === 'notes' && (
            <div className="space-y-6 pb-12 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0f1426] border border-white/10 shadow-xl">
                <div>
                  <h1 className="text-xl font-bold text-white">Exam Study Notebook</h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Timestamped notes, formula cheat sheets, and lecture summaries.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingNote(null);
                    setIsAddNoteModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow cursor-pointer"
                >
                  + Add Note
                </button>
              </div>

              {notes.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-[#0f1426] border border-white/5 space-y-3 max-w-md mx-auto">
                  <FileText className="w-10 h-10 text-slate-600 mx-auto" />
                  <h3 className="text-sm font-semibold text-white">No Notes Taken Yet</h3>
                  <p className="text-xs text-slate-400">
                    Jot down key points, timestamped lecture concepts, or exam formulas.
                  </p>
                  <button
                    onClick={() => {
                      setEditingNote(null);
                      setIsAddNoteModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition cursor-pointer shadow"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Your First Note</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-5 rounded-2xl bg-[#0f1426] border border-white/5 hover:border-white/15 transition space-y-3 shadow-lg group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              setCurrentVideo({
                                id: note.videoId,
                                title: note.videoTitle,
                                channelTitle: 'Saved Note',
                                thumbnail: `https://i.ytimg.com/vi/${note.videoId}/hqdefault.jpg`,
                              });
                              setSeekTimestamp(note.timestamp);
                              setActiveTab('sanctuary');
                            }}
                            className="px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 hover:bg-blue-600 hover:text-white text-blue-400 font-mono text-xs font-medium transition cursor-pointer flex items-center gap-1.5"
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>{note.formattedTime}</span>
                          </button>
                          <span className="text-sm font-bold text-white">
                            {note.videoTitle}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingNote(note);
                              setIsAddNoteModalOpen(true);
                            }}
                            className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-white/5 border border-white/5 transition cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="text-xs text-slate-500 hover:text-rose-400 px-2 py-1 rounded hover:bg-rose-500/10 transition cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-1">
                        {note.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* VIEW 9: SAVED / BOOKMARKS */}
          {activeTab === 'bookmarks' && (
            <SavedLecturesView
              savedVideos={savedVideos}
              onSelectVideo={handleSelectVideo}
              onEditSaved={(video) => setEditingSavedVideo(video)}
              onDeleteSaved={handleDeleteSavedVideo}
              onOpenExplorer={() => setActiveTab('curated')}
            />
          )}

          {/* VIEW 10: SETTINGS (Data Management Hub) */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-3xl animate-fade-in">
              <div className="p-6 rounded-2xl bg-[#0f1426] border border-white/10 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-blue-400" />
                    <h2 className="text-lg font-bold text-white">Data Management & Preferences</h2>
                  </div>
                </div>

                {/* Profile Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Student Profile
                    </h3>
                    <button
                      onClick={() => setIsProfileModalOpen(true)}
                      className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit Profile</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={userProfile.avatarUrl}
                        alt=""
                        className="w-12 h-12 rounded-full object-cover border border-white/10"
                      />
                      <div>
                        <p className="text-sm font-bold text-white">{userProfile.name}</p>
                        {userProfile.email && (
                          <p className="text-xs text-slate-400">{userProfile.email}</p>
                        )}
                        <p className="text-xs text-slate-500 italic mt-0.5">"{userProfile.status}"</p>
                      </div>
                    </div>
                    <div className="text-right text-xs">
                      <span className="font-mono text-emerald-400 block">{userProfile.dailyGoalHours}h daily goal</span>
                      <span className="font-mono text-amber-400">{userProfile.streakDays} day streak</span>
                    </div>
                  </div>
                </div>

                {/* Study Hours Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Study Hours Log
                    </h3>
                    <button
                      onClick={() => setIsWeeklyHoursModalOpen(true)}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit Study Hours</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {totalFocusThisWeek.toFixed(1)} hours logged this week
                      </p>
                      <p className="text-xs text-slate-400">
                        Click "Edit Study Hours" to adjust daily hours (Mon–Sun).
                      </p>
                    </div>
                    <button
                      onClick={() => setIsWeeklyHoursModalOpen(true)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 text-xs font-semibold hover:bg-indigo-600/30 transition cursor-pointer"
                    >
                      Log / Edit
                    </button>
                  </div>
                </div>

                {/* Motivation Quote Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Motivation Quote
                    </h3>
                    <button
                      onClick={() => setIsQuoteModalOpen(true)}
                      className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit Quote</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                    <div className="max-w-md">
                      <p className="text-xs text-slate-200 italic">“{motivationQuote.quote}”</p>
                      <p className="text-[11px] text-slate-400 mt-1">— {motivationQuote.author}</p>
                    </div>
                    <button
                      onClick={() => setIsQuoteModalOpen(true)}
                      className="px-3 py-1.5 rounded-lg bg-amber-600/20 text-amber-400 border border-amber-500/30 text-xs font-semibold hover:bg-amber-600/30 transition cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                </div>

                {/* Data Backup & Portability */}
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Backup & Restore
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={handleExportData}
                      className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 flex items-center gap-3 transition cursor-pointer text-left"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
                        <Download className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">Export All My Data</p>
                        <p className="text-[11px] text-slate-400">Download tasks, notes & logs (JSON)</p>
                      </div>
                    </button>

                    <label className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 flex items-center gap-3 transition cursor-pointer text-left">
                      <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                        <Upload className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">Import Data Backup</p>
                        <p className="text-[11px] text-slate-400">Restore from JSON file</p>
                      </div>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportData}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Reset Dummy Data & Clean Slate */}
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-rose-400" />
                      <span>Start with Empty Clean Slate</span>
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Clears all tasks, projects, notes, and study logs so you can enter your own fresh data.
                    </p>
                  </div>
                  <button
                    onClick={handleClearAllData}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/20 transition cursor-pointer shrink-0"
                  >
                    Clear All Data
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ALL MODALS */}
      {/* 1. Edit Saved Video Modal */}
      {editingSavedVideo && (
        <EditSavedModal
          video={editingSavedVideo}
          isOpen={!!editingSavedVideo}
          onClose={() => setEditingSavedVideo(null)}
          onSave={handleUpdateSavedVideo}
          onDelete={handleDeleteSavedVideo}
        />
      )}

      {/* 2. Add / Edit Task Modal */}
      {isAddTaskModalOpen && (
        <EditTaskModal
          task={editingTask}
          isOpen={isAddTaskModalOpen}
          onClose={() => setIsAddTaskModalOpen(false)}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
        />
      )}

      {/* 3. Add / Edit Project Modal */}
      {isAddProjectModalOpen && (
        <EditProjectModal
          project={editingProject}
          isOpen={isAddProjectModalOpen}
          onClose={() => setIsAddProjectModalOpen(false)}
          onSave={handleSaveProject}
          onDelete={handleDeleteProject}
        />
      )}

      {/* 4. Add / Edit Note Modal */}
      {isAddNoteModalOpen && (
        <EditNoteModal
          note={editingNote}
          isOpen={isAddNoteModalOpen}
          onClose={() => setIsAddNoteModalOpen(false)}
          onSave={handleSaveNote}
          onDelete={handleDeleteNote}
        />
      )}

      {/* 5. Edit Profile Modal */}
      {isProfileModalOpen && (
        <EditProfileModal
          profile={userProfile}
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          onSave={setUserProfile}
        />
      )}

      {/* 6. Edit Weekly Study Hours Modal */}
      {isWeeklyHoursModalOpen && (
        <EditWeeklyHoursModal
          thisWeek={thisWeekHours}
          lastWeek={lastWeekHours}
          isOpen={isWeeklyHoursModalOpen}
          onClose={() => setIsWeeklyHoursModalOpen(false)}
          onSave={handleSaveWeeklyHours}
        />
      )}

      {/* 7. Edit Motivation Quote Modal */}
      {isQuoteModalOpen && (
        <EditQuoteModal
          quote={motivationQuote}
          isOpen={isQuoteModalOpen}
          onClose={() => setIsQuoteModalOpen(false)}
          onSave={handleSaveQuote}
        />
      )}
    </div>
  );
}
