import React, { useState } from 'react';
import { Search, Link as LinkIcon, Sparkles, Eye, X } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onPasteUrl: (url: string) => void;
  isZenMode: boolean;
  onToggleZenMode: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onPasteUrl,
  isZenMode,
  onToggleZenMode,
  activeTab,
  onSelectTab,
}) => {
  const [pasteInput, setPasteInput] = useState('');
  const [showPasteModal, setShowPasteModal] = useState(false);

  const handlePasteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pasteInput.trim()) {
      onPasteUrl(pasteInput.trim());
      setPasteInput('');
      setShowPasteModal(false);
    }
  };

  return (
    <header 
      id="main-navbar"
      className="sticky top-0 z-40 bg-[#0a0f1e]/80 backdrop-blur-xl border-b border-white/5 px-4 lg:px-8 py-3.5 transition-colors"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo & Focus Badge */}
        <div className="flex items-center gap-6 shrink-0">
          <div 
            onClick={() => onSelectTab('sanctuary')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 rotate-3 group-hover:rotate-0 transition-transform duration-300">
              <span className="font-bold text-xl text-white">M</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-light tracking-widest uppercase text-white leading-none">
                Maktub
              </span>
              <span className="text-[9px] text-blue-400/80 font-mono tracking-wider uppercase mt-1">
                Distraction-Free Mirror
              </span>
            </div>
          </div>

          {/* Immersive Focus Pill */}
          <div className="hidden xl:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-1.5 gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-blue-400 tracking-wide">FOCUS MODE ACTIVE</span>
            <div className="w-px h-3 bg-white/10" />
            <span className="text-xs text-white/60">Zero Distractions • No Ads</span>
          </div>
        </div>

        {/* Center: Search & Direct Paste Bar */}
        <div className="flex-1 max-w-lg">
          <form onSubmit={onSearchSubmit} className="relative flex items-center w-full">
            <Search className="absolute left-3.5 w-4 h-4 text-white/40 pointer-events-none" />
            <input
              type="text"
              id="search-input"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Paste YouTube link or search lecture (e.g. Calculus, Physics)..."
              className="w-full bg-white/5 hover:bg-white/[0.08] focus:bg-[#050812] border border-white/10 focus:border-blue-500/50 rounded-xl pl-10 pr-24 py-2 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition shadow-inner"
            />
            <div className="absolute right-1.5 flex items-center gap-1">
              <button
                type="button"
                id="open-paste-modal-btn"
                onClick={() => setShowPasteModal(true)}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 text-xs font-medium transition cursor-pointer flex items-center gap-1.5"
                title="Direct paste YouTube URL"
              >
                <LinkIcon className="w-3 h-3 text-blue-400" />
                <span className="hidden md:inline text-[11px]">Paste URL</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: Actions & PWA Install */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Zen Focus Toggle */}
          <button
            id="nav-zen-toggle-btn"
            onClick={onToggleZenMode}
            className={`hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium border transition cursor-pointer ${
              isZenMode
                ? 'bg-blue-600/20 text-blue-300 border-blue-500/50 shadow-lg shadow-blue-500/20'
                : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border-white/10'
            }`}
            title="Toggle Zen Distraction-Free Study Mode"
          >
            <Eye className="w-3.5 h-3.5 text-blue-400" />
            <span>{isZenMode ? 'Focus Active' : 'Zen Focus'}</span>
          </button>

          {/* In-App PWA Install Button */}
          <PWAInstallButton />
        </div>
      </div>

      {/* Paste URL Modal */}
      {showPasteModal && (
        <div 
          id="paste-url-modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#02040a]/80 backdrop-blur-xl p-4 animate-fade-in"
        >
          <div className="w-full max-w-md rounded-2xl bg-[#0a0f1e] border border-white/10 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <LinkIcon className="w-4 h-4 text-blue-400" />
                </div>
                <h3 className="text-base font-semibold text-white">Mirror Any YouTube Video</h3>
              </div>
              <button 
                onClick={() => setShowPasteModal(false)}
                className="text-white/40 hover:text-white transition cursor-pointer p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-white/60 leading-relaxed">
              Paste any lecture link from YouTube (<code className="text-blue-300">youtube.com/watch?v=...</code>, <code className="text-blue-300">youtu.be/...</code>, or shorts). Maktub will stream it cleanly without ads, annotations, or toxic sidebar suggestions.
            </p>

            <form onSubmit={handlePasteSubmit} className="space-y-3">
              <input
                type="text"
                autoFocus
                value={pasteInput}
                onChange={(e) => setPasteInput(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30"
              />

              <div className="flex justify-end gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setShowPasteModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white/40 hover:text-white transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!pasteInput.trim()}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 text-xs font-semibold text-white transition shadow-lg shadow-blue-500/20 cursor-pointer"
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
