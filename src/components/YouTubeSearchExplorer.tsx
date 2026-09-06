import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  Play, 
  Bookmark, 
  Clock, 
  Tag, 
  SlidersHorizontal,
  Compass,
  CheckCircle2,
  ExternalLink,
  Plus
} from 'lucide-react';
import { VideoItem } from '../types';
import { VideoCard3D } from './VideoCard3D';

interface YouTubeSearchExplorerProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: (q: string) => void;
  videos: VideoItem[];
  isLoading: boolean;
  onSelectVideo: (video: VideoItem) => void;
  savedVideos: VideoItem[];
  onToggleBookmark: (video: VideoItem) => void;
  onAddTaskFromVideo: (video: VideoItem) => void;
}

const TOPIC_PRESETS = [
  'All',
  'Data Structures & Algorithms',
  'Computer Architecture (COA)',
  'Operating Systems',
  'Calculus & Linear Algebra',
  'Quantum Physics 3D',
  'System Design',
  'Deep Focus Music',
];

export const YouTubeSearchExplorer: React.FC<YouTubeSearchExplorerProps> = ({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  videos,
  isLoading,
  onSelectVideo,
  savedVideos,
  onToggleBookmark,
  onAddTaskFromVideo,
}) => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredVideos = videos.filter((v) => {
    if (activeFilter === 'All') return true;
    const q = activeFilter.toLowerCase();
    return (
      (v.topic && v.topic.toLowerCase().includes(q)) ||
      (v.title && v.title.toLowerCase().includes(q)) ||
      (v.tags && v.tags.some((t) => t.toLowerCase().includes(q)))
    );
  });

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0f1426] via-[#121933] to-[#0f1426] border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>YOUTUBE RECOMMENDATION ENGINE</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            Search YouTube Topics Distraction-Free
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Search any academic topic, tutorial, or deep study stream just like on YouTube. Every video is mirrored without algorithmic traps, comments, or ads.
          </p>
        </div>

        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 hidden md:block pointer-events-none">
          <Sparkles className="w-48 h-48 text-blue-500" />
        </div>
      </div>

      {/* Quick Topic Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {TOPIC_PRESETS.map((topic) => (
          <button
            key={topic}
            onClick={() => {
              setActiveFilter(topic);
              if (topic !== 'All' && !searchQuery) {
                onSearchSubmit(topic);
              }
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${
              activeFilter === topic
                ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/30'
                : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border-white/5'
            }`}
          >
            {topic}
          </button>
        ))}
      </div>

      {/* Search Results Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="rounded-2xl bg-[#0f1426] border border-white/5 p-3 space-y-3 animate-pulse"
            >
              <div className="aspect-video bg-slate-800/60 rounded-xl" />
              <div className="space-y-2">
                <div className="h-4 bg-slate-800/80 rounded w-3/4" />
                <div className="h-3 bg-slate-800/40 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0f1426] border border-white/5 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto border border-blue-500/20">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-white">No results found</h3>
            <p className="text-xs text-slate-400">
              Try searching for topics like "DSA", "COA", "Calculus", "Physics", or paste a direct YouTube video URL.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {filteredVideos.map((video) => {
            const isBookmarked = savedVideos.some((sv) => sv.id === video.id);

            return (
              <div key={video.id} className="flex flex-col space-y-2 group">
                <VideoCard3D
                  video={video}
                  onSelect={onSelectVideo}
                  isBookmarked={isBookmarked}
                  onToggleBookmark={onToggleBookmark}
                />

                {/* Card Action Row */}
                <div className="flex items-center justify-between px-1 text-xs">
                  <span className="text-[11px] font-mono text-slate-500 truncate max-w-[150px]">
                    {video.channelTitle}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onAddTaskFromVideo(video)}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-[11px] font-medium flex items-center gap-1 transition cursor-pointer"
                      title="Add to today's study tasks"
                    >
                      <Plus className="w-3 h-3 text-blue-400" />
                      <span>Task</span>
                    </button>

                    <button
                      onClick={() => onSelectVideo(video)}
                      className="px-3 py-1 rounded-lg bg-blue-600/80 hover:bg-blue-600 text-white font-medium text-[11px] flex items-center gap-1 transition cursor-pointer shadow"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Watch</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
