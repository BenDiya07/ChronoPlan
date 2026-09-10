import React from 'react';
import { Star } from 'lucide-react';

interface RatingBadgeWidgetProps {
  rating: number;
  count?: number;
  isLarge?: boolean;
  className?: string;
}

/**
 * Reusable Flutter Widget #2: RatingBadge
 * Corresponding Flutter code: lib/widgets/rating_badge.dart
 */
export const RatingBadgeWidget: React.FC<RatingBadgeWidgetProps> = ({
  rating,
  count,
  isLarge = false,
  className = '',
}) => {
  return (
    <div
      id={`flutter-rating-badge-${rating.toFixed(1)}`}
      className={`inline-flex items-center gap-1.5 rounded-full bg-stone-900/80 backdrop-blur-md px-2.5 py-1 text-white border border-white/20 shadow-sm ${
        isLarge ? 'text-sm px-3 py-1.5' : 'text-xs'
      } ${className}`}
    >
      <Star className={`${isLarge ? 'w-4 h-4' : 'w-3.5 h-3.5'} fill-amber-400 text-amber-400`} />
      <span className="font-bold tracking-tight">{rating.toFixed(1)}</span>
      {count !== undefined && (
        <span className="text-white/70 text-[10px]">({count})</span>
      )}
    </div>
  );
};
