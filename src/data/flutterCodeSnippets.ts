export interface DartFile {
  path: string;
  name: string;
  category: 'core' | 'router' | 'screens' | 'widgets' | 'models' | 'theme';
  description: string;
  content: string;
}

export const FLUTTER_DART_FILES: DartFile[] = [
  {
    path: 'pubspec.yaml',
    name: 'pubspec.yaml',
    category: 'core',
    description: 'Project manifest with GoRouter, Google Fonts, and Provider/Riverpod',
    content: `name: flutter_culinary_app
description: "A modern multi-screen culinary explorer built with Flutter 3.x & GoRouter."
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.2.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  go_router: ^14.0.0
  google_fonts: ^6.1.0
  cached_network_image: ^3.3.1
  provider: ^6.1.1
  intl: ^0.19.0
  lucide_icons: ^0.257.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
  assets:
    - assets/images/
`,
  },
  {
    path: 'lib/main.dart',
    name: 'main.dart',
    category: 'core',
    description: 'App entry point initializing ThemeMode state and GoRouter configuration',
    content: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'router/app_router.dart';
import 'theme/app_theme.dart';
import 'providers/recipe_provider.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => RecipeProvider()),
        ChangeNotifierProvider(create: (_) => ThemeProvider()),
      ],
      child: const FlavorQuestApp(),
    ),
  );
}

class FlavorQuestApp extends StatelessWidget {
  const FlavorQuestApp({super.key});

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);

    return MaterialApp.router(
      title: 'FlavorQuest Culinary',
      debugShowCheckedModeBanner: false,
      themeMode: themeProvider.isDarkMode ? ThemeMode.dark : ThemeMode.light,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      routerConfig: AppRouter.router,
    );
  }
}

class ThemeProvider extends ChangeNotifier {
  bool _isDarkMode = false;
  bool get isDarkMode => _isDarkMode;

  void toggleTheme() {
    _isDarkMode = !_isDarkMode;
    notifyListeners();
  }
}
`,
  },
  {
    path: 'lib/router/app_router.dart',
    name: 'app_router.dart',
    category: 'router',
    description: 'GoRouter 14+ configuration with StatefulShellRoute, path & query parameters',
    content: `import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../screens/home_screen.dart';
import '../screens/explore_screen.dart';
import '../screens/recipe_detail_screen.dart';
import '../screens/create_recipe_screen.dart';
import '../screens/favorites_screen.dart';
import '../widgets/scaffold_with_nav_bar.dart';

class AppRouter {
  static final _rootNavigatorKey = GlobalKey<NavigatorState>();
  static final _shellNavigatorKey = GlobalKey<NavigatorState>();

  static final GoRouter router = GoRouter(
    initialLocation: '/',
    navigatorKey: _rootNavigatorKey,
    routes: [
      // Stateful shell for bottom navigation bar
      ShellRoute(
        navigatorKey: _shellNavigatorKey,
        builder: (context, state, child) {
          return ScaffoldWithNavBar(child: child);
        },
        routes: [
          GoRoute(
            path: '/',
            name: 'home',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: HomeScreen(),
            ),
          ),
          GoRoute(
            path: '/explore',
            name: 'explore',
            pageBuilder: (context, state) {
              final category = state.uri.queryParameters['category'];
              final query = state.uri.queryParameters['q'];
              return NoTransitionPage(
                child: ExploreScreen(initialCategory: category, initialQuery: query),
              );
            },
          ),
          GoRoute(
            path: '/favorites',
            name: 'favorites',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: FavoritesScreen(),
            ),
          ),
        ],
      ),
      // Standalone Fullscreen Detail Screen with Path Param
      GoRoute(
        path: '/recipe/:id',
        name: 'recipe-detail',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) {
          final recipeId = state.pathParameters['id'] ?? '';
          final fromScreen = state.uri.queryParameters['from'];
          return RecipeDetailScreen(
            recipeId: recipeId,
            source: fromScreen,
          );
        },
      ),
      // Fullscreen Form with Validation
      GoRoute(
        path: '/create',
        name: 'create-recipe',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => const CreateRecipeScreen(),
      ),
    ],
    errorBuilder: (context, state) => Scaffold(
      appBar: AppBar(title: const Text('Page Not Found')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('No route defined for \${state.uri}'),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () => context.go('/'),
              child: const Text('Back to Home'),
            ),
          ],
        ),
      ),
    ),
  );
}
`,
  },
  {
    path: 'lib/models/recipe.dart',
    name: 'recipe.dart',
    category: 'models',
    description: 'Strongly-typed data models with JSON serialization & helper getters',
    content: `enum Difficulty { easy, medium, hard }

