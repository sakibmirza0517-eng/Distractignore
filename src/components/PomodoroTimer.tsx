import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Flame, CheckCircle } from 'lucide-react';
import { TimerMode } from '../types';

interface PomodoroTimerProps {
  onSessionComplete?: (mode: TimerMode) => void;
  onPlayChime?: () => void;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  onSessionComplete,
  onPlayChime,
}) => {
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(25 * 60);
  const [totalSeconds, setTotalSeconds] = useState<number>(25 * 60);
  const [completedSessions, setCompletedSessions] = useState<number>(() => {
    return parseInt(localStorage.getItem('maktub_pomodoros') || '0', 10);
  });

  const handleSelectMode = (newMode: TimerMode, durationMins: number) => {
    setIsRunning(false);
    setMode(newMode);
    setRemainingSeconds(durationMins * 60);
    setTotalSeconds(durationMins * 60);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && remainingSeconds > 0) {
      interval = setInterval(() => {
        setRemainingSeconds((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && remainingSeconds === 0) {
      setIsRunning(false);
      if (onPlayChime) onPlayChime();

      if (mode === 'pomodoro') {
        const next = completedSessions + 1;
        setCompletedSessions(next);
        localStorage.setItem('maktub_pomodoros', next.toString());
      }

      if (onSessionComplete) {
        onSessionComplete(mode);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, remainingSeconds, mode, completedSessions, onPlayChime, onSessionComplete]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setRemainingSeconds(totalSeconds);
  };

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const progressPct = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;

  // SVG Circular progress math
  const strokeWidth = 6;
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPct / 100) * circumference;

  return (
    <div 
      id="pomodoro-timer-widget"
      className="flex flex-col items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl shadow-xl space-y-4 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-blue-400 animate-pulse" />
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-[0.2em]">
            Exam Timer
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-blue-400 bg-white/5 px-3 py-1 rounded-full border border-white/10 font-mono">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
          <span>{completedSessions} done</span>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-4 gap-1 w-full bg-white/5 p-1 rounded-xl border border-white/10">
        <button
          onClick={() => handleSelectMode('pomodoro', 25)}
          className={`py-1.5 text-xs font-medium rounded-lg transition cursor-pointer ${
            mode === 'pomodoro' && totalSeconds === 1500
              ? 'bg-blue-600 text-white shadow-[0_0_8px_rgba(59,130,246,0.5)]'
              : 'text-white/40 hover:text-white'
          }`}
        >
          25m
        </button>
        <button
          onClick={() => handleSelectMode('pomodoro', 50)}
          className={`py-1.5 text-xs font-medium rounded-lg transition cursor-pointer ${
            mode === 'pomodoro' && totalSeconds === 3000
              ? 'bg-blue-600 text-white shadow-[0_0_8px_rgba(59,130,246,0.5)]'
              : 'text-white/40 hover:text-white'
          }`}
        >
          50m
        </button>
        <button
          onClick={() => handleSelectMode('shortBreak', 5)}
          className={`py-1.5 text-xs font-medium rounded-lg transition cursor-pointer ${
            mode === 'shortBreak'
              ? 'bg-emerald-600 text-white shadow-[0_0_8px_rgba(16,185,129,0.5)]'
              : 'text-white/40 hover:text-white'
          }`}
        >
          5m Break
        </button>
        <button
          onClick={() => handleSelectMode('longBreak', 15)}
          className={`py-1.5 text-xs font-medium rounded-lg transition cursor-pointer ${
            mode === 'longBreak'
              ? 'bg-emerald-600 text-white shadow-[0_0_8px_rgba(16,185,129,0.5)]'
              : 'text-white/40 hover:text-white'
          }`}
        >
          15m Break
        </button>
      </div>

      {/* Circular Timer Visual */}
      <div className="relative flex items-center justify-center my-2">
        <svg className="w-44 h-44 -rotate-90">
          <circle
            cx="88"
            cy="88"
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx="88"
            cy="88"
            r={radius}
            fill="transparent"
            stroke="url(#timerGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-linear"
          />
          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <span 
            id="pomodoro-time-display"
            className="text-3xl font-mono font-light text-white tracking-tighter tabular-nums"
          >
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </span>
          <span className="text-[10px] font-mono text-white/40 mt-1 uppercase tracking-widest">
            {mode === 'pomodoro' ? 'Deep Cram' : 'Rest Mode'}
          </span>
        </div>
      </div>

      {/* Milestone Progress Bar as in Immersive UI design */}
      <div className="w-full p-3 bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20 rounded-xl space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-blue-400 font-medium">Session Progress</span>
          <span className="text-white/50 font-mono">{Math.round(progressPct)}%</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all duration-500" 
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 w-full justify-center pt-1">
        <button
          id="pomodoro-toggle-btn"
          onClick={toggleTimer}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-xs tracking-wider uppercase transition-all transform hover:scale-105 active:scale-95 cursor-pointer border ${
            isRunning
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-lg shadow-amber-500/20'
              : 'bg-blue-600 hover:bg-blue-500 text-white border-blue-400/50 shadow-lg shadow-blue-500/30'
          }`}
        >
          {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
        </button>

        <button
          id="pomodoro-reset-btn"
          onClick={resetTimer}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition cursor-pointer"
          title="Reset timer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
