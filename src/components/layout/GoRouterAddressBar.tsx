import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  Compass, 
  Copy, 
  Check, 
  Share2, 
  Smartphone, 
  Tablet, 
  Monitor,
  ExternalLink
} from 'lucide-react';
import { DeviceViewMode } from '../../types';

interface GoRouterAddressBarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  canGoBack: boolean;
  canGoForward: boolean;
  onGoBack: () => void;
  onGoForward: () => void;
  onRefresh: () => void;
  viewMode: DeviceViewMode;
  onViewModeChange: (mode: DeviceViewMode) => void;
}

/**
 * GoRouter simulated address bar & Device viewport switcher
 * Demonstrates: Deep linking, route synchronization, responsive breakpoints
 */
export const GoRouterAddressBar: React.FC<GoRouterAddressBarProps> = ({
  currentPath,
  onNavigate,
  canGoBack,
  canGoForward,
  onGoBack,
  onGoForward,
  onRefresh,
  viewMode,
  onViewModeChange,
}) => {
  const [inputUrl, setInputUrl] = useState(currentPath);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setInputUrl(currentPath);
  }, [currentPath]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onNavigate(inputUrl);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(currentPath);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="gorouter-address-bar"
      className="w-full flex items-center justify-between gap-2 p-2 bg-stone-900 text-stone-200 border-b border-stone-800 text-xs select-none"
    >
      {/* Navigation Controls */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={!canGoBack}
          onClick={onGoBack}
          className={`p-1.5 rounded-lg transition-colors ${
            canGoBack ? 'hover:bg-stone-800 text-stone-300' : 'text-stone-600 cursor-not-allowed'
          }`}
          title="GoRouter pop()"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          disabled={!canGoForward}
          onClick={onGoForward}
          className={`p-1.5 rounded-lg transition-colors ${
            canGoForward ? 'hover:bg-stone-800 text-stone-300' : 'text-stone-600 cursor-not-allowed'
          }`}
          title="GoRouter forward"
        >
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onRefresh}
          className="p-1.5 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition-colors"
          title="Refresh current route"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Simulated Flutter GoRouter URL Input */}
      <div className="flex-1 max-w-lg flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-950/80 border border-stone-800 focus-within:border-amber-500/80">
        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 shrink-0">
          GoRouter
        </span>
        <input
          id="gorouter-url-input"
          type="text"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent text-stone-100 text-xs font-mono focus:outline-none"
          placeholder="/explore?category=italian"
        />
        <button
          type="button"
          onClick={handleCopyUrl}
          className="p-1 text-stone-400 hover:text-stone-200 shrink-0"
          title="Copy route URL"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Viewport Breakpoint Switcher */}
      <div className="flex items-center gap-1 bg-stone-950 p-0.5 rounded-lg border border-stone-800">
        <button
          type="button"
          onClick={() => onViewModeChange('mobile-portrait')}
          className={`p-1.5 rounded-md flex items-center gap-1 text-[11px] font-semibold transition-colors ${
            viewMode === 'mobile-portrait'
              ? 'bg-amber-500 text-stone-950'
              : 'text-stone-400 hover:text-stone-200'
          }`}
          title="Mobile Portrait (iPhone / Pixel)"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Mobile</span>
        </button>

        <button
          type="button"
          onClick={() => onViewModeChange('tablet')}
          className={`p-1.5 rounded-md flex items-center gap-1 text-[11px] font-semibold transition-colors ${
            viewMode === 'tablet'
              ? 'bg-amber-500 text-stone-950'
              : 'text-stone-400 hover:text-stone-200'
          }`}
          title="Tablet Split View (iPad / Android Tablet with Navigation Rail)"
        >
          <Tablet className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Tablet</span>
        </button>

        <button
          type="button"
          onClick={() => onViewModeChange('responsive')}
          className={`p-1.5 rounded-md flex items-center gap-1 text-[11px] font-semibold transition-colors ${
            viewMode === 'responsive'
              ? 'bg-amber-500 text-stone-950'
              : 'text-stone-400 hover:text-stone-200'
          }`}
          title="Full Responsive Web View"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Fluid</span>
        </button>
      </div>
    </div>
  );
};
