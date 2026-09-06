import React, { useState } from 'react';
import { Sparkles, X, Check } from 'lucide-react';
import { MotivationQuote } from '../types';

interface EditQuoteModalProps {
  quote: MotivationQuote;
  isOpen: boolean;
  onClose: () => void;
  onSave: (quote: MotivationQuote) => void;
}

const PRESET_QUOTES: MotivationQuote[] = [
  {
    quote: 'Discipline is the bridge between goals and success.',
    author: 'Jim Rohn',
    bgImageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
  },
  {
    quote: 'It always seems impossible until it is done.',
    author: 'Nelson Mandela',
    bgImageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80',
  },
  {
    quote: 'Focus is a muscle. The more you protect your attention, the stronger you become.',
    author: 'Cal Newport',
    bgImageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop&q=80',
  },
  {
    quote: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.',
    author: 'Aristotle',
    bgImageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80',
  },
];

export const EditQuoteModal: React.FC<EditQuoteModalProps> = ({
  quote,
  isOpen,
  onClose,
  onSave,
}) => {
  const [quoteText, setQuoteText] = useState(quote.quote);
  const [author, setAuthor] = useState(quote.author);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      quote: quoteText.trim() || 'Discipline is the bridge between goals and success.',
      author: author.trim() || 'Jim Rohn',
      bgImageUrl: quote.bgImageUrl,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0f1426] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white">Edit Motivational Quote</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-medium">Your Quote</label>
            <textarea
              value={quoteText}
              onChange={(e) => setQuoteText(e.target.value)}
              rows={3}
              placeholder="Enter motivational quote..."
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs leading-relaxed focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-medium">Author / Attribution</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. Marcus Aurelius"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>

          {/* Quick presets */}
          <div className="space-y-1.5 pt-2">
            <span className="text-[11px] text-slate-500 font-medium">Or select an inspiration:</span>
            <div className="space-y-1">
              {PRESET_QUOTES.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setQuoteText(p.quote);
                    setAuthor(p.author);
                  }}
                  className="w-full text-left p-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 text-[11px] text-slate-300 transition truncate"
                >
                  "{p.quote}" — <span className="text-slate-500">{p.author}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-lg shadow-blue-500/20 transition cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Quote</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