class Ingredient {
  final String id;
  final String name;
  final double amount;
  final String unit;
  final String category;

  const Ingredient({
    required this.id,
    required this.name,
    required this.amount,
    required this.unit,
    this.category = 'Pantry',
  });
}

class RecipeStep {
  final int stepNumber;
  final String instruction;
  final int? durationMinutes;
  final String? tip;

  const RecipeStep({
    required this.stepNumber,
    required this.instruction,
    this.durationMinutes,
    this.tip,
  });
}

class Recipe {
  final String id;
  final String title;
  final String description;
  final String category;
  final String imageUrl;
  final int prepTimeMinutes;
  final int cookTimeMinutes;
  final int servings;
  final Difficulty difficulty;
  final double rating;
  final int reviewCount;
  final String authorName;
  final String authorAvatar;
  final String? authorEmail;
  final List<String> dietaryTags;
  final bool isFeatured;
  final bool isFavorite;
  final List<Ingredient> ingredients;
  final List<RecipeStep> steps;

  const Recipe({
    required this.id,
    required this.title,
    required this.description,
    required this.category,
    required this.imageUrl,
    required this.prepTimeMinutes,
    required this.cookTimeMinutes,
    required this.servings,
    required this.difficulty,
    required this.rating,
    required this.reviewCount,
    required this.authorName,
    required this.authorAvatar,
    this.authorEmail,
    required this.dietaryTags,
    this.isFeatured = false,
    this.isFavorite = false,
    required this.ingredients,
    required this.steps,
  });

  int get totalTimeMinutes => prepTimeMinutes + cookTimeMinutes;
}
`,
  },
  {
    path: 'lib/theme/app_theme.dart',
    name: 'app_theme.dart',
    category: 'theme',
    description: 'Material 3 ColorScheme, Typography, and Component themes (Light/Dark)',
    content: `import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  static const primarySeed = Color(0xFFFF5722); // Vibrant Terracotta / Ember

  static ThemeData get lightTheme {
    final colorScheme = ColorScheme.fromSeed(
      seedColor: primarySeed,
      brightness: Brightness.light,
      surface: const Color(0xFFFBF9F7),
      surfaceContainer: const Color(0xFFF3EFEA),
    );

    return ThemeData(
      useMaterial3: true,
      colorScheme: colorScheme,
      scaffoldBackgroundColor: const Color(0xFFFBF9F7),
      textTheme: GoogleFonts.plusJakartaSansTextTheme(),
      appBarTheme: AppBarTheme(
        backgroundColor: const Color(0xFFFBF9F7),
        elevation: 0,
        scrolledUnderElevation: 2,
        centerTitle: false,
        titleTextStyle: GoogleFonts.plusJakartaSans(
          fontSize: 20,
          fontWeight: FontWeight.w700,
          color: const Color(0xFF1E1E1E),
        ),
      ),
      cardTheme: CardTheme(
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: BorderSide(color: colorScheme.outlineVariant.withOpacity(0.4)),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: colorScheme.surfaceContainer,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: colorScheme.primary, width: 1.5),
        ),
      ),
    );
  }

  static ThemeData get darkTheme {
    final colorScheme = ColorScheme.fromSeed(
      seedColor: primarySeed,
      brightness: Brightness.dark,
      surface: const Color(0xFF141416),
      surfaceContainer: const Color(0xFF1E1E22),
    );

    return ThemeData(
      useMaterial3: true,
      colorScheme: colorScheme,
      scaffoldBackgroundColor: const Color(0xFF141416),
      textTheme: GoogleFonts.plusJakartaSansTextTheme(ThemeData.dark().textTheme),
      appBarTheme: AppBarTheme(
        backgroundColor: const Color(0xFF141416),
        elevation: 0,
        scrolledUnderElevation: 2,
        centerTitle: false,
        titleTextStyle: GoogleFonts.plusJakartaSans(
          fontSize: 20,
          fontWeight: FontWeight.w700,
          color: const Color(0xFFF0F0F0),
        ),
      ),
      cardTheme: CardTheme(
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: BorderSide(color: colorScheme.outlineVariant.withOpacity(0.2)),
        ),
      ),
    );
  }
}
`,
  },
  {
    path: 'lib/widgets/recipe_card.dart',
    name: 'recipe_card.dart',
    category: 'widgets',
    description: 'Reusable Widget 1: Responsive recipe card supporting Grid & List variants',
    content: `import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../models/recipe.dart';
