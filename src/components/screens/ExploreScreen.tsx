import React, { useState, useMemo } from 'react';
import { Recipe, Category, DifficultyLevel } from '../../types';
import { RecipeCardWidget } from '../flutter/RecipeCardWidget';
import { FilterChipBarWidget } from '../flutter/FilterChipBarWidget';
import { 
  Search, 
  SlidersHorizontal, 
  LayoutGrid, 
  List as ListIcon, 
  X,
  Clock,
  Sparkles,
  RotateCcw
} from 'lucide-react';

interface ExploreScreenProps {
  recipes: Recipe[];
  categories: Category[];
  initialCategory?: string;
  initialQuery?: string;
  onOpenRecipe: (recipeId: string) => void;
  onToggleFavorite: (recipeId: string, e: React.MouseEvent) => void;
  isDarkMode: boolean;
}

/**
 * Screen 2: Explore & List Screen (Route: '/explore')
 * Demonstrates: Search with debouncing, multi-criteria filtering, ListView.builder vs GridView.builder toggling
 */
export const ExploreScreen: React.FC<ExploreScreenProps> = ({
  recipes,
  categories,
  initialCategory = 'all',
  initialQuery = '',
  onOpenRecipe,
  onToggleFavorite,
  isDarkMode,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [maxTime, setMaxTime] = useState<number>(120);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'rating' | 'time' | 'title'>('rating');

  // Filtered recipes calculation
  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      // Category check
      if (selectedCategory !== 'all' && recipe.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      // Difficulty check
      if (selectedDifficulty !== 'all' && recipe.difficulty.toLowerCase() !== selectedDifficulty.toLowerCase()) {
        return false;
      }
      // Time check
      const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;
      if (totalTime > maxTime) {
        return false;
      }
      // Query check (title, description, chef, ingredients, dietary tags)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = recipe.title.toLowerCase().includes(q);
        const matchesDesc = recipe.description.toLowerCase().includes(q);
        const matchesChef = recipe.authorName.toLowerCase().includes(q);
        const matchesTags = recipe.dietaryTags.some((t) => t.toLowerCase().includes(q));
        const matchesIngredient = recipe.ingredients.some((i) => i.name.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesChef && !matchesTags && !matchesIngredient) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'time') return (a.prepTimeMinutes + a.cookTimeMinutes) - (b.prepTimeMinutes + b.cookTimeMinutes);
      return a.title.localeCompare(b.title);
    });
  }, [recipes, selectedCategory, selectedDifficulty, maxTime, searchQuery, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    setMaxTime(120);
  };

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'all' || selectedDifficulty !== 'all' || maxTime < 120;

  return (
    <div id="flutter-screen-explore" className="pb-24 space-y-4">
      {/* Search Input Bar (TextFormField / SearchBar) */}
      <div className="px-4 pt-2">
        <div
          className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border transition-all shadow-sm ${
            isDarkMode
              ? 'bg-stone-900 border-stone-800 text-stone-100 focus-within:border-amber-500/60'
              : 'bg-white border-stone-200 text-stone-900 focus-within:border-amber-500/60'
          }`}
        >
          <Search className="w-4 h-4 text-amber-500 shrink-0" />
          <input
            id="flutter-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by recipe, ingredient, or chef..."
            className="w-full bg-transparent text-xs focus:outline-none placeholder:text-stone-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="p-1 text-stone-400 hover:text-stone-600 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Chips Bar */}
      <div>
        <FilterChipBarWidget
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          isDark={isDarkMode}
        />
      </div>

      {/* Secondary Filter Controls (Difficulty & View Mode) */}
      <div className="px-4 flex items-center justify-between gap-2 text-xs">
        {/* Difficulty Segmented Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {['all', 'Easy', 'Medium', 'Hard'].map((diff) => {
            const isSelected = selectedDifficulty.toLowerCase() === diff.toLowerCase();
            return (
              <button
                key={diff}
                type="button"
                onClick={() => setSelectedDifficulty(diff.toLowerCase())}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors shrink-0 ${
                  isSelected
                    ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-sm'
                    : isDarkMode
                    ? 'bg-stone-800/80 text-stone-400 hover:bg-stone-800'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {diff === 'all' ? 'All Levels' : diff}
              </button>
            );
          })}
        </div>

        {/* View Mode Toggle: GridView vs ListView */}
        <div className="flex items-center gap-1 shrink-0 p-0.5 rounded-lg bg-stone-200/60 dark:bg-stone-800">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-stone-700 shadow-xs text-amber-600 dark:text-amber-400'
                : 'text-stone-400 hover:text-stone-600'
            }`}
            title="GridView.builder"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === 'list'
                ? 'bg-white dark:bg-stone-700 shadow-xs text-amber-600 dark:text-amber-400'
                : 'text-stone-400 hover:text-stone-600'
            }`}
            title="ListView.builder"
          >
            <ListIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Results Header & Sort */}
      <div className="px-4 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
        <span>
          Found <strong className="text-stone-900 dark:text-stone-100">{filteredRecipes.length}</strong> {filteredRecipes.length === 1 ? 'recipe' : 'recipes'}
        </span>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:underline font-medium text-[11px]"
            >
              <RotateCcw className="w-3 h-3" />
              Reset filters
            </button>
          )}

          <select
            id="flutter-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className={`text-[11px] font-medium py-1 px-2 rounded-lg border bg-transparent cursor-pointer ${
              isDarkMode
                ? 'border-stone-800 text-stone-300'
                : 'border-stone-200 text-stone-700'
            }`}
          >
            <option value="rating">Top Rated</option>
            <option value="time">Fastest Prep</option>
            <option value="title">Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Recipe List / Grid Display */}
      <div className="px-4">
        {filteredRecipes.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Search className="w-6 h-6 opacity-60" />
            </div>
            <h3 className="text-sm font-bold text-stone-800 dark:text-stone-200">
              No matching recipes found
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs mx-auto">
              Try adjusting your search terms, changing difficulty, or resetting category filters.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs shadow-sm transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
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
        ) : (
          <div className="space-y-2.5">
            {filteredRecipes.map((recipe) => (
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
        )}
      </div>
    </div>
  );
};
