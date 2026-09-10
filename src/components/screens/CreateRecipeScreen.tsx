import React, { useState } from 'react';
import { Recipe, DifficultyLevel } from '../../types';
import { 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  ChefHat, 
  Clock, 
  Users, 
  Sparkles, 
  Flame, 
  Upload,
  Layers,
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CreateRecipeScreenProps {
  onSaveRecipe: (recipe: Recipe) => void;
  onCancel: () => void;
  isDarkMode: boolean;
}

interface FormErrors {
  title?: string;
  category?: string;
  prepTime?: string;
  cookTime?: string;
  servings?: string;
  authorName?: string;
  authorEmail?: string;
  steps?: string;
  ingredients?: string;
}

/**
 * Screen 4: Form with Validation Screen (Route: '/create')
 * Demonstrates: Flutter Form, GlobalKey<FormState>, 6+ validated fields, InputDecoration errorText, DropdownButtonFormField
 */
export const CreateRecipeScreen: React.FC<CreateRecipeScreenProps> = ({
  onSaveRecipe,
  onCancel,
  isDarkMode,
}) => {
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('italian');
  const [prepTime, setPrepTime] = useState('15');
  const [cookTime, setCookTime] = useState('20');
  const [servings, setServings] = useState('4');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Medium');
  const [authorName, setAuthorName] = useState('Chef Alexandre');
  const [authorEmail, setAuthorEmail] = useState('alexandre@cuisine.fr');
  const [stepsText, setStepsText] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80');

  // Dynamic Ingredients List
  const [ingredients, setIngredients] = useState<Array<{ name: string; amount: string; unit: string }>>([
    { name: 'Fresh Basil Leaves', amount: '1', unit: 'handful' },
    { name: 'Extra Virgin Olive Oil', amount: '3', unit: 'tbsp' },
  ]);

  // Selected Dietary Tags
  const [selectedTags, setSelectedTags] = useState<string[]>(['Quick Prep', 'Vegetarian']);

  // Validation State
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Field Validators matching Flutter's TextFormField(validator: (val) => ...)
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 1. Title Validator (Required, min 4 chars)
    if (!title.trim()) {
      newErrors.title = 'Title is required (Flutter Validator)';
    } else if (title.trim().length < 4) {
      newErrors.title = 'Title must be at least 4 characters';
    }

    // 2. Prep Time Validator (Positive integer)
    const prepNum = parseInt(prepTime, 10);
    if (!prepTime || isNaN(prepNum) || prepNum <= 0) {
      newErrors.prepTime = 'Must be > 0 minutes';
    }

    // 3. Cook Time Validator (Non-negative integer)
    const cookNum = parseInt(cookTime, 10);
    if (!cookTime || isNaN(cookNum) || cookNum < 0) {
      newErrors.cookTime = 'Must be >= 0 minutes';
    }

    // 4. Servings Validator (1-50 portions)
    const servingsNum = parseInt(servings, 10);
    if (!servings || isNaN(servingsNum) || servingsNum < 1 || servingsNum > 50) {
      newErrors.servings = 'Enter 1 to 50 servings';
    }

    // 5. Author Email Validator (Regex check)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!authorEmail.trim()) {
      newErrors.authorEmail = 'Chef contact email required';
    } else if (!emailRegex.test(authorEmail.trim())) {
      newErrors.authorEmail = 'Please enter a valid email address';
    }

    // 6. Author Name Validator
    if (!authorName.trim()) {
      newErrors.authorName = 'Chef name is required';
    }

    // 7. Steps Validator (At least 20 chars)
    if (!stepsText.trim()) {
      newErrors.steps = 'Preparation instructions are required';
    } else if (stepsText.trim().length < 20) {
      newErrors.steps = `Provide at least 20 characters (current: ${stepsText.trim().length})`;
    }

    // 8. Ingredients Validator (At least 1 valid ingredient)
    const validIngredients = ingredients.filter((i) => i.name.trim() !== '');
    if (validIngredients.length < 1) {
      newErrors.ingredients = 'Please add at least 1 ingredient with name';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: '1', unit: 'item' }]);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleUpdateIngredient = (index: number, field: 'name' | 'amount' | 'unit', value: string) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    // Parse steps into structured array
    const stepsArray = stepsText
      .split('\n')
      .filter((s) => s.trim().length > 0)
      .map((s, idx) => ({
        stepNumber: idx + 1,
        instruction: s.trim().replace(/^\d+[\.\)]\s*/, ''),
        durationMinutes: 5,
      }));

    // Build new Recipe object
    const newRecipe: Recipe = {
      id: `rec_${Date.now()}`,
      title: title.trim(),
      description: description.trim() || `Fresh homemade ${title.trim()} prepared with authentic culinary technique.`,
      category,
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80',
      prepTimeMinutes: parseInt(prepTime, 10),
      cookTimeMinutes: parseInt(cookTime, 10),
      servings: parseInt(servings, 10),
      difficulty,
      rating: 5.0,
      reviewCount: 1,
      authorName: authorName.trim(),
      authorEmail: authorEmail.trim(),
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      dietaryTags: selectedTags.length > 0 ? selectedTags : ['Chef Special'],
      isFeatured: false,
      isFavorite: false,
      nutrition: {
        calories: 520,
        protein: 24,
        carbs: 58,
        fat: 18,
      },
      ingredients: ingredients
        .filter((i) => i.name.trim() !== '')
        .map((i, idx) => ({
          id: `ing_${Date.now()}_${idx}`,
          name: i.name.trim(),
          amount: parseFloat(i.amount) || 1,
          unit: i.unit.trim() || 'portion',
          category: 'Pantry',
        })),
      steps: stepsArray.length > 0 ? stepsArray : [
        { stepNumber: 1, instruction: stepsText.trim(), durationMinutes: 10 }
      ],
      reviews: [
        {
          id: `rev_${Date.now()}`,
          author: authorName.trim(),
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
          rating: 5,
          date: 'Just now',
          comment: 'Recipe crafted and validated in Flutter Recipe Creator!',
        },
      ],
      createdAt: new Date().toISOString().split('T')[0],
    };

    // Confetti effect!
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });

    // Save and callback
    setTimeout(() => {
      onSaveRecipe(newRecipe);
    }, 400);
  };

  return (
    <div id="flutter-screen-create" className="pb-28">
      {/* Top Banner */}
      <div className="p-4 border-b border-stone-200/60 dark:border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <ChefHat className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Flutter Form & Validator
            </h2>
            <p className="text-[10px] text-stone-500">
              Form(key: _formKey) with 3+ validated inputs
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
        >
          Cancel
        </button>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* Field 1: Title (Validated) */}
        <div>
          <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
            Recipe Title <span className="text-rose-500">*</span>
          </label>
          <div
            className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all ${
              errors.title
                ? 'border-rose-500 bg-rose-500/5 ring-1 ring-rose-500/20'
                : isDarkMode
                ? 'bg-stone-900 border-stone-800 focus-within:border-amber-500'
                : 'bg-white border-stone-200 focus-within:border-amber-500'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <input
              id="form-recipe-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors({ ...errors, title: undefined });
              }}
              placeholder="e.g. Handmade Truffle Tagliatelle"
              className="w-full text-xs bg-transparent focus:outline-none placeholder:text-stone-400"
            />
          </div>
          {errors.title && (
            <p className="flex items-center gap-1 text-[11px] text-rose-500 font-medium mt-1">
              <AlertCircle className="w-3 h-3" />
              {errors.title}
            </p>
          )}
        </div>

        {/* Field 2 & 3: Category & Difficulty */}
        <div className="grid grid-cols-2 gap-3">
          {/* Category Dropdown (DropdownButtonFormField) */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              Cuisine / Category <span className="text-rose-500">*</span>
            </label>
            <select
              id="form-recipe-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full p-2.5 rounded-xl border text-xs font-medium cursor-pointer ${
                isDarkMode
                  ? 'bg-stone-900 border-stone-800 text-stone-200'
                  : 'bg-white border-stone-200 text-stone-800'
              }`}
            >
              <option value="italian">Italian</option>
              <option value="japanese">Japanese</option>
              <option value="mexican">Mexican</option>
              <option value="mediterranean">Mediterranean</option>
              <option value="desserts">Desserts</option>
            </select>
          </div>

          {/* Difficulty Segmented */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              Difficulty
            </label>
            <div className="flex p-0.5 rounded-xl bg-stone-200/70 dark:bg-stone-800 text-xs">
              {(['Easy', 'Medium', 'Hard'] as DifficultyLevel[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    difficulty === d
                      ? 'bg-white dark:bg-stone-700 text-amber-600 dark:text-amber-400 shadow-xs'
                      : 'text-stone-500'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Field 4, 5, 6: Prep Time, Cook Time, Servings (Validated Numeric inputs) */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* Prep Time */}
          <div>
            <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">
              Prep (mins) <span className="text-rose-500">*</span>
            </label>
            <div
              className={`flex items-center gap-1.5 p-2 rounded-xl border ${
                errors.prepTime
                  ? 'border-rose-500 bg-rose-500/5'
                  : isDarkMode
                  ? 'bg-stone-900 border-stone-800'
                  : 'bg-white border-stone-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <input
                id="form-recipe-preptime"
                type="number"
                min="1"
                value={prepTime}
                onChange={(e) => {
                  setPrepTime(e.target.value);
                  if (errors.prepTime) setErrors({ ...errors, prepTime: undefined });
                }}
                className="w-full text-xs bg-transparent focus:outline-none"
              />
            </div>
            {errors.prepTime && (
              <span className="text-[10px] text-rose-500">{errors.prepTime}</span>
            )}
          </div>

          {/* Cook Time */}
          <div>
            <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">
              Cook (mins) <span className="text-rose-500">*</span>
            </label>
            <div
              className={`flex items-center gap-1.5 p-2 rounded-xl border ${
                errors.cookTime
                  ? 'border-rose-500 bg-rose-500/5'
                  : isDarkMode
                  ? 'bg-stone-900 border-stone-800'
                  : 'bg-white border-stone-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <input
                id="form-recipe-cooktime"
                type="number"
                min="0"
                value={cookTime}
                onChange={(e) => {
                  setCookTime(e.target.value);
                  if (errors.cookTime) setErrors({ ...errors, cookTime: undefined });
                }}
                className="w-full text-xs bg-transparent focus:outline-none"
              />
            </div>
            {errors.cookTime && (
              <span className="text-[10px] text-rose-500">{errors.cookTime}</span>
            )}
          </div>

          {/* Servings */}
          <div>
            <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">
              Servings <span className="text-rose-500">*</span>
            </label>
            <div
              className={`flex items-center gap-1.5 p-2 rounded-xl border ${
                errors.servings
                  ? 'border-rose-500 bg-rose-500/5'
                  : isDarkMode
                  ? 'bg-stone-900 border-stone-800'
                  : 'bg-white border-stone-200'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-stone-400" />
              <input
                id="form-recipe-servings"
                type="number"
                min="1"
                max="50"
                value={servings}
                onChange={(e) => {
                  setServings(e.target.value);
                  if (errors.servings) setErrors({ ...errors, servings: undefined });
                }}
                className="w-full text-xs bg-transparent focus:outline-none"
              />
            </div>
            {errors.servings && (
              <span className="text-[10px] text-rose-500">{errors.servings}</span>
            )}
          </div>
        </div>

        {/* Field 7: Chef Name & Author Email (Validated) */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              Chef / Author Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="form-recipe-author"
              type="text"
              value={authorName}
              onChange={(e) => {
                setAuthorName(e.target.value);
                if (errors.authorName) setErrors({ ...errors, authorName: undefined });
              }}
              placeholder="Your Name"
              className={`w-full p-2.5 rounded-xl border text-xs ${
                errors.authorName
                  ? 'border-rose-500 bg-rose-500/5'
                  : isDarkMode
                  ? 'bg-stone-900 border-stone-800 text-stone-200'
                  : 'bg-white border-stone-200 text-stone-800'
              }`}
            />
            {errors.authorName && (
              <span className="text-[10px] text-rose-500">{errors.authorName}</span>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              Chef Email (Regex) <span className="text-rose-500">*</span>
            </label>
            <input
              id="form-recipe-email"
              type="email"
              value={authorEmail}
              onChange={(e) => {
                setAuthorEmail(e.target.value);
                if (errors.authorEmail) setErrors({ ...errors, authorEmail: undefined });
              }}
              placeholder="chef@kitchen.com"
              className={`w-full p-2.5 rounded-xl border text-xs ${
                errors.authorEmail
                  ? 'border-rose-500 bg-rose-500/5'
                  : isDarkMode
                  ? 'bg-stone-900 border-stone-800 text-stone-200'
                  : 'bg-white border-stone-200 text-stone-800'
              }`}
            />
            {errors.authorEmail && (
              <span className="text-[10px] text-rose-500">{errors.authorEmail}</span>
            )}
          </div>
        </div>

        {/* Dynamic Ingredients Manager */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
              Ingredients List <span className="text-rose-500">*</span>
            </label>
            <button
              type="button"
              onClick={handleAddIngredient}
              className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Item
            </button>
          </div>

          <div className="space-y-2">
            {ingredients.map((ing, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ingredient name"
                  value={ing.name}
                  onChange={(e) => handleUpdateIngredient(idx, 'name', e.target.value)}
                  className={`flex-1 p-2 rounded-lg border text-xs ${
                    isDarkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'
                  }`}
                />
                <input
                  type="text"
                  placeholder="Amt"
                  value={ing.amount}
                  onChange={(e) => handleUpdateIngredient(idx, 'amount', e.target.value)}
                  className={`w-14 p-2 rounded-lg border text-xs text-center ${
                    isDarkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'
                  }`}
                />
                <input
                  type="text"
                  placeholder="Unit"
                  value={ing.unit}
                  onChange={(e) => handleUpdateIngredient(idx, 'unit', e.target.value)}
                  className={`w-16 p-2 rounded-lg border text-xs text-center ${
                    isDarkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'
                  }`}
                />
                {ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(idx)}
                    className="p-2 text-stone-400 hover:text-rose-500 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
          {errors.ingredients && (
            <p className="text-[10px] text-rose-500 mt-1">{errors.ingredients}</p>
          )}
        </div>

        {/* Preparation Steps (Validated Multiline TextFormField) */}
        <div>
          <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
            Preparation Steps (1 per line) <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="form-recipe-steps"
            rows={3}
            value={stepsText}
            onChange={(e) => {
              setStepsText(e.target.value);
              if (errors.steps) setErrors({ ...errors, steps: undefined });
            }}
            placeholder="1. Sear ingredients in cast iron until golden&#10;2. Simmer gently with broth for 15 minutes&#10;3. Plate with fresh herbs and serve immediately."
            className={`w-full p-2.5 rounded-xl border text-xs leading-relaxed ${
              errors.steps
                ? 'border-rose-500 bg-rose-500/5 ring-1 ring-rose-500/20'
                : isDarkMode
                ? 'bg-stone-900 border-stone-800'
                : 'bg-white border-stone-200'
            }`}
          />
          {errors.steps && (
            <p className="flex items-center gap-1 text-[11px] text-rose-500 font-medium mt-1">
              <AlertCircle className="w-3 h-3" />
              {errors.steps}
            </p>
          )}
        </div>

        {/* Dietary Tags (FilterChips / Checkboxes) */}
        <div>
          <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
            Dietary & Lifestyle Tags
          </label>
          <div className="flex flex-wrap gap-1.5">
            {['Quick Prep', 'Vegetarian', 'Vegan', 'Gluten-Free', 'High Protein', 'Chef Special'].map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-amber-600 text-white'
                      : isDarkMode
                      ? 'bg-stone-800 text-stone-400 hover:bg-stone-750'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {isSelected ? '✓ ' : ''}{tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Action Button */}
        <div className="pt-2">
          <button
            id="flutter-form-submit-btn"
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-stone-950 font-extrabold text-sm shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            {isSubmitting ? 'Validating & Publishing...' : 'Validate & Publish Recipe'}
          </button>
        </div>
      </form>
    </div>
  );
};
