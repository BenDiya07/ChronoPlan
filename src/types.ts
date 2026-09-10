export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  category?: 'Produce' | 'Dairy' | 'Meat & Seafood' | 'Pantry' | 'Spices' | 'Bakery';
}

export interface RecipeStep {
  stepNumber: number;
  instruction: string;
  durationMinutes?: number;
  tip?: string;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

export interface NutritionInfo {
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: DifficultyLevel;
  rating: number;
  reviewCount: number;
  authorName: string;
  authorAvatar: string;
  authorEmail?: string;
  dietaryTags: string[];
  isFeatured?: boolean;
  isFavorite?: boolean;
  nutrition: NutritionInfo;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  reviews: Review[];
  createdAt: string;
}

export type Category = {
  id: string;
  name: string;
  icon: string;
  count: number;
  color: string;
};

export type AppRoute = 
  | { path: '/'; name: 'home'; label: 'Home'; params?: Record<string, string>; queryParams?: Record<string, string> }
  | { path: '/explore'; name: 'explore'; label: 'Explore'; params?: Record<string, string>; queryParams?: Record<string, string> }
  | { path: '/recipe/:id'; name: 'recipe-detail'; label: 'Recipe Detail'; params: { id: string }; queryParams?: Record<string, string> }
  | { path: '/create'; name: 'create-recipe'; label: 'Add Recipe'; params?: Record<string, string>; queryParams?: Record<string, string> }
  | { path: '/favorites'; name: 'favorites'; label: 'Favorites'; params?: Record<string, string>; queryParams?: Record<string, string> };

export type DeviceViewMode = 'mobile-portrait' | 'mobile-landscape' | 'tablet' | 'responsive';

export interface FlutterRubricItem {
  id: string;
  title: string;
  points: number;
  category: 'Feature' | 'Technical';
  description: string;
  status: 'passed' | 'warning' | 'pending';
  flutterWidgetsUsed: string[];
  evidence: string;
}
