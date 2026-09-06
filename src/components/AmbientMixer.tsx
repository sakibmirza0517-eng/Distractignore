import React from 'react';
import { Volume2, CloudRain, Waves, Wind, VolumeX } from 'lucide-react';
import { AmbientSoundType } from '../hooks/useAmbientAudio';

interface AmbientMixerProps {
  activeSound: AmbientSoundType;
  onSelectSound: (sound: AmbientSoundType) => void;
  volume: number;
  onVolumeChange: (val: number) => void;
}

export const AmbientMixer: React.FC<AmbientMixerProps> = ({
  activeSound,
  onSelectSound,
  volume,
  onVolumeChange,
}) => {
  const soundOptions: { type: AmbientSoundType; label: string; icon: React.ReactNode }[] = [
    { type: 'none', label: 'Off', icon: <VolumeX className="w-3.5 h-3.5" /> },
    { type: 'rain', label: 'Rain', icon: <CloudRain className="w-3.5 h-3.5" /> },
    { type: 'binaural', label: '432Hz Waves', icon: <Waves className="w-3.5 h-3.5" /> },
    { type: 'whitenoise', label: 'White Noise', icon: <Wind className="w-3.5 h-3.5" /> },
  ];

  return (
    <div 
      id="ambient-mixer-widget"
      className="p-6 bg-white/5 border border-white/10 rounded-2xl shadow-xl space-y-4 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-blue-400" />
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-[0.2em]">
            Ambient Audio
          </h3>
        </div>
        {activeSound !== 'none' && (
          <span className="text-[10px] font-mono text-blue-400 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10 flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Playing
          </span>
        )}
      </div>

      {/* Preset selector */}
      <div className="grid grid-cols-4 gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10">
        {soundOptions.map((opt) => (
          <button
            key={opt.type}
            onClick={() => onSelectSound(opt.type)}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-medium transition cursor-pointer gap-1 ${
              activeSound === opt.type
                ? 'bg-blue-600 text-white shadow-[0_0_8px_rgba(59,130,246,0.5)]'
                : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            {opt.icon}
            <span className="text-[10px] truncate">{opt.label}</span>
          </button>
        ))}
      </div>

      {/* Volume slider */}
      {activeSound !== 'none' && (
        <div className="flex items-center gap-3 pt-1 text-xs text-white/50">
          <span className="shrink-0 text-[11px]">Mix Level:</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-full accent-blue-500 h-1.5 bg-white/10 rounded-lg cursor-pointer"
          />
          <span className="font-mono text-[11px] shrink-0 w-8 text-right text-white/80">
            {Math.round(volume * 100)}%
          </span>
        </div>
      )}
    </div>
  );
};
