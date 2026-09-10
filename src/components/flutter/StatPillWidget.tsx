import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatPillWidgetProps {
  icon: LucideIcon;
  text: string;
  label?: string;
  isDark?: boolean;
  highlight?: boolean;
}

/**
 * Reusable Flutter Widget #4: StatPill
 * Corresponding Flutter code: lib/widgets/stat_pill.dart
 */
export const StatPillWidget: React.FC<StatPillWidgetProps> = ({
  icon: Icon,
  text,
  label,
  isDark = false,
  highlight = false,
}) => {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
        highlight
          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
          : isDark
          ? 'bg-stone-800/80 text-stone-300 border border-stone-700/60'
          : 'bg-stone-100 text-stone-700 border border-stone-200/80'
      }`}
    >
      <Icon className="w-3.5 h-3.5 opacity-80 shrink-0" />
      <span className="font-semibold">{text}</span>
      {label && <span className="text-[11px] opacity-75 font-normal">{label}</span>}
    </div>
  );
};
