import React, { useState } from 'react';
import { BarChart2, X, Check, RotateCcw, Clock } from 'lucide-react';
import { WeeklyActivityDay } from '../types';

interface EditWeeklyHoursModalProps {
  thisWeek: WeeklyActivityDay[];
  lastWeek: WeeklyActivityDay[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (thisWeek: WeeklyActivityDay[], lastWeek: WeeklyActivityDay[]) => void;
}

export const EditWeeklyHoursModal: React.FC<EditWeeklyHoursModalProps> = ({
  thisWeek,
  lastWeek,
  isOpen,
  onClose,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<'this' | 'last'>('this');
  const [thisWeekHours, setThisWeekHours] = useState<WeeklyActivityDay[]>(thisWeek);
  const [lastWeekHours, setLastWeekHours] = useState<WeeklyActivityDay[]>(lastWeek);

  if (!isOpen) return null;

  const handleHourChange = (dayIndex: number, val: string) => {
    const num = Math.max(0, parseFloat(val) || 0);
    if (activeTab === 'this') {
      const updated = [...thisWeekHours];
      updated[dayIndex] = { ...updated[dayIndex], hours: num };
      setThisWeekHours(updated);
    } else {
      const updated = [...lastWeekHours];
      updated[dayIndex] = { ...updated[dayIndex], hours: num };
      setLastWeekHours(updated);
    }
  };

  const handleResetToZero = () => {
    if (activeTab === 'this') {
      setThisWeekHours(thisWeekHours.map((d) => ({ ...d, hours: 0 })));
    } else {
      setLastWeekHours(lastWeekHours.map((d) => ({ ...d, hours: 0 })));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(thisWeekHours, lastWeekHours);
    onClose();
  };

  const currentList = activeTab === 'this' ? thisWeekHours : lastWeekHours;
  const totalHours = currentList.reduce((acc, d) => acc + d.hours, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0f1426] border border-white/10 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <BarChart2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Edit Weekly Study Hours</h3>
              <p className="text-[11px] text-slate-400">
                Update your actual daily logged study and focus hours.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-between">
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-white/5">
            <button
              type="button"
              onClick={() => setActiveTab('this')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'this'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              This Week ({totalHours.toFixed(1)}h total)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('last')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'last'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Last Week
            </button>
          </div>

          <button
            type="button"
            onClick={handleResetToZero}
            className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1 transition"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset {activeTab === 'this' ? 'This Week' : 'Last Week'}</span>
          </button>
        </div>

        {/* Days Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {currentList.map((dayItem, idx) => (
              <div
                key={dayItem.day}
                className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1 text-center"
              >
                <label className="text-xs font-semibold text-slate-300 block">
                  {dayItem.day}
                </label>
                <div className="relative flex items-center justify-center">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="24"
                    value={dayItem.hours}
                    onChange={(e) => handleHourChange(idx, e.target.value)}
                    className="w-full text-center py-1 rounded-lg bg-slate-900 border border-white/10 text-white text-sm font-mono font-bold focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <span className="text-[10px] text-slate-500">hours</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
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
              <span>Save Study Hours</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
