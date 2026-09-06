import { useEffect, useRef, useState } from 'react';

export type AmbientSoundType = 'none' | 'rain' | 'binaural' | 'whitenoise';

export function useAmbientAudio() {
  const [activeSound, setActiveSound] = useState<AmbientSoundType>('none');
  const [volume, setVolume] = useState<number>(0.3); // 0.0 to 1.0

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceNodeRef = useRef<AudioNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);

  // Initialize or get audio context
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const stopCurrentSound = () => {
    if (sourceNodeRef.current) {
      try {
        if ('stop' in sourceNodeRef.current && typeof (sourceNodeRef.current as AudioScheduledSourceNode).stop === 'function') {
          (sourceNodeRef.current as AudioScheduledSourceNode).stop();
        }
        sourceNodeRef.current.disconnect();
      } catch {
        // Safe tear down
      }
      sourceNodeRef.current = null;
    }
  };

  // Play gentle meditation chime when Pomodoro completes
  const playChime = () => {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Harmonic pleasant bell chime (528Hz Solfeggio frequency)
      osc.frequency.setValueAtTime(528, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1056, ctx.currentTime + 0.1);
      osc.frequency.exponentialRampToValueAtTime(528, ctx.currentTime + 1.2);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 2.6);
    } catch {
      // Ignore audio autoplay restrictions
    }
  };

  // Change sound generator
  useEffect(() => {
    if (activeSound === 'none') {
      stopCurrentSound();
      return;
    }

    try {
      const ctx = getAudioContext();
      stopCurrentSound();

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      if (activeSound === 'binaural') {
        // Binaural 432Hz focus harmonic tone
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(432, ctx.currentTime);
        
        // Low pass filter for soft mellow warmth
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, ctx.currentTime);

        osc.connect(filter);
        filter.connect(masterGain);
        osc.start();
        sourceNodeRef.current = osc;
      } else if (activeSound === 'rain' || activeSound === 'whitenoise') {
        // Synthesize textured noise buffer
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);

        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          if (activeSound === 'rain') {
            // Brown/pink noise algorithm for realistic soothing rain
            data[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = data[i];
            data[i] *= 3.5;
          } else {
            // Soft white noise
            data[i] = white * 0.2;
          }
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        if (activeSound === 'rain') {
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(800, ctx.currentTime);
        } else {
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(1000, ctx.currentTime);
          filter.Q.setValueAtTime(1, ctx.currentTime);
        }

        noise.connect(filter);
        filter.connect(masterGain);
        noise.start();
        sourceNodeRef.current = noise;
        filterNodeRef.current = filter;
      }
    } catch {
      // Audio context restricted until user interaction
    }

    return () => {
      stopCurrentSound();
    };
  }, [activeSound]);

  // Update volume smoothly
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setTargetAtTime(volume, audioCtxRef.current.currentTime, 0.05);
    }
  }, [volume]);

  return {
    activeSound,
    setActiveSound,
    volume,
    setVolume,
    playChime,
  };
}
