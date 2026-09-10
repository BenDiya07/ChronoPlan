import React from 'react';
import { Category } from '../../types';
import { 
  Utensils, 
  Pizza, 
  Fish, 
  Flame, 
  Salad, 
  Cake,
  Check
} from 'lucide-react';

interface FilterChipBarWidgetProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  isDark?: boolean;
  showCounts?: boolean;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Utensils,
  Pizza,
  Fish,
  Flame,
  Salad,
  Cake,
};

/**
 * Reusable Flutter Widget #3: FilterChipBar
 * Corresponding Flutter code: lib/widgets/filter_chip_bar.dart
 */
export const FilterChipBarWidget: React.FC<FilterChipBarWidgetProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  isDark = false,
  showCounts = true,
}) => {
  return (
    <div 
      id="flutter-filter-chip-bar"
      className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-4 scroll-smooth"
    >
      {categories.map((cat) => {
        const isSelected = selectedCategory.toLowerCase() === cat.id.toLowerCase();
        const IconComponent = ICON_MAP[cat.icon] || Utensils;

        return (
          <button
            key={cat.id}
            id={`filter-chip-${cat.id}`}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0 cursor-pointer ${
              isSelected
                ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-500/30'
                : isDark
                ? 'bg-stone-800 text-stone-300 hover:bg-stone-750 border border-stone-700/80'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
            }`}
          >
            {isSelected ? (
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            ) : (
              <IconComponent className="w-3.5 h-3.5 opacity-80" />
            )}
            <span>{cat.name}</span>
            {showCounts && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isSelected
                    ? 'bg-amber-700 text-amber-100'
                    : isDark
                    ? 'bg-stone-700 text-stone-400'
                    : 'bg-stone-200 text-stone-600'
                }`}
              >
                {cat.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
