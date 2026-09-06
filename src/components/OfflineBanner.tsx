import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div 
      id="offline-banner"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-xl bg-white/10 backdrop-blur-xl px-4 py-2.5 text-xs font-medium text-white shadow-2xl border border-white/20 animate-pulse"
    >
      <WifiOff className="w-4 h-4 text-blue-400" />
      <span>Offline Mode — Cached study materials & notes active.</span>
    </div>
  );
};
