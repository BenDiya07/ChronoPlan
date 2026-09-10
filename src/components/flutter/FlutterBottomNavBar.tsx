import React from 'react';
import { Home, Compass, PlusCircle, Bookmark, Code2 } from 'lucide-react';
import { motion } from 'motion/react';

export type NavTab = 'home' | 'explore' | 'create' | 'favorites';

interface FlutterBottomNavBarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isDarkMode: boolean;
  favoritesCount?: number;
}

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ElementType;
  route: string;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home, route: '/' },
  { id: 'explore', label: 'Explore', icon: Compass, route: '/explore' },
  { id: 'create', label: 'Add Recipe', icon: PlusCircle, route: '/create' },
  { id: 'favorites', label: 'Favorites', icon: Bookmark, route: '/favorites' },
];

/**
 * Flutter Material 3 NavigationBar simulation
 * Demonstrates: StatefulShellRoute bottom bar with pill indicator & badges
 */
export const FlutterBottomNavBar: React.FC<FlutterBottomNavBarProps> = ({
  currentTab,
  onSelectTab,
  isDarkMode,
  favoritesCount = 0,
}) => {
  return (
    <nav
      id="flutter-bottom-nav-bar"
      className={`relative z-20 w-full px-2 py-1.5 flex items-center justify-around select-none border-t transition-colors ${
        isDarkMode
          ? 'bg-stone-900/95 border-stone-800 text-stone-300'
          : 'bg-[#FBF9F7]/95 border-stone-200/80 text-stone-700'
      }`}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = currentTab === item.id;
        const IconComponent = item.icon;
        const badge = item.id === 'favorites' && favoritesCount > 0 ? favoritesCount : undefined;

        return (
          <button
            key={item.id}
            id={`nav-item-${item.id}`}
            type="button"
            onClick={() => onSelectTab(item.id)}
            className="flex-1 flex flex-col items-center justify-center py-1 relative group cursor-pointer focus:outline-none"
          >
            {/* Active Pill Indicator */}
            <div className="relative flex items-center justify-center">
              {isActive && (
                <motion.div
                  layoutId="flutter-nav-pill"
                  className="absolute inset-0 -mx-3.5 -my-1 rounded-full bg-amber-500/20 dark:bg-amber-500/30"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}

              <div className="relative">
                <IconComponent
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive
                      ? 'text-amber-600 dark:text-amber-400 scale-110'
                      : 'opacity-70 group-hover:opacity-100'
                  }`}
                />

                {badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {badge}
                  </span>
                )}
              </div>
            </div>

            <span
              className={`text-[11px] font-medium tracking-tight mt-1 transition-colors ${
                isActive
                  ? 'text-amber-600 dark:text-amber-400 font-bold'
                  : 'opacity-70'
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
