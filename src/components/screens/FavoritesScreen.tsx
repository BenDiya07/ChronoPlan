import React, { useState } from 'react';
import { Recipe } from '../../types';
import { RecipeCardWidget } from '../flutter/RecipeCardWidget';
import { Bookmark, Compass, Heart, Trash2 } from 'lucide-react';

interface FavoritesScreenProps {
  recipes: Recipe[];
  onOpenRecipe: (recipeId: string) => void;
  onToggleFavorite: (recipeId: string, e: React.MouseEvent) => void;
  onExploreRecipes: () => void;
  isDarkMode: boolean;
}

/**
 * Screen 5: Favorites & Saved Recipes (Route: '/favorites')
 * Demonstrates: Filtered ListView, Dismissible swipe-to-remove concept, Empty state
 */
export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({
  recipes,
  onOpenRecipe,
  onToggleFavorite,
  onExploreRecipes,
  isDarkMode,
}) => {
  const favoriteRecipes = recipes.filter((r) => r.isFavorite);
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredFavorites = activeCategory === 'all'
    ? favoriteRecipes
    : favoriteRecipes.filter((r) => r.category.toLowerCase() === activeCategory.toLowerCase());

  const categories = Array.from(new Set(favoriteRecipes.map((r) => r.category)));

  return (
    <div id="flutter-screen-favorites" className="pb-24 space-y-4">
      {/* Header */}
      <div className="p-4 border-b border-stone-200/60 dark:border-stone-800 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
            Saved Cookbook
          </h2>
          <p className="text-[10px] text-stone-500">
            {favoriteRecipes.length} saved recipes in local storage
          </p>
        </div>

        {favoriteRecipes.length > 0 && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold">
            {favoriteRecipes.length} Favorites
          </span>
        )}
      </div>

      {favoriteRecipes.length === 0 ? (
        <div className="py-20 px-6 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
            <Heart className="w-8 h-8 opacity-60" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-800 dark:text-stone-200">
              No favorites saved yet
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs mx-auto mt-1">
              Tap the heart icon on any recipe card to save it to your personal cookbook collection.
            </p>
          </div>
          <button
            type="button"
            onClick={onExploreRecipes}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs shadow-md transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            Discover Recipes
          </button>
        </div>
      ) : (
        <div className="px-4 space-y-3">
          {/* Quick Filter Categories if multiple */}
          {categories.length > 1 && (
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  activeCategory === 'all'
                    ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                }`}
              >
                All ({favoriteRecipes.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                    activeCategory === cat
                      ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* List of Saved Recipes */}
          <div className="space-y-2.5">
            {filteredFavorites.map((recipe) => (
              <RecipeCardWidget
                key={recipe.id}
                recipe={recipe}
                variant="list"
                onClick={onOpenRecipe}
                onToggleFavorite={onToggleFavorite}
                isDark={isDarkMode}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
