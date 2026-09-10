import React from 'react';
import { DeviceViewMode } from '../../types';
import { Wifi, Battery, Signal } from 'lucide-react';

interface DeviceFrameProps {
  viewMode: DeviceViewMode;
  isDarkMode: boolean;
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  viewMode,
  isDarkMode,
  children,
}) => {
  if (viewMode === 'responsive') {
    return (
      <div className={`w-full h-full overflow-hidden flex flex-col ${isDarkMode ? 'bg-[#141416]' : 'bg-[#FBF9F7]'}`}>
        {children}
      </div>
    );
  }

  const isTablet = viewMode === 'tablet';

  return (
    <div className="w-full h-full flex items-center justify-center p-2 sm:p-4 overflow-auto bg-stone-950/90">
      {/* Hardware Device Mockup Frame */}
      <div
        id="flutter-device-frame"
        className={`relative rounded-[40px] border-[10px] border-stone-800 shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
          isTablet
            ? 'w-[760px] h-[820px] max-w-full'
            : 'w-[390px] h-[780px] max-w-full'
        } ${isDarkMode ? 'bg-[#141416]' : 'bg-[#FBF9F7]'}`}
      >
        {/* Hardware Notch / Island & Status Bar */}
        <div
          className={`shrink-0 px-6 pt-3 pb-2 flex items-center justify-between text-[11px] font-semibold select-none z-40 transition-colors ${
            isDarkMode ? 'text-stone-300 bg-[#141416]' : 'text-stone-800 bg-[#FBF9F7]'
          }`}
        >
          <span>9:41</span>

          {/* Dynamic Island */}
          <div className="w-24 h-4 bg-stone-900 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-stone-800" />
          </div>

          <div className="flex items-center gap-1.5 opacity-80">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Screen Content Viewport */}
        <div className="flex-1 overflow-y-auto relative no-scrollbar flex flex-col">
          {children}
        </div>

        {/* Hardware Bottom Home Bar */}
        <div className="shrink-0 h-4 flex items-center justify-center pb-1 pointer-events-none bg-transparent">
          <div className={`w-32 h-1 rounded-full ${isDarkMode ? 'bg-stone-700' : 'bg-stone-300'}`} />
        </div>
      </div>
    </div>
  );
};
