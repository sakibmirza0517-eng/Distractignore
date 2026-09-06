import React, { useState } from 'react';
import { FileText, Trash2, Check, X, Clock } from 'lucide-react';
import { StudyNote } from '../types';

interface EditNoteModalProps {
  note: StudyNote | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: StudyNote) => void;
  onDelete?: (id: string) => void;
}

export const EditNoteModal: React.FC<EditNoteModalProps> = ({
  note,
  isOpen,
  onClose,
  onSave,
  onDelete,
}) => {
  const [text, setText] = useState(note?.text || '');
  const [videoTitle, setVideoTitle] = useState(note?.videoTitle || 'Lecture Note');
  const [formattedTime, setFormattedTime] = useState(note?.formattedTime || '00:00');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    onSave({
      id: note?.id || `note-${Date.now()}`,
      videoId: note?.videoId || 'WUvTyaaNkzM',
      videoTitle: videoTitle.trim() || 'Study Lecture',
      timestamp: note?.timestamp || 0,
      formattedTime: formattedTime.trim() || '00:00',
      text: text.trim(),
      createdAt: note?.createdAt || Date.now(),
    });
    onClose();
  };

  const handleDelete = () => {
    if (note && onDelete) {
      if (window.confirm('Delete this study note?')) {
        onDelete(note.id);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0f1426] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">
              {note ? 'Edit Lecture Note' : 'Add Study Note'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-medium">Topic / Lecture Reference</label>
            <input
              type="text"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              className="w-full bg-[#090d18] border border-white/10 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>Timestamp</span>
            </label>
            <input
              type="text"
              value={formattedTime}
              onChange={(e) => setFormattedTime(e.target.value)}
              placeholder="e.g. 04:15"
              className="w-full bg-[#090d18] border border-white/10 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-medium">Key Concept / Formula / Definition</label>
            <textarea
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write your exam notes, formula breakdowns, or homework observations..."
              className="w-full bg-[#090d18] border border-white/10 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 resize-none"
              required
              autoFocus
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            {note && onDelete ? (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold border border-rose-500/20 transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            ) : <div />}

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
                <span>{note ? 'Save Note' : 'Add Note'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
