import React, { useState } from 'react';
import { Recipe, Review } from '../../types';
import { RatingBadgeWidget } from '../flutter/RatingBadgeWidget';
import { StatPillWidget } from '../flutter/StatPillWidget';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Clock, 
  Users, 
  Flame, 
  ChefHat, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Minus, 
  Sparkles,
  Send,
  MessageSquare,
  BookmarkCheck,
  Timer
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RecipeDetailScreenProps {
  recipeId: string;
  source?: string;
  recipes: Recipe[];
  onBack: () => void;
  onToggleFavorite: (recipeId: string, e: React.MouseEvent) => void;
  onAddReview: (recipeId: string, review: Omit<Review, 'id' | 'date'>) => void;
  isDarkMode: boolean;
}

/**
 * Screen 3: Detail Screen with Parameter Passing (Route: '/recipe/:id?from=explore')
 * Demonstrates: GoRouter path & query parameter parsing, Hero animation, dynamic portion scaler, interactive steps checklist
 */
export const RecipeDetailScreen: React.FC<RecipeDetailScreenProps> = ({
  recipeId,
  source,
  recipes,
  onBack,
  onToggleFavorite,
  onAddReview,
  isDarkMode,
}) => {
  const recipe = recipes.find((r) => r.id === recipeId);

  // Dynamic portion scaling
  const [servings, setServings] = useState<number>(recipe?.servings || 2);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState<'ingredients' | 'steps' | 'nutrition' | 'reviews'>('ingredients');

  // New review form
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);

  if (!recipe) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
          Recipe Not Found
        </h2>
        <p className="text-xs text-stone-500">
          No recipe found with route parameter ID: <code>{recipeId}</code>
        </p>
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs"
        >
          Back to List
        </button>
      </div>
    );
  }

  // Portion multiplier calculation
  const multiplier = servings / (recipe.servings || 1);

  const toggleStep = (stepNumber: number) => {
    const updated = new Set(completedSteps);
    if (updated.has(stepNumber)) {
      updated.delete(stepNumber);
    } else {
      updated.add(stepNumber);
    }
    setCompletedSteps(updated);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    onAddReview(recipe.id, {
      author: newReviewAuthor.trim(),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      rating: newReviewRating,
      comment: newReviewComment.trim(),
    });

    setNewReviewAuthor('');
    setNewReviewComment('');
    setShowReviewModal(false);
  };

  const stepProgress = Math.round((completedSteps.size / recipe.steps.length) * 100);

  return (
    <div id={`flutter-screen-detail-${recipe.id}`} className="pb-28">
      {/* Hero Header with Stack & Top App Bar Overlay */}
      <div className="relative aspect-[16/10] w-full bg-stone-900 overflow-hidden">
        {/* Flutter Hero Tag Simulation */}
        <motion.img
          layoutId={`hero-recipe-${recipe.id}`}
          src={recipe.imageUrl}
          alt={recipe.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />

        {/* Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

        {/* Navigation Actions */}
        <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
          <button
            id="flutter-detail-back-btn"
            type="button"
            onClick={onBack}
            className="p-2.5 rounded-full bg-stone-900/60 backdrop-blur-md text-white hover:bg-stone-900/90 transition-colors border border-white/20 cursor-pointer"
            title="Pop route back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <button
              id={`flutter-detail-fav-btn-${recipe.id}`}
              type="button"
              onClick={(e) => onToggleFavorite(recipe.id, e)}
              className="p-2.5 rounded-full bg-stone-900/60 backdrop-blur-md text-white hover:bg-stone-900/90 transition-colors border border-white/20 cursor-pointer"
            >
              <Heart
                className={`w-5 h-5 ${
                  recipe.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Bottom Banner inside Hero Stack */}
        <div className="absolute bottom-4 inset-x-4 text-white">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-stone-950">
              {recipe.category}
            </span>
            <RatingBadgeWidget rating={recipe.rating} count={recipe.reviewCount} isLarge />
          </div>

          <h1 className="text-xl sm:text-2xl font-black leading-tight text-white shadow-xs">
            {recipe.title}
          </h1>

          {source && (
            <p className="text-[10px] text-amber-300/80 font-mono mt-1">
              Passed via GoRouter param: ?from={source}
            </p>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 space-y-5">
        {/* Quick Stats Grid (Flutter Card + Row of StatPills) */}
        <div
          className={`grid grid-cols-3 gap-2.5 p-3 rounded-2xl border ${
            isDarkMode
              ? 'bg-stone-900/80 border-stone-800 text-stone-200'
              : 'bg-white border-stone-200/90 text-stone-800 shadow-xs'
          }`}
        >
          <div className="flex flex-col items-center justify-center p-2 text-center">
            <Clock className="w-4 h-4 text-amber-500 mb-1" />
            <span className="text-[10px] text-stone-400 font-medium">Prep & Cook</span>
            <span className="text-xs font-bold">
              {recipe.prepTimeMinutes + recipe.cookTimeMinutes} mins
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-2 text-center border-x border-stone-200/60 dark:border-stone-800">
            <Users className="w-4 h-4 text-amber-500 mb-1" />
            <span className="text-[10px] text-stone-400 font-medium">Base Portions</span>
            <span className="text-xs font-bold">{recipe.servings} Servings</span>
          </div>

          <div className="flex flex-col items-center justify-center p-2 text-center">
            <Flame className="w-4 h-4 text-rose-500 mb-1" />
            <span className="text-[10px] text-stone-400 font-medium">Calories</span>
            <span className="text-xs font-bold">{recipe.nutrition.calories} kcal</span>
          </div>
        </div>

        {/* Description & Chef Attribution Card */}
        <div
          className={`p-4 rounded-2xl border space-y-3 ${
            isDarkMode
              ? 'bg-stone-900/60 border-stone-800 text-stone-300'
              : 'bg-stone-50 border-stone-200/80 text-stone-700'
          }`}
        >
          <p className="text-xs leading-relaxed">{recipe.description}</p>

          <div className="flex items-center justify-between pt-3 border-t border-stone-200/60 dark:border-stone-800">
            <div className="flex items-center gap-2.5">
              <img
                src={recipe.authorAvatar}
                alt={recipe.authorName}
                className="w-8 h-8 rounded-full object-cover border border-amber-500/40"
                referrerPolicy="no-referrer"
              />
              <div>
                <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                  {recipe.authorName}
                </h4>
                <p className="text-[10px] text-stone-400">
                  {recipe.authorEmail || 'Certified Masterchef'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              {recipe.dietaryTags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Segmented Tabs (Ingredients / Steps / Nutrition / Reviews) */}
        <div className="flex items-center p-1 rounded-xl bg-stone-200/60 dark:bg-stone-800/80 text-xs font-bold">
          {(
            [
              { id: 'ingredients', label: `Ingredients (${recipe.ingredients.length})` },
              { id: 'steps', label: `Steps (${recipe.steps.length})` },
              { id: 'nutrition', label: 'Nutrition' },
              { id: 'reviews', label: `Reviews (${recipe.reviews.length})` },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-1.5 rounded-lg transition-all text-center truncate px-1 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-stone-700 text-amber-600 dark:text-amber-400 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800 dark:text-stone-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Dynamic Scalable Ingredients with Portion Stepper */}
        {activeTab === 'ingredients' && (
          <div className="space-y-3">
            {/* Portion Scaler Stepper */}
            <div
              className={`flex items-center justify-between p-3 rounded-2xl border ${
                isDarkMode
                  ? 'bg-stone-900 border-stone-800'
                  : 'bg-white border-stone-200'
              }`}
            >
              <div>
                <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                  Dynamic Portion Scaler
                </h4>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  Quantities update automatically
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setServings(Math.max(1, servings - 1))}
                  className="w-7 h-7 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 cursor-pointer"
                  title="Decrease portion"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-extrabold text-amber-600 dark:text-amber-400">
                  {servings}
                </span>
                <button
                  type="button"
                  onClick={() => setServings(servings + 1)}
                  className="w-7 h-7 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 cursor-pointer"
                  title="Increase portion"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Ingredients List */}
            <div className="space-y-1.5">
              {recipe.ingredients.map((ing) => {
                const scaledAmount = (ing.amount * multiplier);
                const displayAmount = Number.isInteger(scaledAmount)
                  ? scaledAmount
                  : scaledAmount.toFixed(1);

                return (
                  <div
                    key={ing.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                      isDarkMode
                        ? 'bg-stone-900/60 border-stone-800/80 text-stone-200'
                        : 'bg-white border-stone-200/70 text-stone-800'
                    }`}
                  >
                    <span className="text-xs font-medium">{ing.name}</span>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 shrink-0">
                      {displayAmount} {ing.unit}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Interactive Checkable Steps with Progress Bar */}
        {activeTab === 'steps' && (
          <div className="space-y-3">
            {/* Progress indicator */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs">
              <span className="font-semibold text-amber-700 dark:text-amber-300">
                Step Progress: {completedSteps.size} of {recipe.steps.length} done
              </span>
              <span className="font-bold text-amber-600 dark:text-amber-400">
                {stepProgress}%
              </span>
            </div>

            {/* Steps List */}
            <div className="space-y-2.5">
              {recipe.steps.map((step) => {
                const isDone = completedSteps.has(step.stepNumber);

                return (
                  <div
                    key={step.stepNumber}
                    onClick={() => toggleStep(step.stepNumber)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isDone
                        ? 'bg-emerald-500/5 border-emerald-500/30 text-stone-500 dark:text-stone-400'
                        : isDarkMode
                        ? 'bg-stone-900 border-stone-800 text-stone-200 hover:border-amber-500/40'
                        : 'bg-white border-stone-200 text-stone-800 hover:border-amber-500/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        className="mt-0.5 text-stone-400 hover:text-emerald-500 shrink-0"
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
                        ) : (
                          <Circle className="w-5 h-5 text-stone-300 dark:text-stone-600" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase">
                            Step {step.stepNumber}
                          </span>
                          {step.durationMinutes && (
                            <span className="text-[10px] text-stone-400 flex items-center gap-1">
                              <Timer className="w-3 h-3" />
                              {step.durationMinutes} min
                            </span>
                          )}
                        </div>

                        <p className={`text-xs leading-relaxed ${isDone ? 'line-through opacity-75' : ''}`}>
                          {step.instruction}
                        </p>

                        {step.tip && (
                          <div className="mt-2 p-2 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[11px]">
                            💡 <strong>Chef Tip:</strong> {step.tip}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Nutrition Information */}
        {activeTab === 'nutrition' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2.5">
              <div
                className={`p-3.5 rounded-2xl border text-center ${
                  isDarkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'
                }`}
              >
                <span className="text-[11px] text-stone-400">Total Calories</span>
                <h4 className="text-xl font-extrabold text-amber-500 mt-1">
                  {recipe.nutrition.calories} kcal
                </h4>
              </div>

              <div
                className={`p-3.5 rounded-2xl border text-center ${
                  isDarkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'
                }`}
              >
                <span className="text-[11px] text-stone-400">Protein</span>
                <h4 className="text-xl font-extrabold text-emerald-500 mt-1">
                  {recipe.nutrition.protein}g
                </h4>
              </div>

              <div
                className={`p-3.5 rounded-2xl border text-center ${
                  isDarkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'
                }`}
              >
                <span className="text-[11px] text-stone-400">Carbohydrates</span>
                <h4 className="text-xl font-extrabold text-sky-500 mt-1">
                  {recipe.nutrition.carbs}g
                </h4>
              </div>

              <div
                className={`p-3.5 rounded-2xl border text-center ${
                  isDarkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'
                }`}
              >
                <span className="text-[11px] text-stone-400">Dietary Fats</span>
                <h4 className="text-xl font-extrabold text-rose-500 mt-1">
                  {recipe.nutrition.fat}g
                </h4>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: User Reviews & Add Review */}
        {activeTab === 'reviews' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Community Feedback
              </h4>
              <button
                type="button"
                onClick={() => setShowReviewModal(!showReviewModal)}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Write Review
              </button>
            </div>

            {/* Review Form Drawer / Modal */}
            <AnimatePresence>
              {showReviewModal && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleReviewSubmit}
                  className={`p-3.5 rounded-2xl border space-y-3 overflow-hidden ${
                    isDarkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'
                  }`}
                >
                  <h5 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                    Share your cooking result
                  </h5>

                  <div>
                    <label className="block text-[11px] font-semibold mb-1 text-stone-600 dark:text-stone-400">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newReviewAuthor}
                      onChange={(e) => setNewReviewAuthor(e.target.value)}
                      placeholder="e.g. Culinary Enthusiast"
                      className="w-full text-xs p-2 rounded-lg border bg-transparent border-stone-300 dark:border-stone-700"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold mb-1 text-stone-600 dark:text-stone-400">
                      Rating: {newReviewRating} ★
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReviewRating(star)}
                          className={`text-lg cursor-pointer ${
                            star <= newReviewRating ? 'text-amber-400' : 'text-stone-400'
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold mb-1 text-stone-600 dark:text-stone-400">
                      Review Comments
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      placeholder="How did your dish turn out?"
                      className="w-full text-xs p-2 rounded-lg border bg-transparent border-stone-300 dark:border-stone-700"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowReviewModal(false)}
                      className="px-3 py-1.5 text-xs text-stone-500 hover:text-stone-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      Post Review
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {recipe.reviews.length === 0 ? (
              <div className="py-8 text-center text-xs text-stone-400">
                No reviews yet. Be the first to try and review this recipe!
              </div>
            ) : (
              <div className="space-y-2">
                {recipe.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className={`p-3 rounded-xl border ${
                      isDarkMode ? 'bg-stone-900/60 border-stone-800' : 'bg-white border-stone-200/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <img
                          src={rev.avatar}
                          alt={rev.author}
                          className="w-6 h-6 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                          {rev.author}
                        </span>
                      </div>
                      <div className="flex items-center text-amber-400 text-xs">
                        {'★'.repeat(rev.rating)}
                        <span className="text-[10px] text-stone-400 ml-1.5">{rev.date}</span>
                      </div>
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 pl-8">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
