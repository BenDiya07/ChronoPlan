import React from 'react';
import { Recipe } from '../../types';
import { RatingBadgeWidget } from './RatingBadgeWidget';
import { StatPillWidget } from './StatPillWidget';
import { Clock, Users, Flame, Heart } from 'lucide-react';
import { motion } from 'motion/react';

interface RecipeCardWidgetProps {
  recipe: Recipe;
  variant?: 'grid' | 'list' | 'featured';
  onClick: (recipeId: string) => void;
  onToggleFavorite?: (recipeId: string, e: React.MouseEvent) => void;
  isDark?: boolean;
}

/**
 * Reusable Flutter Widget #1: RecipeCard
 * Corresponding Flutter code: lib/widgets/recipe_card.dart
 * Demonstrates: Card, Stack, Positioned, Hero, InkWell, ClipRRect, Material 3 elevation
 */
export const RecipeCardWidget: React.FC<RecipeCardWidgetProps> = ({
  recipe,
  variant = 'grid',
  onClick,
  onToggleFavorite,
  isDark = false,
}) => {
  const isList = variant === 'list';
  const isFeatured = variant === 'featured';

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy':
        return 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20';
      case 'Medium':
        return 'text-amber-600 bg-amber-500/10 border-amber-500/20';
      case 'Hard':
        return 'text-rose-600 bg-rose-500/10 border-rose-500/20';
      default:
        return 'text-stone-600 bg-stone-500/10 border-stone-500/20';
    }
  };

  if (isFeatured) {
    return (
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2 }}
        id={`flutter-card-featured-${recipe.id}`}
        onClick={() => onClick(recipe.id)}
        className="relative w-full rounded-2xl overflow-hidden cursor-pointer shadow-md group border border-stone-200/40 dark:border-stone-800"
      >
        {/* Flutter Stack & Positioned */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-800">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          {/* Gradient Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          
          {/* Positioned Top Left: Rating */}
          <div className="absolute top-3 left-3">
            <RatingBadgeWidget rating={recipe.rating} count={recipe.reviewCount} isLarge />
          </div>

          {/* Positioned Top Right: Favorite Button */}
          <div className="absolute top-3 right-3">
            <button
              id={`fav-btn-${recipe.id}`}
              type="button"
              onClick={(e) => onToggleFavorite?.(recipe.id, e)}
              className="p-2 rounded-full bg-stone-900/60 backdrop-blur-md text-white hover:bg-stone-900/80 transition-colors border border-white/20"
              title={recipe.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart
                className={`w-4 h-4 ${
                  recipe.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'
                }`}
              />
            </button>
          </div>

          {/* Positioned Bottom: Details */}
          <div className="absolute bottom-0 inset-x-0 p-4 text-white">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-stone-950">
                Featured
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getDifficultyColor(recipe.difficulty)} bg-stone-900/80 text-white border-white/20`}>
                {recipe.difficulty}
              </span>
            </div>
            <h3 className="text-lg font-bold leading-snug line-clamp-1 mb-1 group-hover:text-amber-300 transition-colors">
              {recipe.title}
            </h3>
            <p className="text-xs text-stone-300 line-clamp-1 mb-3">
              {recipe.description}
            </p>

            <div className="flex items-center gap-3 text-xs text-stone-200">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                {recipe.prepTimeMinutes + recipe.cookTimeMinutes} mins
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                {recipe.servings} servings
              </span>
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                {recipe.nutrition.calories} kcal
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (isList) {
    return (
      <div
        id={`flutter-card-list-${recipe.id}`}
        onClick={() => onClick(recipe.id)}
        className={`flex items-center gap-3.5 p-2.5 rounded-2xl cursor-pointer transition-all duration-200 border group ${
          isDark
            ? 'bg-stone-900/90 hover:bg-stone-850 border-stone-800 text-stone-100 shadow-sm'
            : 'bg-white hover:bg-stone-50 border-stone-200/80 text-stone-900 shadow-sm'
        }`}
      >
        <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-stone-200 dark:bg-stone-800">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-1 left-1">
            <RatingBadgeWidget rating={recipe.rating} />
          </div>
        </div>

        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              {recipe.category}
            </span>
            <button
              id={`fav-list-btn-${recipe.id}`}
              type="button"
              onClick={(e) => onToggleFavorite?.(recipe.id, e)}
              className="p-1 rounded-full text-stone-400 hover:text-rose-500"
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  recipe.isFavorite ? 'fill-rose-500 text-rose-500' : ''
                }`}
              />
            </button>
          </div>

          <h4 className="text-sm font-bold truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
            {recipe.title}
          </h4>
          <p className="text-xs opacity-75 line-clamp-1 mt-0.5 text-stone-500 dark:text-stone-400">
            {recipe.description}
          </p>

          <div className="flex items-center gap-2 mt-2">
            <StatPillWidget
              icon={Clock}
              text={`${recipe.prepTimeMinutes + recipe.cookTimeMinutes}m`}
              isDark={isDark}
            />
            <StatPillWidget
              icon={Users}
              text={`${recipe.servings} serv`}
              isDark={isDark}
            />
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold border ${getDifficultyColor(recipe.difficulty)}`}>
              {recipe.difficulty}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Standard Grid Card
  return (
    <div
      id={`flutter-card-grid-${recipe.id}`}
      onClick={() => onClick(recipe.id)}
      className={`rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 border group flex flex-col ${
        isDark
          ? 'bg-stone-900/90 hover:bg-stone-850 border-stone-800 text-stone-100 shadow-sm'
          : 'bg-white hover:bg-stone-50 border-stone-200/90 text-stone-900 shadow-sm'
      }`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-200 dark:bg-stone-800">
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
          referrerPolicy="no-referrer"
        />
        
        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5">
          <RatingBadgeWidget rating={recipe.rating} count={recipe.reviewCount} />
        </div>

        <div className="absolute top-2.5 right-2.5">
          <button
            id={`fav-grid-btn-${recipe.id}`}
            type="button"
            onClick={(e) => onToggleFavorite?.(recipe.id, e)}
            className="p-1.5 rounded-full bg-stone-900/60 backdrop-blur-md text-white hover:bg-stone-900/90 transition-colors border border-white/20"
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                recipe.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'
              }`}
            />
          </button>
        </div>

        {/* Bottom Tag */}
        <div className="absolute bottom-2 left-2">
          <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider backdrop-blur-md bg-stone-900/75 text-white border border-white/20`}>
            {recipe.category}
          </span>
        </div>
      </div>

      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-sm font-bold line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
            {recipe.title}
          </h4>
          <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 mt-1">
            {recipe.description}
          </p>
        </div>

        <div className="flex items-center justify-between gap-1 mt-3 pt-2 border-t border-stone-100 dark:border-stone-800/80">
          <div className="flex items-center gap-1.5">
            <StatPillWidget
              icon={Clock}
              text={`${recipe.prepTimeMinutes + recipe.cookTimeMinutes}m`}
              isDark={isDark}
            />
            <StatPillWidget
              icon={Users}
              text={`${recipe.servings}p`}
              isDark={isDark}
            />
          </div>
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold border ${getDifficultyColor(recipe.difficulty)}`}>
            {recipe.difficulty}
          </span>
        </div>
      </div>
    </div>
  );
};
