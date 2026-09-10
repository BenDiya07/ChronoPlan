import React from 'react';
import { Smartphone, Tablet, Monitor } from 'lucide-react';
import { DeviceMode } from '../types/flutterTypes';

interface DeviceFrameProps {
  deviceMode: DeviceMode;
  onDeviceChange: (mode: DeviceMode) => void;
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  deviceMode,
  onDeviceChange,
  children,
}) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-2 md:p-4 overflow-hidden">
      {/* Device Mode Switcher */}
      <div className="mb-3 flex items-center gap-1.5 rounded-full border border-gray-700/60 bg-[#161B22] p-1 shadow-lg">
        <button
          id="device-mode-mobile"
          onClick={() => onDeviceChange('mobile')}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition ${
            deviceMode === 'mobile'
              ? 'bg-[#E50914] text-white shadow'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Smartphone size={14} />
          <span>Mobile (iPhone / Android)</span>
        </button>

        <button
          id="device-mode-tablet"
          onClick={() => onDeviceChange('tablet')}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition ${
            deviceMode === 'tablet'
              ? 'bg-[#E50914] text-white shadow'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Tablet size={14} />
          <span>Tablette (NavigationRail)</span>
        </button>

        <button
          id="device-mode-desktop"
          onClick={() => onDeviceChange('desktop')}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition ${
            deviceMode === 'desktop'
              ? 'bg-[#E50914] text-white shadow'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Monitor size={14} />
          <span>Plein Écran Web</span>
        </button>
      </div>

      {/* Frame Wrapper */}
      <div className="flex flex-1 w-full items-center justify-center overflow-hidden">
        {deviceMode === 'mobile' ? (
          <div className="relative flex h-[92vh] max-h-[780px] w-full max-w-[390px] flex-col overflow-hidden rounded-[42px] border-[8px] border-[#2E3346] bg-black shadow-2xl ring-1 ring-white/10">
            {/* Dynamic Island / Speaker Notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-40 h-4 w-28 rounded-full bg-black flex items-center justify-center">
              <div className="h-2.5 w-2.5 rounded-full bg-neutral-900 ml-auto mr-2" />
            </div>
            <div className="relative flex-1 overflow-hidden">
              {children}
            </div>
            {/* Home Indicator */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-40 h-1 w-32 rounded-full bg-white/20" />
          </div>
        ) : deviceMode === 'tablet' ? (
          <div className="relative flex h-[92vh] max-h-[760px] w-full max-w-[860px] flex-col overflow-hidden rounded-[32px] border-[10px] border-[#2E3346] bg-black shadow-2xl ring-1 ring-white/10">
            <div className="relative flex-1 overflow-hidden">
              {children}
            </div>
          </div>
        ) : (
          <div className="relative flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-[#2E3346] bg-black shadow-2xl">
            <div className="relative flex-1 overflow-hidden">
              {children}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
