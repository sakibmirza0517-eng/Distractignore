import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  FolderGit2, 
  BarChart2, 
  MoreHorizontal, 
  Shuffle, 
  SkipBack, 
  Play, 
  Pause, 
  SkipForward, 
  Heart, 
  Target, 
  Plus, 
  ArrowRight, 
  FileText, 
  Flame, 
  ExternalLink,
  Edit2,
  Trash2,
  Sparkles,
  Search
} from 'lucide-react';
import { Card3D } from './Card3D';
import { 
  TaskItem, 
  ProjectItem, 
  StudyNote, 
  UserProfile, 
  VideoItem, 
  WeeklyActivityDay, 
  MotivationQuote 
} from '../types';

interface DashboardViewProps {
  userProfile: UserProfile;
  onOpenProfileModal: () => void;
  tasks: TaskItem[];
  onToggleTask: (id: string) => void;
  onOpenAddTask: () => void;
  onEditTask: (task: TaskItem) => void;
  onDeleteTask: (id: string) => void;
  projects: ProjectItem[];
  onOpenAddProject: () => void;
  onEditProject: (proj: ProjectItem) => void;
  onDeleteProject: (id: string) => void;
  notes: StudyNote[];
  onOpenAddNote: () => void;
  onEditNote: (note: StudyNote) => void;
  onDeleteNote: (id: string) => void;
  currentVideo: VideoItem;
  onSelectTab: (tab: string) => void;
  onPlayCurrentVideo: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (video: VideoItem) => void;
  thisWeekHours: WeeklyActivityDay[];
  lastWeekHours: WeeklyActivityDay[];
  onOpenEditWeeklyHours: () => void;
  quote: MotivationQuote;
  onOpenEditQuote: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userProfile,
  onOpenProfileModal,
  tasks,
  onToggleTask,
  onOpenAddTask,
  onEditTask,
  onDeleteTask,
  projects,
  onOpenAddProject,
  onEditProject,
  onDeleteProject,
  notes,
  onOpenAddNote,
  onEditNote,
  onDeleteNote,
  currentVideo,
  onSelectTab,
  onPlayCurrentVideo,
  isBookmarked,
  onToggleBookmark,
  thisWeekHours,
  lastWeekHours,
  onOpenEditWeeklyHours,
  quote,
  onOpenEditQuote,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeWeekView, setActiveWeekView] = useState<'this' | 'last'>('this');
  const [activeProjectMenu, setActiveProjectMenu] = useState<string | null>(null);

  // Safe fallbacks for props to prevent runtime unhandled crashes
  const safeProfile = userProfile || {
    name: 'Student',
    status: 'Focus • Build • Grow',
    streakDays: 0,
    dailyGoalHours: 6,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  };

  const safeQuote = quote || {
    quote: 'Small steps every day lead to big results.',
    author: 'BeatMotion Maktub',
    bgImageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
  };

  const safeTasks = Array.isArray(tasks) ? tasks.filter(Boolean) : [];
  const safeProjects = Array.isArray(projects) ? projects.filter(Boolean) : [];
  const safeNotes = Array.isArray(notes) ? notes.filter(Boolean) : [];
  const safeThisWeek = Array.isArray(thisWeekHours) ? thisWeekHours.filter(Boolean) : [];
  const safeLastWeek = Array.isArray(lastWeekHours) ? lastWeekHours.filter(Boolean) : [];

  // Dynamic greeting based on current local hour
  const currentHour = new Date().getHours();
  const timeGreeting =
    currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening';

  // Dynamic date formatting
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date());

  // Today's day of week matching our chart ('Mon', 'Tue', etc.)
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayDayStr = dayNames[new Date().getDay()];

  // Today's focus hours logged
  const todayEntry = safeThisWeek.find((d) => d && d.day === todayDayStr);
  const todayFocusHours = todayEntry && typeof todayEntry.hours === 'number' ? todayEntry.hours : 0;
  const focusTimeHoursFloor = Math.floor(todayFocusHours);
  const focusTimeMins = Math.round((todayFocusHours - focusTimeHoursFloor) * 60);

  // Calculations
  const completedTasksCount = safeTasks.filter((t) => t.completed).length;
  const totalTasksCount = safeTasks.length;
  const tasksProgressPct = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  // Total hours this week
  const totalThisWeekHours = safeThisWeek.reduce((acc, d) => acc + (d?.hours || 0), 0);
  const totalLastWeekHours = safeLastWeek.reduce((acc, d) => acc + (d?.hours || 0), 0);

  // Weekly progress percentage (relative to daily goal * 7)
  const safeDailyGoal = typeof safeProfile.dailyGoalHours === 'number' && safeProfile.dailyGoalHours > 0 ? safeProfile.dailyGoalHours : 6;
  const weeklyGoalHours = safeDailyGoal * 7;
  const weeklyProgressPct = Math.min(100, Math.round((totalThisWeekHours / weeklyGoalHours) * 100));

  // Current chart data scaling
  const currentChart = (activeWeekView === 'this' ? safeThisWeek : safeLastWeek) || [];
  const maxHoursInView = Math.max(4, ...currentChart.map((c) => c?.hours || 0));

  const hasVideoLoaded = Boolean(currentVideo && currentVideo.id && currentVideo.id.trim());

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* 1. Greeting & Streak Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>{timeGreeting},</span>
              <button
                onClick={onOpenProfileModal}
                className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 font-extrabold hover:opacity-80 transition cursor-pointer flex items-center gap-1.5"
                title="Click to edit profile"
              >
                <span>{safeProfile.name}</span>
                <Edit2 className="w-3.5 h-3.5 text-blue-400 inline opacity-70 hover:opacity-100" />
              </button>
              <span className="text-amber-400 text-2xl">☀️</span>
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            {safeProfile.status || 'Stay focused. Make progress. Build the future you want.'}
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-medium text-slate-400">
          <span className="font-mono">{todayFormatted}</span>
          <button
            onClick={onOpenProfileModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono hover:bg-amber-500/20 transition cursor-pointer"
            title="Edit streak"
          >
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>Day {safeProfile.streakDays || 0} streak</span>
          </button>
        </div>
      </div>

      {/* 2. Top 4 Metric Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Today's Tasks */}
        <Card3D intensity={5}>
          <div className="p-5 rounded-2xl bg-[#0f1426] border border-white/5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <button
                onClick={onOpenAddTask}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add</span>
              </button>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">Today's Tasks</span>
              <div className="text-2xl font-bold text-white mt-1">
                {completedTasksCount} <span className="text-slate-500 text-lg font-normal">/ {totalTasksCount}</span>
              </div>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${tasksProgressPct}%` }}
              />
            </div>
          </div>
        </Card3D>

        {/* Card 2: Focus Time */}
        <Card3D intensity={5}>
          <div className="p-5 rounded-2xl bg-[#0f1426] border border-white/5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Clock className="w-5 h-5" />
              </div>
              <button
                onClick={onOpenEditWeeklyHours}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 cursor-pointer"
                title="Edit today's focus hours"
              >
                <Edit2 className="w-3 h-3" />
                <span>Log Time</span>
              </button>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">Focus Time Today</span>
              <div className="text-2xl font-bold text-white mt-1">
                {todayFocusHours > 0 ? (
                  <>
                    {focusTimeHoursFloor}h {focusTimeMins}m{' '}
                    <span className="text-slate-500 text-sm font-normal">of {safeDailyGoal}h</span>
                  </>
                ) : (
                  <>
                    0h 0m{' '}
                    <span className="text-slate-500 text-sm font-normal">of {safeDailyGoal}h</span>
                  </>
                )}
              </div>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (todayFocusHours / (safeDailyGoal || 6)) * 100)}%` }}
              />
            </div>
          </div>
        </Card3D>

        {/* Card 3: Active Projects */}
        <Card3D intensity={5}>
          <div className="p-5 rounded-2xl bg-[#0f1426] border border-white/5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                <FolderGit2 className="w-5 h-5" />
              </div>
              <button
                onClick={onOpenAddProject}
                className="text-[11px] text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>New</span>
              </button>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">Active Projects</span>
              <div className="text-2xl font-bold text-white mt-1">
                {projects.length}
              </div>
            </div>
            <button
              onClick={() => onSelectTab('projects')}
              className="text-[11px] text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>{projects.length > 0 ? 'View all projects' : 'Create first project'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </Card3D>

        {/* Card 4: Weekly Progress */}
        <Card3D intensity={5}>
          <div className="p-5 rounded-2xl bg-[#0f1426] border border-white/5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-pink-600/20 text-pink-400 flex items-center justify-center border border-pink-500/30">
                <BarChart2 className="w-5 h-5" />
              </div>
              <button
                onClick={onOpenEditWeeklyHours}
                className="text-[11px] text-pink-400 hover:text-pink-300 font-medium flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">Weekly Total</span>
              <div className="text-2xl font-bold text-white mt-1">
                {totalThisWeekHours.toFixed(1)}h <span className="text-slate-500 text-sm font-normal">({weeklyProgressPct}%)</span>
              </div>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-rose-400 rounded-full transition-all duration-500"
                style={{ width: `${weeklyProgressPct}%` }}
              />
            </div>
          </div>
        </Card3D>
      </div>

      {/* 3. Middle Section: Now Playing + Weekly Activity + Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Column 1: Now Playing Music / Lecture Card */}
        <div className="lg:col-span-4">
          <Card3D intensity={6} className="h-full">
            <div className="h-full p-5 rounded-2xl bg-[#0f1426] border border-white/5 shadow-xl flex flex-col justify-between relative overflow-hidden group">
              {/* Top Header */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <span className="text-blue-400">🎧</span>
                  <span>{hasVideoLoaded ? 'Now Studying' : 'Active Lecture'}</span>
                </div>
                <button
                  onClick={() => onSelectTab('sanctuary')}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"
                  title="Open in Sanctuary Player"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              {/* Artwork or Empty State */}
              {hasVideoLoaded ? (
                <div 
                  onClick={() => onSelectTab('sanctuary')}
                  className="relative my-4 aspect-video w-full rounded-xl overflow-hidden border border-white/10 shadow-lg cursor-pointer group/art"
                >
                  <img
                    src={
                      currentVideo.thumbnail ||
                      `https://i.ytimg.com/vi/${currentVideo.id}/hqdefault.jpg`
                    }
                    alt={currentVideo.title}
                    className="w-full h-full object-cover group-hover/art:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[11px] font-mono">
                    <span className="bg-blue-600/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-medium">
                      DISTRACTION-FREE
                    </span>
                    <span className="text-white/80">{currentVideo.duration || 'Video'}</span>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => onSelectTab('curated')}
                  className="relative my-4 aspect-video w-full rounded-xl overflow-hidden border border-dashed border-white/15 bg-white/[0.02] hover:bg-white/[0.05] transition flex flex-col items-center justify-center p-4 text-center cursor-pointer space-y-2 group/empty"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30 group-hover/empty:scale-110 transition">
                    <Search className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Select a Lecture to Study</p>
                    <p className="text-[11px] text-slate-400">Search YouTube or paste any lecture URL</p>
                  </div>
                </div>
              )}

              {/* Title & Subtitle */}
              <div className="space-y-1">
                <h3 
                  onClick={() => onSelectTab(hasVideoLoaded ? 'sanctuary' : 'curated')}
                  className="text-base font-bold text-white hover:text-blue-400 transition cursor-pointer truncate"
                >
                  {hasVideoLoaded && currentVideo ? currentVideo.title : 'No lecture selected'}
                </h3>
                <p className="text-xs text-slate-400 truncate">
                  {hasVideoLoaded && currentVideo
                    ? currentVideo.channelTitle || 'YouTube Study Stream'
                    : 'Click to discover high-yield lectures'}
                </p>
              </div>

              {/* Scrubber Progress Slider */}
              <div className="space-y-1.5 my-3">
                <div 
                  onClick={() => onSelectTab('sanctuary')}
                  className="w-full h-1 bg-slate-800 rounded-full overflow-hidden cursor-pointer"
                >
                  <div className="h-full bg-blue-500 rounded-full w-[35%]" />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>Progress</span>
                  <span>{currentVideo?.duration || 'Ready'}</span>
                </div>
              </div>

              {/* Media Controls */}
              <div className="flex items-center justify-between pt-1">
                <button 
                  onClick={() => onSelectTab('curated')}
                  className="text-slate-400 hover:text-white transition p-1"
                  title="Search lectures"
                >
                  <Search className="w-4 h-4" />
                </button>

                <button 
                  onClick={() => onSelectTab('sanctuary')}
                  className="text-slate-400 hover:text-white transition p-1"
                  title="Previous"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                {/* Big Glow Play Button */}
                <button
                  onClick={() => {
                    if (hasVideoLoaded) {
                      setIsPlayingAudio(!isPlayingAudio);
                      onPlayCurrentVideo();
                    } else {
                      onSelectTab('curated');
                    }
                  }}
                  className="w-10 h-10 rounded-full bg-[#3b5bfd] hover:bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/40 hover:scale-105 transition cursor-pointer"
                  title={hasVideoLoaded ? 'Play in Sanctuary' : 'Search video'}
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </button>

                <button 
                  onClick={() => onSelectTab('curated')}
                  className="text-slate-400 hover:text-white transition p-1"
                  title="Next"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

                <button
                  onClick={() => hasVideoLoaded && onToggleBookmark(currentVideo)}
                  disabled={!hasVideoLoaded}
                  className={`transition p-1 ${
                    isBookmarked ? 'text-amber-400 fill-current' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Bookmark lecture"
                >
                  <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </Card3D>
        </div>

        {/* Column 2: Weekly Activity Bar Chart */}
        <div className="lg:col-span-4">
          <Card3D intensity={5} className="h-full">
            <div className="h-full p-5 rounded-2xl bg-[#0f1426] border border-white/5 shadow-xl flex flex-col justify-between">
              {/* Header with toggle and Edit button */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-white">Weekly Activity</h2>
                  <button
                    onClick={onOpenEditWeeklyHours}
                    className="p-1 text-slate-400 hover:text-blue-400 transition"
                    title="Edit study hours"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-white/5">
                  <button
                    onClick={() => setActiveWeekView('this')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                      activeWeekView === 'this'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    This Week
                  </button>
                  <button
                    onClick={() => setActiveWeekView('last')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                      activeWeekView === 'last'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Last Week
                  </button>
                </div>
              </div>

              {/* Bar Chart Graphic (Mon to Sun) */}
              <div className="flex-1 flex items-end justify-between gap-2.5 pt-6 pb-3 px-2 border-b border-white/5 min-h-[140px]">
                {currentChart.map((col, idx) => {
                  const colDay = col?.day || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx] || `Day ${idx+1}`;
                  const colHours = typeof col?.hours === 'number' && !isNaN(col.hours) ? col.hours : 0;
                  const safeMax = maxHoursInView > 0 ? maxHoursInView : 4;
                  const barHeightPct =
                    colHours > 0 ? Math.max(12, Math.round((colHours / safeMax) * 100)) : 4;
                  const isToday = colDay === todayDayStr && activeWeekView === 'this';

                  return (
                    <div key={colDay} className="flex-1 flex flex-col items-center gap-2 group relative">
                      <span className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-5">
                        {colHours}h
                      </span>
                      <div className="w-full max-w-[28px] h-28 bg-slate-800/50 rounded-lg flex items-end overflow-hidden p-0.5 border border-white/5">
                        <div
                          className={`w-full rounded-md transition-all duration-500 group-hover:brightness-125 ${
                            isToday
                              ? 'bg-gradient-to-t from-emerald-500 to-teal-400 shadow-md shadow-emerald-500/20'
                              : 'bg-gradient-to-t from-blue-600 to-indigo-400'
                          }`}
                          style={{ height: `${barHeightPct}%` }}
                        />
                      </div>
                      <span
                        className={`text-[10px] font-medium ${
                          isToday ? 'text-emerald-400 font-bold' : 'text-slate-400'
                        }`}
                      >
                        {colDay}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Bottom On-Track Banner */}
              <div className="mt-4 p-3 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">
                      {totalThisWeekHours >= weeklyGoalHours ? 'Weekly Goal Reached! 🎉' : "You're on track!"}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {completedTasksCount} of {totalTasksCount} tasks completed today.
                    </p>
                  </div>
                </div>
                <button
                  onClick={onOpenEditWeeklyHours}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium shrink-0"
                >
                  Edit Hours
                </button>
              </div>
            </div>
          </Card3D>
        </div>

        {/* Column 3: Today's Tasks & Quick Actions */}
        <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
          {/* Today's Tasks Card */}
          <div className="p-5 rounded-2xl bg-[#0f1426] border border-white/5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white">Today's Tasks</h2>
                <span className="text-[11px] font-mono text-slate-500">
                  ({completedTasksCount}/{totalTasksCount})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenAddTask}
                  className="text-[11px] text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add</span>
                </button>
                <button
                  onClick={() => onSelectTab('tasks')}
                  className="text-[11px] text-slate-400 hover:text-white font-medium flex items-center gap-0.5 cursor-pointer"
                >
                  <span>All</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Task list or Empty State */}
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {tasks.length === 0 ? (
                <div className="py-6 px-4 text-center rounded-xl bg-white/[0.01] border border-dashed border-white/10 space-y-2">
                  <p className="text-xs text-slate-400">No tasks added for today.</p>
                  <button
                    onClick={onOpenAddTask}
                    className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-medium transition cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Create your first task</span>
                  </button>
                </div>
              ) : (
                tasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition group text-xs"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <button
                        onClick={() => onToggleTask(task.id)}
                        className="cursor-pointer text-slate-400 hover:text-blue-400 transition shrink-0"
                        title={task.completed ? 'Mark uncompleted' : 'Mark completed'}
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-indigo-500 fill-indigo-500/20" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-600 hover:border-blue-400 transition" />
                        )}
                      </button>
                      <span
                        className={`truncate font-medium ${
                          task.completed ? 'line-through text-slate-500' : 'text-slate-200'
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] font-mono text-slate-500">{task.time}</span>
                      <button
                        onClick={() => onEditTask(task)}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-white p-1 transition"
                        title="Edit task"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-1 transition"
                        title="Delete task"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions 2x2 Grid */}
          <div className="p-4 rounded-2xl bg-[#0f1426] border border-white/5 shadow-xl space-y-2.5">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={onOpenAddTask}
                className="p-3 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/20 flex flex-col items-start gap-1.5 transition cursor-pointer text-left group"
              >
                <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow">
                  <Plus className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-slate-200 group-hover:text-white">
                  Add Task
                </span>
              </button>

              <button
                onClick={() => onSelectTab('pomodoro')}
                className="p-3 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/20 flex flex-col items-start gap-1.5 transition cursor-pointer text-left group"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </div>
                <span className="text-xs font-semibold text-slate-200 group-hover:text-white">
                  Start Focus
                </span>
              </button>

              <button
                onClick={onOpenAddProject}
                className="p-3 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 flex flex-col items-start gap-1.5 transition cursor-pointer text-left group"
              >
                <div className="w-6 h-6 rounded-lg bg-blue-500 text-white flex items-center justify-center shadow">
                  <FolderGit2 className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-slate-200 group-hover:text-white">
                  New Project
                </span>
              </button>

              <button
                onClick={onOpenAddNote}
                className="p-3 rounded-xl bg-amber-600/10 hover:bg-amber-600/20 border border-amber-500/20 flex flex-col items-start gap-1.5 transition cursor-pointer text-left group"
              >
                <div className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-slate-200 group-hover:text-white">
                  New Note
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Row: Recent Projects + Recent Notes + Quote Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Recent Projects (Left) */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-[#0f1426] border border-white/5 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">Recent Projects</h2>
              <button
                onClick={onOpenAddProject}
                className="p-1 text-slate-400 hover:text-blue-400 transition"
                title="Add new project"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <button
              onClick={() => onSelectTab('projects')}
              className="text-[11px] text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>View all</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {projects.length === 0 ? (
              <div className="py-8 px-4 text-center rounded-xl bg-white/[0.01] border border-dashed border-white/10 space-y-2">
                <p className="text-xs text-slate-400">No projects added yet.</p>
                <button
                  onClick={onOpenAddProject}
                  className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-medium transition cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3 h-3" />
                  <span>Create first project</span>
                </button>
              </div>
            ) : (
              projects.slice(0, 3).map((proj) => (
                <div
                  key={proj.id}
                  className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition space-y-2 border border-white/5 relative group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 shrink-0">
                        <FolderGit2 className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-semibold text-white truncate max-w-[180px]">
                          {proj.title}
                        </p>
                        <p className="text-[10px] text-slate-400">{proj.category}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-300">
                        {proj.progress}%
                      </span>
                      <button
                        onClick={() =>
                          setActiveProjectMenu(activeProjectMenu === proj.id ? null : proj.id)
                        }
                        className="text-slate-500 hover:text-white p-1 rounded transition"
                      >
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>

                  {/* Dropdown Menu */}
                  {activeProjectMenu === proj.id && (
                    <div className="absolute right-3 top-10 w-32 bg-[#090d18] border border-white/10 rounded-xl shadow-2xl p-1 z-30 space-y-0.5 text-xs">
                      <button
                        onClick={() => {
                          setActiveProjectMenu(null);
                          onEditProject(proj);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => {
                          setActiveProjectMenu(null);
                          onDeleteProject(proj.id);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Notes (Center) */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-[#0f1426] border border-white/5 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">Recent Notes</h2>
              <button
                onClick={onOpenAddNote}
                className="p-1 text-slate-400 hover:text-blue-400 transition"
                title="Add new note"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <button
              onClick={() => onSelectTab('notes')}
              className="text-[11px] text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>View all</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2">
            {notes.length === 0 ? (
              <div className="py-8 px-4 text-center rounded-xl bg-white/[0.01] border border-dashed border-white/10 space-y-2">
                <p className="text-xs text-slate-400">No notes written yet.</p>
                <button
                  onClick={onOpenAddNote}
                  className="px-3 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-500/30 text-xs font-medium transition cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3 h-3" />
                  <span>Take your first note</span>
                </button>
              </div>
            ) : (
              notes.slice(0, 4).map((note) => (
                <div
                  key={note.id}
                  className="p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition flex items-center justify-between border border-white/5 group relative"
                >
                  <div 
                    onClick={() => onSelectTab('notes')}
                    className="flex items-center gap-2.5 cursor-pointer overflow-hidden"
                  >
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <div className="overflow-hidden space-y-0.5">
                      <p className="text-xs font-semibold text-slate-200 group-hover:text-blue-400 transition truncate max-w-[200px]">
                        {note.text.slice(0, 36)}...
                      </p>
                      <span className="text-[10px] font-mono text-slate-500">
                        {note.formattedTime} • {note.videoTitle}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onEditNote(note)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-white p-1 transition"
                      title="Edit note"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onDeleteNote(note.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-1 transition"
                      title="Delete note"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Inspirational Quote Card (Right) */}
        <div className="lg:col-span-4">
          <Card3D intensity={8} className="h-full">
            <div 
              onClick={onOpenEditQuote}
              className="h-full min-h-[220px] rounded-2xl overflow-hidden relative p-6 border border-white/10 shadow-2xl flex flex-col justify-between group cursor-pointer"
            >
              {/* Twilight Mountain Sunset Backdrop */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage: `url('${
                    safeQuote.bgImageUrl ||
                    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80'
                  }')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090d18] via-[#090d18]/60 to-transparent" />
              <div className="absolute inset-0 bg-indigo-950/20 mix-blend-overlay" />

              {/* Edit Quote Pill Top-Right */}
              <div className="relative z-10 flex justify-end">
                <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] text-slate-300 group-hover:text-white flex items-center gap-1">
                  <Edit2 className="w-2.5 h-2.5" />
                  <span>Edit Quote</span>
                </span>
              </div>

              <div className="relative z-10 space-y-2">
                <blockquote className="text-base sm:text-lg font-medium text-white leading-relaxed drop-shadow-md">
                  “{safeQuote.quote || 'Small steps every day lead to big results.'}”
                </blockquote>
                <p className="text-xs text-slate-300 font-mono tracking-wider">
                  — {safeQuote.author || 'BeatMotion Maktub'}
                </p>
              </div>
            </div>
          </Card3D>
        </div>
      </div>
    </div>
  );
};
