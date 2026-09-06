import React, { useState } from 'react';
import { Bookmark, Trash2, Check, X, Tag, FileText } from 'lucide-react';
import { VideoItem } from '../types';

interface EditSavedModalProps {
  video: VideoItem;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: VideoItem) => void;
  onDelete: (id: string) => void;
}

export const EditSavedModal: React.FC<EditSavedModalProps> = ({
  video,
  isOpen,
  onClose,
  onSave,
  onDelete,
}) => {
  const [title, setTitle] = useState(video.title);
  const [topic, setTopic] = useState(video.topic || 'General');
  const [customNotes, setCustomNotes] = useState(video.customNotes || '');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>(video.priority || 'Medium');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...video,
      title: title.trim() || video.title,
      topic: topic.trim() || 'General',
      customNotes: customNotes.trim(),
      priority,
    });
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to remove "${video.title}" from saved lectures?`)) {
      onDelete(video.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0f1426] border border-white/10 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-blue-400 fill-current" />
            <h3 className="text-sm font-semibold text-white">Edit Saved Lecture</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Lecture Thumbnail Preview */}
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5">
            <img
              src={video.thumbnail}
              alt=""
              className="w-20 aspect-video object-cover rounded-lg"
            />
            <div className="text-xs space-y-0.5 overflow-hidden">
              <span className="text-[10px] text-blue-400 font-mono">{video.channelTitle}</span>
              <p className="text-slate-300 font-medium truncate">{video.title}</p>
              <span className="text-[10px] text-slate-500 font-mono">ID: {video.id}</span>
            </div>
          </div>

          {/* Title input */}
          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-medium">Custom Lecture Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#090d18] border border-white/10 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Topic & Priority Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <Tag className="w-3 h-3 text-slate-400" />
                <span>Subject / Topic</span>
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Calculus, DSA"
                className="w-full bg-[#090d18] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-medium">Exam Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-[#090d18] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>
          </div>

          {/* Study Notes & Key Formulas */}
          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <FileText className="w-3 h-3 text-slate-400" />
              <span>Personal Exam Notes / Checklist</span>
            </label>
            <textarea
              rows={3}
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="Add key revision concepts, formulas to remember, or homework questions..."
              className="w-full bg-[#090d18] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold border border-rose-500/20 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Saved</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-lg shadow-blue-500/20 transition cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