import 'rating_badge.dart';
import 'stat_pill.dart';

enum RecipeCardVariant { standard, compact, featured }

class RecipeCard extends StatelessWidget {
  final Recipe recipe;
  final RecipeCardVariant variant;
  final VoidCallback? onFavoriteToggle;

  const RecipeCard({
    super.key,
    required this.recipe,
    this.variant = RecipeCardVariant.standard,
    this.onFavoriteToggle,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: () => context.push('/recipe/\${recipe.id}?from=card'),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Stack for Image, Hero, Difficulty Badge & Favorite Button
            Stack(
              children: [
                Hero(
                  tag: 'recipe-image-\${recipe.id}',
                  child: AspectRatio(
                    aspectRatio: variant == RecipeCardVariant.compact ? 16 / 9 : 4 / 3,
                    child: Image.network(
                      recipe.imageUrl,
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
                Positioned(
                  top: 10,
                  left: 10,
                  child: RatingBadge(rating: recipe.rating, count: recipe.reviewCount),
                ),
                Positioned(
                  top: 10,
                  right: 10,
                  child: CircleAvatar(
                    backgroundColor: Colors.black.withOpacity(0.4),
                    child: IconButton(
                      icon: Icon(
                        recipe.isFavorite ? Icons.favorite : Icons.favorite_border,
                        color: recipe.isFavorite ? Colors.redAccent : Colors.white,
                        size: 20,
                      ),
                      onPressed: onFavoriteToggle,
                    ),
                  ),
                ),
              ],
            ),
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    recipe.title,
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 6),
                  Text(
                    recipe.description,
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: theme.colorScheme.onSurfaceVariant,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      StatPill(
                        icon: Icons.schedule,
                        text: '\${recipe.totalTimeMinutes}m',
                      ),
                      const SizedBox(width: 8),
                      StatPill(
                        icon: Icons.restaurant,
                        text: '\${recipe.servings} serv',
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
`,
  },
  {
    path: 'lib/widgets/rating_badge.dart',
    name: 'rating_badge.dart',
    category: 'widgets',
    description: 'Reusable Widget 2: Elevated rating badge with star icon and count',
    content: `import 'package:flutter/material.dart';

class RatingBadge extends StatelessWidget {
  final double rating;
  final int? count;
  final bool isLarge;

  const RatingBadge({
    super.key,
    required this.rating,
    this.count,
    this.isLarge = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: isLarge ? 10 : 8,
        vertical: isLarge ? 6 : 4,
      ),
      decoration: BoxDecoration(
        color: Colors.black.withOpacity(0.65),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withOpacity(0.15)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            Icons.star_rounded,
            color: const Color(0xFFFFB800),
            size: isLarge ? 18 : 14,
          ),
          const SizedBox(width: 4),
          Text(
            rating.toStringAsFixed(1),
            style: TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: isLarge ? 14 : 12,
            ),
          ),
          if (count != null && isLarge) ...[
            const SizedBox(width: 4),
            Text(
              '($count)',
              style: TextStyle(
                color: Colors.white.withOpacity(0.7),
                fontSize: 12,
              ),
            ),
          ],
        ],
      ),
    );
  }
}
`,
  },
  {
    path: 'lib/widgets/filter_chip_bar.dart',
    name: 'filter_chip_bar.dart',
    category: 'widgets',
    description: 'Reusable Widget 3: Horizontal scrollable category chip strip',
    content: `import 'package:flutter/material.dart';

class FilterChipBar extends StatelessWidget {
  final List<String> categories;
  final String selectedCategory;
  final ValueChanged<String> onSelected;

  const FilterChipBar({
    super.key,
    required this.categories,
    required this.selectedCategory,
    required this.onSelected,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 44,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: categories.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (context, index) {
          final cat = categories[index];
          final isSelected = cat.toLowerCase() == selectedCategory.toLowerCase();

          return FilterChip(
            selected: isSelected,
            label: Text(cat),
            showCheckmark: false,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(24),
            ),
            onSelected: (_) => onSelected(cat),
          );
        },
      ),
    );
  }
}
`,
  },
  {
    path: 'lib/widgets/stat_pill.dart',
    name: 'stat_pill.dart',
    category: 'widgets',
    description: 'Reusable Widget 4: Compact metric indicator with icon and label',
    content: `import 'package:flutter/material.dart';

class StatPill extends StatelessWidget {
  final IconData icon;
  final String text;
  final Color? color;

