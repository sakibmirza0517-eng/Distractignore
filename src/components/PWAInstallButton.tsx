import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share, PlusSquare, X, Check, Smartphone } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);
  const [showDesktopTip, setShowDesktopTip] = useState(false);

  // If already running as standalone app, show small badge or hide
  if (isInstalled) {
    return (
      <div 
        id="pwa-installed-badge"
        className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium"
        title="Running in Native App Mode"
      >
        <Check className="w-3.5 h-3.5" />
        <span>Maktub Installed</span>
      </div>
    );
  }

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      setInstallSuccess(true);
      setTimeout(() => setInstallSuccess(false), 4000);
    }
  };

  // Android / Chromium / Desktop install prompt
  if (isInstallable) {
    return (
      <>
        <button
          id="pwa-install-btn"
          onClick={handleInstallClick}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border border-indigo-400/30 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Install App</span>
        </button>

        {installSuccess && (
          <div 
            id="install-success-toast"
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-xl animate-fade-in"
          >
            <Check className="w-4 h-4" />
            <span>Maktub installed to your home screen!</span>
          </div>
        )}
      </>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          id="pwa-ios-install-btn"
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/70 px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white transition-all duration-200 shadow-sm cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
          <span>Install on iOS</span>
        </button>

        {showIOSGuide && (
          <div 
            id="pwa-ios-modal"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in"
          >
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700/80 p-6 shadow-2xl relative text-slate-100">
              <button
                id="close-ios-modal-btn"
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition p-1"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                  <Smartphone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Install Maktub on iOS</h3>
                  <p className="text-xs text-slate-400">Launch fullscreen without Safari bars</p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/40">
                  <Share className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-white">1. Tap the Share button</span>
                    <p className="text-xs text-slate-400 mt-0.5">Located in Safari's bottom toolbar.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/40">
                  <PlusSquare className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-white">2. Select "Add to Home Screen"</span>
                    <p className="text-xs text-slate-400 mt-0.5">Scroll down in the action sheet and tap Add.</p>
                  </div>
                </div>
              </div>

              <button
                id="dismiss-ios-guide-btn"
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 py-2.5 text-sm font-semibold text-white transition shadow-lg shadow-indigo-600/30"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Generic fallback if user is on standard desktop browser (or prompt not fired yet)
  return (
    <div className="relative">
      <button
        id="pwa-generic-install-btn"
        onClick={() => setShowDesktopTip(!showDesktopTip)}
        className="hidden sm:flex items-center gap-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/70 px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white transition-all duration-200 cursor-pointer"
        title="Install Maktub on your device"
      >
        <Download className="w-3.5 h-3.5 text-indigo-400" />
        <span>Install App</span>
      </button>

      {showDesktopTip && (
        <div 
          id="pwa-desktop-tip"
          className="absolute right-0 top-full mt-2 w-64 p-3 rounded-xl bg-slate-900 border border-slate-700 shadow-xl text-xs text-slate-300 z-50 animate-fade-in"
        >
          <div className="flex justify-between items-center mb-1 font-semibold text-white">
            <span>Install Maktub</span>
            <button onClick={() => setShowDesktopTip(false)} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p>Click the <strong>Install</strong> icon in your browser URL bar or browser menu to install Maktub directly onto your desktop or phone.</p>
        </div>
      )}
    </div>
  );
};
