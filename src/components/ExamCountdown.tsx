import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, Clock } from 'lucide-react';
import { ExamCountdownData } from '../types';

export const ExamCountdown: React.FC = () => {
  const [exams, setExams] = useState<ExamCountdownData[]>(() => {
    const saved = localStorage.getItem('maktub_exams');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    // Default initial exam target
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    return [
      {
        id: 'ex-1',
        subjectName: 'Midterm / Final Examination',
        examDate: futureDate.toISOString().split('T')[0],
        targetGrade: 'A / 95%+',
        notes: 'Review Lecture Chapters 1-8 and solve practice problem sets.',
      },
    ];
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newGrade, setNewGrade] = useState('A+');
  const [newNotes, setNewNotes] = useState('');

  useEffect(() => {
    localStorage.setItem('maktub_exams', JSON.stringify(exams));
  }, [exams]);

  const handleAddExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newDate) return;

    const newEntry: ExamCountdownData = {
      id: `ex-${Date.now()}`,
      subjectName: newSubject.trim(),
      examDate: newDate,
      targetGrade: newGrade || 'A',
      notes: newNotes.trim(),
    };

    setExams([...exams, newEntry]);
    setNewSubject('');
    setNewDate('');
    setNewNotes('');
    setIsAdding(false);
  };

  const handleDeleteExam = (id: string) => {
    setExams(exams.filter((ex) => ex.id !== id));
  };

  // Calculate days & hours left
  const getTimeRemaining = (dateStr: string) => {
    const target = new Date(dateStr).getTime();
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, isPast: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return { days, hours, isPast: false };
  };

  return (
    <div 
      id="exam-countdown-widget"
      className="p-6 bg-white/5 border border-white/10 rounded-2xl shadow-xl space-y-4 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-400" />
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-[0.2em]">
            Milestones & Exams
          </h3>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-medium border border-white/10 transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-blue-400" />
          <span>{isAdding ? 'Cancel' : 'Add Exam'}</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddExam} className="p-4 rounded-xl bg-white/[0.04] border border-white/10 space-y-3 text-xs">
          <div>
            <label className="block text-white/70 font-medium mb-1">Subject / Course</label>
            <input
              type="text"
              required
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="e.g. Calculus 2, Physics, Organic Chem"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-white/70 font-medium mb-1">Exam Date</label>
              <input
                type="date"
                required
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500/50"
              />
            </div>
            <div>
              <label className="block text-white/70 font-medium mb-1">Target Grade</label>
              <input
                type="text"
                value={newGrade}
                onChange={(e) => setNewGrade(e.target.value)}
                placeholder="A / 90%+"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-white/70 font-medium mb-1">Notes / Scope</label>
            <input
              type="text"
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="Chapters to revise, formula sheet..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs transition shadow-md shadow-blue-500/25"
          >
            Save Exam Target
          </button>
        </form>
      )}

      <div className="space-y-3">
        {exams.map((exam) => {
          const remaining = getTimeRemaining(exam.examDate);
          return (
            <div
              key={exam.id}
              className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/15 hover:bg-white/[0.06] transition flex items-center justify-between gap-3 shadow-sm"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs sm:text-sm font-medium text-white">{exam.subjectName}</h4>
                  {exam.targetGrade && (
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono font-medium">
                      Goal: {exam.targetGrade}
                    </span>
                  )}
                </div>
                {exam.notes && (
                  <p className="text-[11px] text-white/50 leading-snug line-clamp-1">{exam.notes}</p>
                )}
                <div className="text-[11px] text-white/40 flex items-center gap-1.5 pt-0.5">
                  <Calendar className="w-3 h-3 text-white/30" />
                  <span>{new Date(exam.examDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  {remaining.isPast ? (
                    <span className="px-2 py-1 rounded bg-white/5 text-white/40 text-xs font-medium">
                      Completed
                    </span>
                  ) : (
                    <div className="flex items-baseline gap-1 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
                      <span className="text-base font-light font-mono text-blue-400 tabular-nums">{remaining.days}</span>
                      <span className="text-[10px] text-white/40 uppercase font-mono">days</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleDeleteExam(exam.id)}
                  className="p-1 rounded-md text-white/30 hover:text-rose-400 hover:bg-rose-950/40 transition"
                  title="Remove exam"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
