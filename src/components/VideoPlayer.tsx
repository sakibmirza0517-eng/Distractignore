import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, FastForward, Maximize2, Minimize2, 
  Repeat, Volume2, VolumeX, Eye, BookOpen, Clock, Copy, Check, Sparkles 
} from 'lucide-react';
import { VideoItem } from '../types';

interface VideoPlayerProps {
  video: VideoItem;
  initialTimestamp?: number;
  onAddNoteAtTimestamp?: (seconds: number, formatted: string) => void;
  isZenMode: boolean;
  onToggleZenMode: () => void;
  onVideoEnded?: () => void;
  onPasteUrl?: (url: string) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  video,
  initialTimestamp = 0,
  onAddNoteAtTimestamp,
  isZenMode,
  onToggleZenMode,
  onVideoEnded,
  onPasteUrl,
}) => {
  const [pastedUrlInput, setPastedUrlInput] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentSeconds, setCurrentSeconds] = useState<number>(initialTimestamp);
  const [loopA, setLoopA] = useState<number | null>(null);
  const [loopB, setLoopB] = useState<number | null>(null);
  const [isLoopActive, setIsLoopActive] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [lastSeekTime, setLastSeekTime] = useState<number>(initialTimestamp);

  const hasValidVideo = Boolean(video && video.id && video.id.trim());

  // Format seconds to mm:ss or hh:mm:ss
  const formatTime = (totalSeconds: number): string => {
    const s = Math.floor(totalSeconds);
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Build clean embedded URL with zero tracking and zero recommendations
  const embedUrl = hasValidVideo
    ? `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&enablejsapi=1&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1&start=${Math.floor(initialTimestamp)}`
    : '';

  // PostMessage command sender to YouTube player iframe
  const sendPlayerCommand = (func: string, args: any[] = []) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: func,
          args: args,
        }),
        '*'
      );
    }
  };

  // Handle external seek to timestamp (e.g. from study notes click)
  useEffect(() => {
    if (initialTimestamp !== lastSeekTime) {
      sendPlayerCommand('seekTo', [initialTimestamp, true]);
      sendPlayerCommand('playVideo');
      setCurrentSeconds(initialTimestamp);
      setLastSeekTime(initialTimestamp);
    }
  }, [initialTimestamp]);

  // Listen to YouTube Player messages for time updates and state
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        if (typeof event.data === 'string') {
          const data = JSON.parse(event.data);
          if (data.event === 'infoDelivery' && data.info) {
            if (typeof data.info.currentTime === 'number') {
              const cur = data.info.currentTime;
              setCurrentSeconds(cur);

              // Check A-B Loop repeat
              if (isLoopActive && loopA !== null && loopB !== null && loopB > loopA) {
                if (cur >= loopB || cur < loopA - 1) {
                  sendPlayerCommand('seekTo', [loopA, true]);
                }
              }
            }
            if (data.info.playerState === 0 && onVideoEnded) {
              // Video ended
              onVideoEnded();
            }
          }
        }
      } catch {
        // Not a JSON message or unrelated message
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isLoopActive, loopA, loopB, onVideoEnded]);

  // Playback speeds common for university lectures
  const speedOptions = [0.75, 1, 1.25, 1.5, 1.75, 2, 2.5];

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    sendPlayerCommand('setPlaybackRate', [speed]);
  };

  const handleSeek = (deltaSeconds: number) => {
    const target = Math.max(0, currentSeconds + deltaSeconds);
    sendPlayerCommand('seekTo', [target, true]);
    setCurrentSeconds(target);
  };

  const handleToggleMute = () => {
    if (isMuted) {
      sendPlayerCommand('unMute');
      setIsMuted(false);
    } else {
      sendPlayerCommand('mute');
      setIsMuted(true);
    }
  };

  // A-B Loop Controls
  const setPointA = () => {
    setLoopA(currentSeconds);
    setIsLoopActive(true);
  };

  const setPointB = () => {
    setLoopB(currentSeconds);
    setIsLoopActive(true);
  };

  const clearLoop = () => {
    setLoopA(null);
    setLoopB(null);
    setIsLoopActive(false);
  };

  const handleAddNoteNow = () => {
    if (onAddNoteAtTimestamp) {
      onAddNoteAtTimestamp(currentSeconds, formatTime(currentSeconds));
    }
  };

  const handleCopyCleanLink = () => {
    const cleanUrl = `https://youtu.be/${video.id}?t=${Math.floor(currentSeconds)}`;
    navigator.clipboard.writeText(cleanUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div 
      id="distraction-free-player"
      className={`flex flex-col bg-[#050812]/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 ${
        isZenMode ? 'fixed inset-2 sm:inset-6 z-50 bg-[#02040a]/95 backdrop-blur-2xl p-2 sm:p-6 shadow-2xl ring-1 ring-blue-500/40' : ''
      }`}
    >
      {/* Player Header with Mirror Status */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#0a0f1e]/80 border-b border-white/5 text-xs text-white/70">
        <div className="flex items-center gap-3 truncate">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 font-medium text-xs border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            Distraction-Free Mirror
          </span>
          <span className="font-medium text-white truncate max-w-[200px] sm:max-w-[400px]">
            {video.title}
          </span>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            id="copy-clean-link-btn"
            onClick={handleCopyCleanLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition text-xs cursor-pointer"
            title="Copy clean link with current timestamp"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-blue-400" /> : <Copy className="w-3.5 h-3.5 text-white/40" />}
            <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Share Timestamp'}</span>
          </button>

          <button
            id="zen-mode-toggle-btn"
            onClick={onToggleZenMode}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer border ${
              isZenMode 
                ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-500/30' 
                : 'bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border-white/10'
            }`}
            title={isZenMode ? 'Exit Zen Focus Mode' : 'Enter Zen Full-Focus Exam Mode'}
          >
            {isZenMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-blue-400" />}
            <span>{isZenMode ? 'Exit Focus' : 'Zen Focus'}</span>
          </button>
        </div>
      </div>

      {/* Responsive Aspect-Ratio Video Container or Empty State */}
      <div className="relative w-full aspect-video bg-black flex items-center justify-center">
        {hasValidVideo ? (
          <iframe
            ref={iframeRef}
            src={embedUrl}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0"
          />
        ) : (
          <div className="p-6 max-w-md w-full text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto border border-blue-500/30">
              <Play className="w-6 h-6 ml-0.5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">No Lecture Loaded</h3>
              <p className="text-xs text-slate-400 mt-1">
                Paste any YouTube lecture or tutorial link below to study distraction-free.
              </p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (pastedUrlInput.trim() && onPasteUrl) {
                  onPasteUrl(pastedUrlInput.trim());
                  setPastedUrlInput('');
                }
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                placeholder="Paste YouTube link (e.g. youtube.com/watch?v=...)"
                value={pastedUrlInput}
                onChange={(e) => setPastedUrlInput(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-500/20 transition cursor-pointer shrink-0"
              >
                Load
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Custom Exam Study Controls Toolbar */}
      <div className="p-3 sm:p-4 bg-[#0a0f1e]/90 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Seeking & Current Timestamp */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            id="seek-back-10-btn"
            onClick={() => handleSeek(-10)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 transition cursor-pointer"
            title="Rewind 10 seconds"
          >
            <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
            <span>-10s</span>
          </button>

          <button
            id="seek-forward-10-btn"
            onClick={() => handleSeek(10)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 transition cursor-pointer"
            title="Forward 10 seconds"
          >
            <FastForward className="w-3.5 h-3.5 text-blue-400" />
            <span>+10s</span>
          </button>

          <div 
            id="current-play-time"
            className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white font-mono text-xs flex items-center gap-1.5 tabular-nums"
          >
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>{formatTime(currentSeconds)}</span>
          </div>

          <button
            id="toggle-audio-mute-btn"
            onClick={handleToggleMute}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Center: A-B Repeat Loop for Exam Proofs & Tough Sections */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10">
          <span className="text-[11px] font-semibold text-white/40 px-1.5 flex items-center gap-1">
            <Repeat className="w-3 h-3 text-blue-400" />
            <span>A-B Loop:</span>
          </span>

          <button
            id="loop-set-a-btn"
            onClick={setPointA}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition cursor-pointer ${
              loopA !== null ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
            title="Set Loop Start [A]"
          >
            A: {loopA !== null ? formatTime(loopA) : 'Set'}
          </button>

          <button
            id="loop-set-b-btn"
            onClick={setPointB}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition cursor-pointer ${
              loopB !== null ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
            title="Set Loop End [B]"
          >
            B: {loopB !== null ? formatTime(loopB) : 'Set'}
          </button>

          {(loopA !== null || loopB !== null) && (
            <button
              id="loop-clear-btn"
              onClick={clearLoop}
              className="px-2 py-1 rounded-lg text-[10px] text-white/40 hover:text-rose-400 hover:bg-rose-950/40 transition"
              title="Clear Loop"
            >
              Clear
            </button>
          )}
        </div>

        {/* Right: Lecture Speed Controller & Note Trigger */}
        <div className="flex items-center gap-2.5">
          {/* Speed Selector */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-white/40 hidden sm:inline">Speed:</span>
            <div className="flex items-center bg-white/5 rounded-lg p-0.5 border border-white/10">
              {speedOptions.map((spd) => (
                <button
                  key={spd}
                  onClick={() => handleSpeedChange(spd)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition cursor-pointer ${
                    playbackSpeed === spd
                      ? 'bg-blue-600 text-white font-semibold shadow-[0_0_8px_rgba(59,130,246,0.5)]'
                      : 'text-white/50 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          {/* Timestamped Note Button */}
          {onAddNoteAtTimestamp && (
            <button
              id="quick-add-timestamp-note-btn"
              onClick={handleAddNoteNow}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/25 transition cursor-pointer"
              title="Save a study note at this exact second"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>+ Note ({formatTime(currentSeconds)})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
