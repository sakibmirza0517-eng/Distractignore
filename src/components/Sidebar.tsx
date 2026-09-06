import React from 'react';
import { 
  Home, 
  CheckSquare, 
  Clock, 
  BarChart2, 
  FolderGit2, 
  FileText, 
  Bookmark, 
  Settings, 
  Play, 
  X,
  Compass
} from 'lucide-react';
import { Card3D } from './Card3D';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  tasksCount?: number;
  savedCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  tasksCount = 8,
  savedCount = 0,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'sanctuary', label: 'Player Mirror', icon: Play },
    { id: 'curated', label: 'YouTube Explorer', icon: Compass },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, badge: tasksCount },
    { id: 'pomodoro', label: 'Pomodoro', icon: Clock },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'bookmarks', label: 'Saved', icon: Bookmark, badge: savedCount },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0a0d18] border-r border-white/5 flex flex-col justify-between py-6 px-4 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          {/* Logo & Close on mobile */}
          <div className="flex items-center justify-between px-2">
            <div
              onClick={() => {
                onSelectTab('dashboard');
                onCloseMobile();
              }}
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              {/* Sleek folded ribbon icon */}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform duration-300">
                <svg
                  className="w-5 h-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 16c2-4 4-7 8-7s6 3 8 7" />
                  <path d="M7 19c1.5-2 3-3.5 5-3.5s3.5 1.5 5 3.5" />
                  <circle cx="12" cy="5" r="2" />
                </svg>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-bold tracking-tight text-white leading-tight">
                    BeatMotion
                  </span>
                  <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-1.5 py-0.2 rounded border border-blue-500/20">
                    Maktub
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium tracking-wide">
                  Focus • Build • Grow
                </span>
              </div>
            </div>

            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#3b5bfd] text-white shadow-lg shadow-[#3b5bfd]/35 font-semibold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-medium ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-white/5 text-slate-400 border border-white/5'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Motivational Artwork Card */}
        <div className="pt-4">
          <Card3D intensity={10} className="w-full">
            <div className="relative overflow-hidden rounded-2xl p-4 border border-white/10 shadow-2xl group cursor-pointer">
              {/* Background scenic mountain dusk image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&auto=format&fit=crop&q=80')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d18] via-[#0a0d18]/80 to-transparent" />
              <div className="absolute inset-0 bg-indigo-950/30 mix-blend-multiply" />

              <div className="relative z-10 space-y-2 pt-16">
                <p className="text-xs text-slate-200 font-medium leading-relaxed drop-shadow">
                  Small steps every day lead to big results.
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-white/10">
                  <span className="text-[10px] text-slate-400 font-mono tracking-wider">
                    — BeatMotion
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                </div>
              </div>
            </div>
          </Card3D>
        </div>
      </aside>
    </>
  );
};
