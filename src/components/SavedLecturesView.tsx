import React, { useState } from 'react';
import { 
  Bookmark, 
  Trash2, 
  Edit2, 
  Play, 
  Clock, 
  Tag, 
  Search, 
  FileText,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { VideoItem } from '../types';
import { Card3D } from './Card3D';

interface SavedLecturesViewProps {
  savedVideos: VideoItem[];
  onSelectVideo: (video: VideoItem) => void;
  onEditSaved: (video: VideoItem) => void;
  onDeleteSaved: (id: string) => void;
  onOpenExplorer: () => void;
}

export const SavedLecturesView: React.FC<SavedLecturesViewProps> = ({
  savedVideos,
  onSelectVideo,
  onEditSaved,
  onDeleteSaved,
  onOpenExplorer,
}) => {
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const safeVideos = Array.isArray(savedVideos) ? savedVideos.filter(Boolean) : [];

  const filtered = safeVideos.filter((v) => {
    if (!v) return false;
    const matchPriority = filterPriority === 'All' || v.priority === filterPriority;
    const qLower = searchQuery.trim().toLowerCase();
    const matchQuery =
      !qLower ||
      (v.title && v.title.toLowerCase().includes(qLower)) ||
      (v.topic && v.topic.toLowerCase().includes(qLower)) ||
      (v.channelTitle && v.channelTitle.toLowerCase().includes(qLower)) ||
      (v.customNotes && v.customNotes.toLowerCase().includes(qLower));
    return matchPriority && matchQuery;
  });

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0f1426] border border-white/10 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Bookmark className="w-4 h-4 fill-current" />
            </div>
            <h1 className="text-xl font-bold text-white">Saved Lectures & Library</h1>
          </div>
          <p className="text-xs text-slate-400">
            Manage your curated study lectures. You can edit lecture titles, attach formulas & notes, or delete saved items.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenExplorer}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-lg shadow-blue-500/20 transition cursor-pointer"
          >
            + Discover More
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 w-4 h-4 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved lectures or notes..."
            className="w-full bg-[#0f1426] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['All', 'High', 'Medium', 'Low'].map((pri) => (
            <button
              key={pri}
              onClick={() => setFilterPriority(pri)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${
                filterPriority === pri
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow'
                  : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border-white/5'
              }`}
            >
              {pri === 'All' ? 'All Priorities' : `${pri} Priority`}
            </button>
          ))}
        </div>
      </div>

      {/* Saved Items List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0f1426] border border-white/5 space-y-3">
          <Bookmark className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-semibold text-white">No saved lectures match your filters</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Save any lecture from the YouTube Explorer or player to organize it with custom revision notes and priority tags.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((video) => (
            <Card3D key={video.id} intensity={5}>
              <div className="p-4 rounded-2xl bg-[#0f1426] border border-white/10 hover:border-white/20 transition-all shadow-xl space-y-3 flex flex-col justify-between h-full group">
                {/* Thumbnail with overlay */}
                <div 
                  onClick={() => onSelectVideo(video)}
                  className="relative aspect-video rounded-xl overflow-hidden bg-black cursor-pointer group/art"
                >
                  <img
                    src={video.thumbnail || `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover/art:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {video.priority && (
                    <span className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      video.priority === 'High'
                        ? 'bg-rose-500/90 text-white'
                        : video.priority === 'Medium'
                        ? 'bg-amber-500/90 text-white'
                        : 'bg-blue-500/90 text-white'
                    }`}>
                      {video.priority} Priority
                    </span>
                  )}

                  {video.duration && (
                    <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white/90">
                      {video.duration}
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between text-[11px] text-blue-400 font-mono">
                    <span className="truncate max-w-[180px]">{video.channelTitle}</span>
                    <span className="bg-white/5 px-2 py-0.5 rounded text-slate-400 border border-white/5">
                      {video.topic || 'General'}
                    </span>
                  </div>

                  <h3 
                    onClick={() => onSelectVideo(video)}
                    className="text-xs sm:text-sm font-bold text-white hover:text-blue-400 transition cursor-pointer line-clamp-2"
                  >
                    {video.title}
                  </h3>

                  {video.customNotes && (
                    <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5 text-[11px] text-slate-400 italic line-clamp-2">
                      "{video.customNotes}"
                    </div>
                  )}
                </div>

                {/* Actions Footer: Play, Edit, Delete */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <button
                    onClick={() => onSelectVideo(video)}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Watch</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditSaved(video)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 transition cursor-pointer"
                      title="Edit title, notes, or priority"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`Delete "${video.title}" from saved?`)) {
                          onDeleteSaved(video.id);
                        }
                      }}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition cursor-pointer"
                      title="Delete saved lecture"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </Card3D>
          ))}
        </div>
      )}
    </div>
  );
};
