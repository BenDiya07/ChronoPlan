import React from 'react';
import { Home, Compass, PlusCircle, Bookmark, ChefHat, Sparkles } from 'lucide-react';
import { NavTab } from './FlutterBottomNavBar';

interface FlutterNavigationRailProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isDarkMode: boolean;
  favoritesCount?: number;
}

/**
 * Flutter Material 3 NavigationRail simulation for Tablet & Wide screens
 * Demonstrates: NavigationRail, leading widget, selectedLabel, badges
 */
export const FlutterNavigationRail: React.FC<FlutterNavigationRailProps> = ({
  currentTab,
  onSelectTab,
  isDarkMode,
  favoritesCount = 0,
}) => {
  const items = [
    { id: 'home' as NavTab, label: 'Home', icon: Home },
    { id: 'explore' as NavTab, label: 'Explore', icon: Compass },
    { id: 'create' as NavTab, label: 'New Recipe', icon: PlusCircle },
    { id: 'favorites' as NavTab, label: 'Favorites', icon: Bookmark, badge: favoritesCount },
  ];

  return (
    <div
      id="flutter-navigation-rail"
      className={`w-20 shrink-0 border-r flex flex-col items-center py-6 select-none transition-colors ${
        isDarkMode
          ? 'bg-stone-900 border-stone-800 text-stone-300'
          : 'bg-[#F7F4F0] border-stone-200/90 text-stone-700'
      }`}
    >
      {/* Leading Brand Header */}
      <div className="flex flex-col items-center gap-1 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-md">
          <ChefHat className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-bold tracking-wider uppercase text-amber-600 dark:text-amber-400">
          Flutter
        </span>
      </div>

      {/* Rail Destinations */}
      <div className="flex-1 flex flex-col items-center gap-6 w-full px-2">
        {items.map((item) => {
          const isActive = currentTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              id={`rail-item-${item.id}`}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex flex-col items-center gap-1.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold'
                  : 'hover:bg-stone-200/50 dark:hover:bg-stone-800 text-stone-500 dark:text-stone-400'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight text-center">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="text-[10px] opacity-40 text-center font-mono">
        v3.x
      </div>
    </div>
  );
};
