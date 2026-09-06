import React from 'react';
import { Play, Compass, BookOpen, Clock, Bookmark } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  savedCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  savedCount,
}) => {
  const tabs = [
    { id: 'sanctuary', label: 'Player', icon: Play },
    { id: 'curated', label: 'Curated', icon: Compass },
    { id: 'notes', label: 'Notes', icon: BookOpen },
    { id: 'focus', label: 'Timer', icon: Clock },
    { id: 'bookmarks', label: 'Saved', icon: Bookmark, badge: savedCount > 0 ? savedCount : null },
  ];

  return (
    <nav 
      id="mobile-bottom-nav"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#02040a]/90 backdrop-blur-xl border-t border-white/10 px-2 py-2 flex items-center justify-around shadow-2xl"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
              isActive ? 'text-blue-400' : 'text-white/40 hover:text-white/80'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px] scale-110' : 'stroke-[1.8px]'}`} />
            <span className="text-[10px] font-medium tracking-tight mt-0.5">{tab.label}</span>

            {isActive && (
              <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-blue-400" />
            )}

            {tab.badge && (
              <span className="absolute top-0 right-2 w-4 h-4 rounded-full bg-blue-600 text-[9px] font-bold text-white flex items-center justify-center border border-white/10">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
