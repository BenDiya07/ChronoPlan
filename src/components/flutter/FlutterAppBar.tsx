import React from 'react';
import { 
  ArrowLeft, 
  Sun, 
  Moon, 
  Share2, 
  Bookmark, 
  MoreVertical,
  Layers
} from 'lucide-react';

interface FlutterAppBarProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  actions?: React.ReactNode;
  isScrolled?: boolean;
  onShowInspector?: () => void;
  badgeCount?: number;
}

/**
 * Flutter Material 3 AppBar widget simulation
 * Demonstrates: leading navigation, title, centerTitle: false, scrolledUnderElevation, actions
 */
export const FlutterAppBar: React.FC<FlutterAppBarProps> = ({
  title,
  subtitle,
  showBackButton = false,
  onBack,
  isDarkMode,
  onToggleTheme,
  actions,
  isScrolled = false,
  onShowInspector,
}) => {
  return (
    <header
      id="flutter-app-bar"
      className={`sticky top-0 z-30 transition-all duration-200 px-4 py-2.5 flex items-center justify-between gap-2 select-none ${
        isDarkMode
          ? `bg-stone-900/95 backdrop-blur-md text-stone-100 ${
              isScrolled ? 'border-b border-stone-800 shadow-md' : ''
            }`
          : `bg-[#FBF9F7]/95 backdrop-blur-md text-stone-900 ${
              isScrolled ? 'border-b border-stone-200/80 shadow-sm' : ''
            }`
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {showBackButton && (
          <button
            id="flutter-appbar-back-btn"
            type="button"
            onClick={onBack}
            className={`p-2 -ml-1.5 rounded-full transition-colors cursor-pointer ${
              isDarkMode
                ? 'hover:bg-stone-800 text-stone-200'
                : 'hover:bg-stone-200/80 text-stone-700'
            }`}
            title="Pop route (Back)"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}

        <div className="min-w-0">
          <h1 className="text-lg font-extrabold tracking-tight truncate leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {actions}

        {/* Material 3 Theme Switch */}
        <button
          id="flutter-theme-toggle-btn"
          type="button"
          onClick={onToggleTheme}
          className={`p-2 rounded-full transition-colors cursor-pointer ${
            isDarkMode
              ? 'hover:bg-stone-800 text-amber-400'
              : 'hover:bg-stone-200 text-stone-600'
          }`}
          title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {onShowInspector && (
          <button
            id="flutter-quick-inspector-btn"
            type="button"
            onClick={onShowInspector}
            className="p-2 rounded-full hover:bg-amber-500/10 text-amber-600 dark:text-amber-400 transition-colors"
            title="Inspect Flutter Widget Tree"
          >
            <Layers className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};
