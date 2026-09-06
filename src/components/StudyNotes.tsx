import React, { useState } from 'react';
import { BookOpen, Clock, Trash2, Plus, Download, Copy, Check, FileText } from 'lucide-react';
import { StudyNote } from '../types';

interface StudyNotesProps {
  notes: StudyNote[];
  currentVideoId: string;
  currentVideoTitle: string;
  onAddNote: (timestamp: number, formattedTime: string, text: string) => void;
  onDeleteNote: (noteId: string) => void;
  onJumpToTimestamp: (timestamp: number) => void;
  currentVideoTime?: number;
}

export const StudyNotes: React.FC<StudyNotesProps> = ({
  notes,
  currentVideoId,
  currentVideoTitle,
  onAddNote,
  onDeleteNote,
  onJumpToTimestamp,
  currentVideoTime = 0,
}) => {
  const [newNoteText, setNewNoteText] = useState('');
  const [copiedAll, setCopiedAll] = useState(false);

  // Filter notes for the active video or show all with video title
  const currentVideoNotes = notes.filter((n) => n.videoId === currentVideoId);

  const formatSeconds = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    const formatted = formatSeconds(currentVideoTime);
    onAddNote(currentVideoTime, formatted, newNoteText.trim());
    setNewNoteText('');
  };

  // Export notes as Markdown file
  const handleDownloadMarkdown = () => {
    if (currentVideoNotes.length === 0) return;
    let md = `# Exam Study Notes: ${currentVideoTitle}\n\n`;
    md += `*Generated via Maktub Distraction-Free Study Sanctuary*\n\n`;
    md += `| Timestamp | Note |\n| --- | --- |\n`;
    currentVideoNotes.forEach((n) => {
      md += `| **${n.formattedTime}** | ${n.text} |\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Maktub-Notes-${currentVideoId}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyAllNotes = () => {
    if (currentVideoNotes.length === 0) return;
    const text = currentVideoNotes
      .map((n) => `[${n.formattedTime}] ${n.text}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 3000);
  };

  return (
    <div 
      id="study-notes-panel"
      className="flex flex-col h-full bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl backdrop-blur-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-[#0a0f1e]/60 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <BookOpen className="w-4 h-4 text-blue-400" />
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-[0.2em]">
            Selected Notes
          </h3>
          <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-blue-400">
            {currentVideoNotes.length}
          </span>
        </div>

        {currentVideoNotes.length > 0 && (
          <div className="flex items-center gap-1.5">
            <button
              id="copy-all-notes-btn"
              onClick={handleCopyAllNotes}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition text-xs cursor-pointer"
              title="Copy all notes to clipboard"
            >
              {copiedAll ? <Check className="w-3.5 h-3.5 text-blue-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              id="export-markdown-btn"
              onClick={handleDownloadMarkdown}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition text-xs cursor-pointer"
              title="Export as Markdown (.md)"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Quick Add Note Input */}
      <form onSubmit={handleFormSubmit} className="p-3.5 bg-white/[0.02] border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="shrink-0 px-2.5 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-xs flex items-center gap-1 tabular-nums">
            <Clock className="w-3 h-3 text-blue-400" />
            <span>{formatSeconds(currentVideoTime)}</span>
          </div>

          <input
            type="text"
            id="new-note-input"
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            placeholder="Write key exam formula or concept..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
          />

          <button
            type="submit"
            id="add-note-submit-btn"
            disabled={!newNoteText.trim()}
            className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-30 text-white transition shadow-md shadow-blue-500/20 cursor-pointer"
            title="Add timestamped note"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[380px]">
        {currentVideoNotes.length === 0 ? (
          <div className="text-center py-10 px-4 text-white/30 space-y-2">
            <FileText className="w-8 h-8 mx-auto opacity-30 text-blue-400" />
            <p className="text-xs text-white/50">No notes added for this lecture yet.</p>
            <p className="text-[11px] text-white/30">
              Type above or click <span className="text-blue-400 font-medium">+ Note</span> in the player to capture exam points.
            </p>
          </div>
        ) : (
          currentVideoNotes.map((note) => (
            <div
              key={note.id}
              id={`note-card-${note.id}`}
              className="group p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/15 hover:bg-white/[0.06] transition-all duration-200 flex items-start justify-between gap-3 shadow-sm"
            >
              <div className="space-y-1.5 flex-1">
                <button
                  onClick={() => onJumpToTimestamp(note.timestamp)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-600 hover:text-white hover:border-blue-500 text-xs font-mono font-medium transition cursor-pointer tabular-nums"
                  title="Click to jump player to this timestamp"
                >
                  <Clock className="w-3 h-3" />
                  <span>{note.formattedTime}</span>
                </button>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed break-words pl-0.5">
                  {note.text}
                </p>
              </div>

              <button
                onClick={() => onDeleteNote(note.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-white/40 hover:text-rose-400 hover:bg-rose-950/40 transition"
                title="Delete note"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