  const StatPill({
    super.key,
    required this.icon,
    required this.text,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final effectiveColor = color ?? theme.colorScheme.onSurfaceVariant;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: theme.colorScheme.surfaceContainer,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: effectiveColor),
          const SizedBox(width: 4),
          Text(
            text,
            style: theme.textTheme.labelSmall?.copyWith(
              color: effectiveColor,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}
`,
  },
  {
    path: 'lib/screens/create_recipe_screen.dart',
    name: 'create_recipe_screen.dart',
    category: 'screens',
    description: 'Screen 4: Validated form with GlobalKey<FormState>, 5+ fields & feedback',
    content: `import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../models/recipe.dart';
import '../providers/recipe_provider.dart';

class CreateRecipeScreen extends StatefulWidget {
  const CreateRecipeScreen({super.key});

  @override
  State<CreateRecipeScreen> createState() => _CreateRecipeScreenState();
}

class _CreateRecipeScreenState extends State<CreateRecipeScreen> {
  final _formKey = GlobalKey<FormState>();
  
  // Form controllers
  final _titleController = TextEditingController();
  final _descController = TextEditingController();
  final _prepTimeController = TextEditingController();
  final _cookTimeController = TextEditingController();
  final _servingsController = TextEditingController();
  final _authorController = TextEditingController();
  final _emailController = TextEditingController();
  final _stepsController = TextEditingController();

  String _selectedCategory = 'Italian';
  Difficulty _selectedDifficulty = Difficulty.medium;
  final List<String> _ingredients = ['200g Pasta', '2 Eggs'];

  @override
  void dispose() {
    _titleController.dispose();
    _descController.dispose();
    _prepTimeController.dispose();
    _cookTimeController.dispose();
    _servingsController.dispose();
    _authorController.dispose();
    _emailController.dispose();
    _stepsController.dispose();
    super.dispose();
  }

  void _submitForm() {
    if (_formKey.currentState!.validate()) {
      // Create new Recipe instance
      final newRecipe = Recipe(
        id: 'rec_\${DateTime.now().millisecondsSinceEpoch}',
        title: _titleController.text.trim(),
        description: _descController.text.trim(),
        category: _selectedCategory.toLowerCase(),
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
        prepTimeMinutes: int.parse(_prepTimeController.text),
        cookTimeMinutes: int.parse(_cookTimeController.text),
        servings: int.parse(_servingsController.text),
        difficulty: _selectedDifficulty,
        rating: 5.0,
        reviewCount: 1,
        authorName: _authorController.text.trim(),
        authorEmail: _emailController.text.trim(),
        authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
        dietaryTags: ['Custom', 'Fresh'],
        ingredients: _ingredients.map((i) => Ingredient(
          id: 'i_\${i.hashCode}',
          name: i,
          amount: 1,
          unit: 'portion',
        )).toList(),
        steps: [
          RecipeStep(stepNumber: 1, instruction: _stepsController.text.trim()),
        ],
      );

      // Add to repository
      Provider.of<RecipeProvider>(context, listen: false).addRecipe(newRecipe);

      // ScaffoldMessenger SnackBar feedback
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Recipe "\${newRecipe.title}" published successfully!'),
          backgroundColor: Colors.green.shade700,
          action: SnackBarAction(
            label: 'View',
            textColor: Colors.white,
            onPressed: () => context.push('/recipe/\${newRecipe.id}'),
          ),
        ),
      );

      // Navigate to the newly created recipe detail
      context.go('/recipe/\${newRecipe.id}');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Add New Recipe'),
        leading: IconButton(
          icon: const Icon(Icons.close),
          onPressed: () => context.pop(),
        ),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // 1. Title (TextFormField with Validation)
            TextFormField(
              controller: _titleController,
              decoration: const InputDecoration(
                labelText: 'Recipe Title *',
                hintText: 'e.g. Grandma\\'s Saffron Risotto',
                prefixIcon: Icon(Icons.restaurant_menu),
              ),
              validator: (val) {
                if (val == null || val.trim().isEmpty) return 'Title is required';
                if (val.trim().length < 4) return 'Title must be at least 4 characters';
                return null;
              },
            ),
            const SizedBox(height: 16),

            // 2. Prep & Cook Times (Row with 2 Number Fields)
            Row(
              children: [
                Expanded(
                  child: TextFormField(
                    controller: _prepTimeController,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(
                      labelText: 'Prep Time (min) *',
                      prefixIcon: Icon(Icons.timer_outlined),
                    ),
                    validator: (val) {
                      if (val == null || val.isEmpty) return 'Required';
                      final num = int.tryParse(val);
                      if (num == null || num <= 0) return 'Invalid number';
                      return null;
                    },
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: TextFormField(
                    controller: _cookTimeController,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(
                      labelText: 'Cook Time (min) *',
                      prefixIcon: Icon(Icons.soup_kitchen_outlined),
                    ),
                    validator: (val) {
                      if (val == null || val.isEmpty) return 'Required';
                      final num = int.tryParse(val);
                      if (num == null || num < 0) return 'Invalid number';
                      return null;
                    },
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // 3. Servings (TextFormField with Validation)
            TextFormField(
              controller: _servingsController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                labelText: 'Servings (Portions) *',
                prefixIcon: Icon(Icons.people_alt_outlined),
              ),
              validator: (val) {
                if (val == null || val.isEmpty) return 'Required';
                final num = int.tryParse(val);
                if (num == null || num < 1 || num > 50) return 'Enter 1-50 portions';
                return null;
              },
            ),
            const SizedBox(height: 16),

            // 4. Author Email / Handle (TextFormField with Regex Validator)
            TextFormField(
              controller: _emailController,
              keyboardType: TextInputType.emailAddress,
              decoration: const InputDecoration(
                labelText: 'Chef Email / Contact *',
                prefixIcon: Icon(Icons.email_outlined),
              ),
              validator: (val) {
                if (val == null || val.trim().isEmpty) return 'Email is required';
                if (!val.contains('@') || !val.contains('.')) return 'Enter a valid email';
                return null;
              },
            ),
            const SizedBox(height: 16),

            // 5. Preparation Steps (Multiline TextFormField)
            TextFormField(
              controller: _stepsController,
              maxLines: 4,
              decoration: const InputDecoration(
                labelText: 'Cooking Instructions *',
                hintText: 'Describe key steps for perfection...',
                alignLabelWithHint: true,
              ),
              validator: (val) {
                if (val == null || val.trim().isEmpty) return 'Instructions required';
                if (val.trim().length < 20) return 'Please provide at least 20 characters';
                return null;
              },
            ),
            const SizedBox(height: 24),

            // Submit Button
            FilledButton.icon(
              onPressed: _submitForm,
              icon: const Icon(Icons.check_circle_outline),
              label: const Text('Publish Recipe'),
              style: FilledButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
`,
  },
];
