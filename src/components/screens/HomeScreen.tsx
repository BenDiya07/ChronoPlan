import React from 'react';
import { Recipe, Category } from '../../types';
import { RecipeCardWidget } from '../flutter/RecipeCardWidget';
import { FilterChipBarWidget } from '../flutter/FilterChipBarWidget';
import { 
  Sparkles, 
  Search, 
  TrendingUp, 
  ChefHat, 
  Clock, 
  ArrowRight,
  Flame
} from 'lucide-react';

interface HomeScreenProps {
  recipes: Recipe[];
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  onOpenRecipe: (recipeId: string) => void;
  onOpenExplore: (initialQuery?: string, initialCategory?: string) => void;
  onToggleFavorite: (recipeId: string, e: React.MouseEvent) => void;
  isDarkMode: boolean;
}

/**
 * Screen 1: Home Dashboard Screen (Route: '/')
 * Demonstrates: CustomScrollView, SliverAppBar, Horizontal ListView, GridView, Stack & Badges
 */
export const HomeScreen: React.FC<HomeScreenProps> = ({
  recipes,
  categories,
  selectedCategory,
  onSelectCategory,
  onOpenRecipe,
  onOpenExplore,
  onToggleFavorite,
  isDarkMode,
}) => {
  const featuredRecipe = recipes.find((r) => r.isFeatured) || recipes[0];
  const trendingRecipes = recipes.filter((r) => r.rating >= 4.85);
  const filteredRecipes = selectedCategory === 'all'
    ? recipes
    : recipes.filter((r) => r.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div id="flutter-screen-home" className="pb-24 space-y-6">
      {/* Search Header Banner */}
      <div className="px-4 pt-1">
        <div
          onClick={() => onOpenExplore()}
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all border shadow-sm group ${
            isDarkMode
              ? 'bg-stone-900 border-stone-800 text-stone-400 hover:border-amber-500/40'
              : 'bg-white border-stone-200/90 text-stone-500 hover:border-amber-500/50'
          }`}
        >
          <Search className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
          <span className="text-xs flex-1">Search pasta, ramen, tacos, or chefs...</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
            Explore
          </span>
        </div>
      </div>

      {/* Category Chips - Reusable Flutter Widget #3 */}
      <div>
        <div className="px-4 flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Categories
          </h3>
          <button
            type="button"
            onClick={() => onOpenExplore()}
            className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-semibold"
          >
            View all
          </button>
        </div>
        <FilterChipBarWidget
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
          isDark={isDarkMode}
        />
      </div>

      {/* Featured Recipe Hero Spotlight (Stack & Positioned) */}
      {featuredRecipe && (
        <div className="px-4">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Today's Masterclass Pick
            </h2>
          </div>

          <RecipeCardWidget
            recipe={featuredRecipe}
            variant="featured"
            onClick={onOpenRecipe}
            onToggleFavorite={onToggleFavorite}
            isDark={isDarkMode}
          />
        </div>
      )}

      {/* Horizontal ListView: Trending Recipes */}
      <div>
        <div className="px-4 flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-rose-500" />
            <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Top Rated & Trending
            </h2>
          </div>
          <span className="text-xs text-stone-400">
            Flutter ListView.horizontal
          </span>
        </div>

        {/* Flutter Horizontal ListView */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-1 scroll-smooth">
          {trendingRecipes.map((recipe) => (
            <div key={recipe.id} className="w-64 shrink-0">
              <RecipeCardWidget
                recipe={recipe}
                variant="grid"
                onClick={onOpenRecipe}
                onToggleFavorite={onToggleFavorite}
                isDark={isDarkMode}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Grid of All / Filtered Recipes */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <ChefHat className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              {selectedCategory === 'all' ? 'All Recipes' : `${selectedCategory.toUpperCase()} Dishes`}
            </h2>
          </div>
          <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
            {filteredRecipes.length} recipes
          </span>
        </div>

        {/* Flutter GridView.builder */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredRecipes.map((recipe) => (
            <RecipeCardWidget
              key={recipe.id}
              recipe={recipe}
              variant="grid"
              onClick={onOpenRecipe}
              onToggleFavorite={onToggleFavorite}
              isDark={isDarkMode}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
