import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  Menu, 
  Link as LinkIcon, 
  Check, 
  Sparkles, 
  ExternalLink,
  User,
  Zap,
  Flame,
  Volume2
} from 'lucide-react';
import { UserProfile } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface TopBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: (q: string) => void;
  onPasteUrl: (url: string) => void;
  userProfile: UserProfile;
  onOpenProfileModal: () => void;
  onToggleMobileSidebar: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onPasteUrl,
  userProfile,
  onOpenProfileModal,
  onToggleMobileSidebar,
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggestOpen, setIsSuggestOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pasteInput, setPasteInput] = useState('');
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Fetch real YouTube suggestions as user types
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setIsSuggestOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/youtube/suggest?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.suggestions) && data.suggestions.length > 0) {
            setSuggestions(data.suggestions);
            setIsSuggestOpen(true);
          }
        }
      } catch (e) {
        // Fallback
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside listener for suggestions dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSuggestOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuggestOpen(false);
    if (searchQuery.trim()) {
      onSearchSubmit(searchQuery.trim());
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    onSearchChange(suggestion);
    setIsSuggestOpen(false);
    onSearchSubmit(suggestion);
  };

  const handlePasteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pasteInput.trim()) {
      onPasteUrl(pasteInput.trim());
      setPasteInput('');
      setShowPasteModal(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#0a0d18]/90 backdrop-blur-xl border-b border-white/5 px-4 sm:px-6 py-3.5 transition-colors">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left: Hamburger for mobile */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={onToggleMobileSidebar}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-white/10 cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Center: Broad Search Bar (Matches BeatMotion UI) */}
        <div ref={searchContainerRef} className="flex-1 max-w-2xl relative">
          <form onSubmit={handleSubmit} className="relative flex items-center w-full">
            <Search className="absolute left-4 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              id="top-search-input"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0) setIsSuggestOpen(true);
              }}
              placeholder="Search tasks, projects, or YouTube topics (e.g. DSA, Calculus, Lo-Fi beats)..."
              className="w-full bg-[#121626]/80 hover:bg-[#151a2e] focus:bg-[#0c1020] border border-white/10 focus:border-blue-500/50 rounded-2xl pl-11 pr-24 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition shadow-inner"
            />

            <div className="absolute right-2 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowPasteModal(true)}
                className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-medium transition cursor-pointer flex items-center gap-1"
                title="Paste direct YouTube link"
              >
                <LinkIcon className="w-3 h-3 text-blue-400" />
                <span className="hidden sm:inline text-[11px]">URL</span>
              </button>
            </div>
          </form>

          {/* Real-time YouTube Auto-Suggest Popover */}
          {isSuggestOpen && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#0d1222] border border-white/10 rounded-2xl shadow-2xl p-2 z-50 backdrop-blur-2xl animate-fade-in divide-y divide-white/5">
              <div className="px-3 py-1.5 text-[10px] uppercase font-mono tracking-wider text-blue-400/80 flex items-center justify-between">
                <span>YouTube Topic Suggestions</span>
                <Sparkles className="w-3 h-3 text-blue-400" />
              </div>
              <div className="py-1">
                {suggestions.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSuggestion(item)}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-2.5 transition cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{item}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Section: Notifications + User Profile */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* PWA Install Button */}
          <div className="hidden sm:block">
            <PWAInstallButton />
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 animate-pulse ring-2 ring-[#0a0d18]" />
            </button>

            {/* Notification popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-[#0e1324] border border-white/10 rounded-2xl shadow-2xl p-3 z-50 backdrop-blur-2xl">
                <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                  <span className="text-xs font-semibold text-white">Notifications</span>
                  <span className="text-[10px] text-blue-400 font-mono">2 unread</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-slate-200">
                    <p className="font-medium text-blue-400">🔥 Day 18 Streak!</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Keep up the deep focus study routine today.</p>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5 border border-white/5 text-slate-300">
                    <p className="font-medium text-white">Study Milestone Reached</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">You completed 5 out of 8 exam targets!</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill (Matches BeatMotion UI) */}
          <div
            onClick={onOpenProfileModal}
            className="flex items-center gap-3 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition cursor-pointer select-none group"
            title="Click to edit profile & goals"
          >
            {/* Avatar */}
            <div className="relative">
              <img
                src={userProfile.avatarUrl}
                alt={userProfile.name}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-white/20 group-hover:ring-blue-500 transition"
              />
              {/* Online indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0a0d18]" />
            </div>

            {/* Name and Status */}
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-white group-hover:text-blue-300 transition leading-tight">
                {userProfile.name}
              </span>
              <span className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">
                {userProfile.status}
              </span>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition hidden sm:block" />
          </div>
        </div>
      </div>

      {/* Paste YouTube URL Modal */}
      {showPasteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0f1426] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-semibold text-white">Paste YouTube Link</h3>
              </div>
              <button
                onClick={() => setShowPasteModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handlePasteSubmit} className="space-y-3">
              <p className="text-xs text-slate-400 leading-relaxed">
                Paste any YouTube video or Shorts link to play immediately in the distraction-free exam player without ads or feeds:
              </p>
              <input
                type="text"
                value={pasteInput}
                onChange={(e) => setPasteInput(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-[#090d18] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
                autoFocus
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasteModal(false)}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-lg shadow-blue-500/20"
                >
                  Load Lecture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
