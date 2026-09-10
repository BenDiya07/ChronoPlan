export interface DartFile {
  path: string;
  name: string;
  category: 'main' | 'router' | 'screens' | 'widgets' | 'models' | 'theme' | 'data' | 'config';
  description: string;
  code: string;
}

export const FLUTTER_FILES: DartFile[] = [
  {
    path: 'pubspec.yaml',
    name: 'pubspec.yaml',
    category: 'config',
    description: 'Configuration du projet Flutter, dépendances GoRouter, Google Fonts, etc.',
    code: `name: cineverse_flutter
description: "A complete multi-screen Movie Discovery & Review Flutter App with GoRouter, responsive design, dark/light themes, search/filter, and form validation."
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  go_router: ^14.0.0
  google_fonts: ^6.2.1
  flutter_rating_bar: ^4.0.1
  cached_network_image: ^3.3.1
  intl: ^0.19.0
  cupertino_icons: ^1.0.8

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true`,
  },
  {
    path: 'lib/main.dart',
    name: 'main.dart',
    category: 'main',
    description: 'Point d\'entrée Flutter, MaterialApp.router, gestion du Dark/Light Theme et état global.',
    code: `import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'data/mock_data.dart';
import 'models/movie.dart';
import 'models/review.dart';
import 'router/app_router.dart';
import 'theme/app_theme.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.landscapeLeft,
    DeviceOrientation.landscapeRight,
  ]);
  runApp(const CineVerseApp());
}

class CineVerseApp extends StatefulWidget {
  const CineVerseApp({super.key});

  @override
  State<CineVerseApp> createState() => _CineVerseAppState();
}

class _CineVerseAppState extends State<CineVerseApp> {
  ThemeMode _themeMode = ThemeMode.dark;
  List<Movie> _movies = List.from(MockData.initialMovies);

  void _toggleTheme() {
    setState(() {
      _themeMode = _themeMode == ThemeMode.dark ? ThemeMode.light : ThemeMode.dark;
    });
  }

  void _toggleWatchlist(String movieId) {
    setState(() {
      final index = _movies.indexWhere((m) => m.id == movieId);
      if (index != -1) {
        final current = _movies[index];
        _movies[index] = current.copyWith(isWatchlisted: !current.isWatchlisted);
      }
    });
  }

  void _addReview(String movieId, Review review) {
    setState(() {
      final index = _movies.indexWhere((m) => m.id == movieId);
      if (index != -1) {
        final current = _movies[index];
        final updatedReviews = [review, ...current.reviews];
        final totalRating = updatedReviews.fold(0.0, (acc, r) => acc + r.rating);
        final newRating = totalRating / updatedReviews.length;

        _movies[index] = current.copyWith(
          reviews: updatedReviews,
          reviewCount: current.reviewCount + 1,
          rating: double.parse(newRating.toStringAsFixed(1)),
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final router = createRouter(
      movies: _movies,
      onToggleWatchlist: _toggleWatchlist,
      onAddReview: _addReview,
      onToggleTheme: _toggleTheme,
      isDarkMode: _themeMode == ThemeMode.dark,
    );

    return MaterialApp.router(
      title: 'CineVerse — Films & Avis',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: _themeMode,
      routerConfig: router,
    );
  }
}`,
  },
  {
    path: 'lib/router/app_router.dart',
    name: 'app_router.dart',
    category: 'router',
    description: 'Configuration de GoRouter avec StatefulShellRoute (navigation persistante) et routes paramétrées.',
    code: `import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../models/movie.dart';
import '../models/review.dart';
import '../screens/home_screen.dart';
import '../screens/explore_screen.dart';
import '../screens/detail_screen.dart';
import '../screens/add_review_screen.dart';
import '../screens/watchlist_screen.dart';
import '../screens/main_scaffold_wrapper.dart';

final GlobalKey<NavigatorState> _rootNavigatorKey = GlobalKey<NavigatorState>();

GoRouter createRouter({
  required List<Movie> movies,
  required Function(String) onToggleWatchlist,
  required Function(String movieId, Review review) onAddReview,
  required VoidCallback onToggleTheme,
  required bool isDarkMode,
}) {
  return GoRouter(
    navigatorKey: _rootNavigatorKey,
    initialLocation: '/',
    routes: [
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) {
          return MainScaffoldWrapper(navigationShell: navigationShell);
        },
        branches: [
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/',
                builder: (context, state) => HomeScreen(
                  movies: movies,
                  onToggleWatchlist: onToggleWatchlist,
                  onToggleTheme: onToggleTheme,
                  isDarkMode: isDarkMode,
                ),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/explore',
                builder: (context, state) => ExploreScreen(
                  movies: movies,
                  onToggleWatchlist: onToggleWatchlist,
                ),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/add-review',
                builder: (context, state) {
                  final movieId = state.uri.queryParameters['movieId'];
                  return AddReviewScreen(
                    movies: movies,
                    initialMovieId: movieId,
                    onAddReview: onAddReview,
                  );
                },
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/watchlist',
                builder: (context, state) => WatchlistScreen(
                  movies: movies,
                  onToggleWatchlist: onToggleWatchlist,
                ),
              ),
            ],
          ),
        ],
      ),
      GoRoute(
        parentNavigatorKey: _rootNavigatorKey,
        path: '/movie/:id',
        builder: (context, state) {
          final movieId = state.pathParameters['id'] ?? '';
          return DetailScreen(
            movieId: movieId,
            movies: movies,
            onToggleWatchlist: onToggleWatchlist,
          );
        },
      ),
    ],
  );
}`,
  },
  {
    path: 'lib/screens/home_screen.dart',
    name: 'home_screen.dart',
    category: 'screens',
    description: 'Écran d\'accueil avec bannière Hero, ListView horizontale de tendances et GridView des films mieux notés.',
    code: `import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../data/mock_data.dart';
import '../models/movie.dart';
import '../widgets/movie_card.dart';
import '../widgets/section_header.dart';
import '../widgets/rating_badge.dart';

class HomeScreen extends StatelessWidget {
  final List<Movie> movies;
  final Function(String) onToggleWatchlist;
  final VoidCallback onToggleTheme;
  final bool isDarkMode;

  const HomeScreen({
    super.key,
    required this.movies,
    required this.onToggleWatchlist,
    required this.onToggleTheme,
    required this.isDarkMode,
  });

  @override
  Widget build(BuildContext context) {
    final featuredMovie = movies.firstWhere(
      (m) => m.isFeatured,
      orElse: () => movies.first,
    );
    final trendingMovies = movies;
    final topRated = [...movies]..sort((a, b) => b.rating.compareTo(a.rating));
    final isTablet = MediaQuery.of(context).size.width >= 768;
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: theme.colorScheme.primary,
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.movie_creation_rounded, color: Colors.white, size: 20),
            ),
            const SizedBox(width: 10),
            const Text('CineVerse', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 20)),
          ],
        ),
        actions: [
          IconButton(
            icon: Icon(isDarkMode ? Icons.light_mode_rounded : Icons.dark_mode_rounded),
            onPressed: onToggleTheme,
          ),
          IconButton(
            icon: const Icon(Icons.search_rounded),
            onPressed: () => context.go('/explore'),
          ),
        ],
      ),
      body: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(20),
                child: InkWell(
                  onTap: () => context.push('/movie/\${featuredMovie.id}'),
                  child: Stack(
                    children: [
                      AspectRatio(
                        aspectRatio: isTablet ? 21 / 9 : 16 / 9,
                        child: Image.network(featuredMovie.backdropUrl, fit: BoxFit.cover),
                      ),
                      Positioned.fill(
                        child: Container(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topCenter,
                              end: Alignment.bottomCenter,
                              colors: [Colors.transparent, Colors.black.withOpacity(0.9)],
                            ),
                          ),
                        ),
                      ),
                      Positioned(
                        bottom: 16,
                        left: 16,
                        right: 16,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            RatingBadge(rating: featuredMovie.rating),
                            const SizedBox(height: 6),
                            Text(
                              featuredMovie.title,
                              style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: SectionHeader(
              title: 'Tendances du moment',
              actionLabel: 'Voir tout',
              onActionTap: () => context.go('/explore'),
            ),
          ),
          SliverToBoxAdapter(
            child: SizedBox(
              height: 250,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 12),
                itemCount: trendingMovies.length,
                itemBuilder: (context, index) {
                  final movie = trendingMovies[index];
                  return SizedBox(
                    width: 155,
                    child: MovieCard(
                      movie: movie,
                      displayMode: MovieCardDisplayMode.grid,
                      onTap: () => context.push('/movie/\${movie.id}'),
                      onToggleWatchlist: () => onToggleWatchlist(movie.id),
                    ),
                  );
                },
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: SectionHeader(
              title: 'Les Mieux Notés ⭐',
              actionLabel: 'Explorer',
              onActionTap: () => context.go('/explore'),
            ),
          ),
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            sliver: SliverGrid(
              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: isTablet ? 4 : 2,
                childAspectRatio: 0.65,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
              ),
              delegate: SliverChildBuilderDelegate(
                (context, index) {
                  final movie = topRated[index];
                  return MovieCard(
                    movie: movie,
                    displayMode: MovieCardDisplayMode.grid,
                    onTap: () => context.push('/movie/\${movie.id}'),
                    onToggleWatchlist: () => onToggleWatchlist(movie.id),
                  );
                },
                childCount: topRated.length,
              ),
            ),
          ),
        ],
      ),
    );
  }
}`,
  },
  {
    path: 'lib/screens/explore_screen.dart',
    name: 'explore_screen.dart',
    category: 'screens',
    description: 'Écran de recherche temps réel avec filtrage par genre (GenreChips) et bascule Vue Liste / Grille.',
    code: `import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../data/mock_data.dart';
import '../models/movie.dart';
import '../widgets/movie_card.dart';
import '../widgets/genre_chip.dart';

class ExploreScreen extends StatefulWidget {
  final List<Movie> movies;
  final Function(String) onToggleWatchlist;

  const ExploreScreen({
    super.key,
    required this.movies,
    required this.onToggleWatchlist,
  });

  @override
  State<ExploreScreen> createState() => _ExploreScreenState();
}

class _ExploreScreenState extends State<ExploreScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _selectedGenre = 'Tous';
  String _searchQuery = '';
  bool _isGridView = false;

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  List<Movie> get _filteredMovies {
    return widget.movies.where((movie) {
      final matchesGenre = _selectedGenre == 'Tous' || movie.genres.contains(_selectedGenre);
      final matchesSearch = _searchQuery.isEmpty ||
          movie.title.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          movie.director.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          movie.cast.any((actor) => actor.toLowerCase().contains(_searchQuery.toLowerCase()));
      return matchesGenre && matchesSearch;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _filteredMovies;
    final isTablet = MediaQuery.of(context).size.width >= 768;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Explorer les films', style: TextStyle(fontWeight: FontWeight.bold)),
        actions: [
          IconButton(
            icon: Icon(_isGridView ? Icons.view_list_rounded : Icons.grid_view_rounded),
            onPressed: () => setState(() => _isGridView = !_isGridView),
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: TextField(
              controller: _searchController,
              onChanged: (val) => setState(() => _searchQuery = val.trim()),
              decoration: const InputDecoration(
                hintText: 'Rechercher un film, réalisateur, acteur...',
                prefixIcon: Icon(Icons.search_rounded),
              ),
            ),
          ),
          SizedBox(
            height: 48,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: MockData.availableGenres.length,
              itemBuilder: (context, index) {
                final genre = MockData.availableGenres[index];
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: GenreChip(
                    label: genre,
                    isSelected: _selectedGenre == genre,
                    onTap: () => setState(() => _selectedGenre = genre),
                  ),
                );
              },
            ),
          ),
          Expanded(
            child: _isGridView || isTablet
                ? GridView.builder(
                    padding: const EdgeInsets.all(16),
                    gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: isTablet ? 3 : 2,
                      childAspectRatio: 0.68,
                      crossAxisSpacing: 12,
                      mainAxisSpacing: 12,
                    ),
                    itemCount: filtered.length,
                    itemBuilder: (context, index) => MovieCard(
                      movie: filtered[index],
                      displayMode: MovieCardDisplayMode.grid,
                      onTap: () => context.push('/movie/\${filtered[index].id}'),
                      onToggleWatchlist: () => widget.onToggleWatchlist(filtered[index].id),
                    ),
                  )
                : ListView.builder(
                    itemCount: filtered.length,
                    itemBuilder: (context, index) => MovieCard(
                      movie: filtered[index],
                      displayMode: MovieCardDisplayMode.list,
                      onTap: () => context.push('/movie/\${filtered[index].id}'),
                      onToggleWatchlist: () => widget.onToggleWatchlist(filtered[index].id),
                    ),
                  ),
          ),
        ],
      ),
    );
  }
}`,
  },
  {
    path: 'lib/screens/detail_screen.dart',
    name: 'detail_screen.dart',
    category: 'screens',
    description: 'Écran de détails avec passage de paramètre GoRouter (:id), Hero animation, synopsis, casting et avis.',
    code: `import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../models/movie.dart';
import '../widgets/rating_badge.dart';

class DetailScreen extends StatelessWidget {
  final String movieId;
  final List<Movie> movies;
  final Function(String) onToggleWatchlist;

  const DetailScreen({
    super.key,
    required this.movieId,
    required this.movies,
    required this.onToggleWatchlist,
  });

  @override
  Widget build(BuildContext context) {
    final movie = movies.firstWhere((m) => m.id == movieId, orElse: () => movies.first);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 280,
            pinned: true,
            leading: IconButton(
              icon: const CircleAvatar(
                backgroundColor: Colors.black54,
                child: Icon(Icons.arrow_back_rounded, color: Colors.white),
              ),
              onPressed: () => context.pop(),
            ),
            flexibleSpace: FlexibleSpaceBar(
              background: Stack(
                fit: StackFit.expand,
                children: [
                  Image.network(movie.backdropUrl, fit: BoxFit.cover),
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [Colors.black38, Colors.black87],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Hero(
                        tag: 'movie-poster-\${movie.id}',
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(12),
                          child: SizedBox(
                            width: 100,
                            height: 150,
                            child: Image.network(movie.posterUrl, fit: BoxFit.cover),
                          ),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(movie.title, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                            const SizedBox(height: 6),
                            RatingBadge(rating: movie.rating),
                            const SizedBox(height: 10),
                            Text('\${movie.releaseYear} • \${movie.duration} • \${movie.ageRating}'),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  const Text('Synopsis', style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  Text(movie.synopsis, style: const TextStyle(fontSize: 14, height: 1.6)),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}`,
  },
  {
    path: 'lib/screens/add_review_screen.dart',
    name: 'add_review_screen.dart',
    category: 'screens',
    description: 'Formulaire avec GlobalKey<FormState>, validation stricte de plus de 3 champs et SnackBar de confirmation.',
    code: `import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../models/movie.dart';
import '../models/review.dart';

class AddReviewScreen extends StatefulWidget {
  final List<Movie> movies;
  final String? initialMovieId;
  final Function(String movieId, Review review) onAddReview;

  const AddReviewScreen({
    super.key,
    required this.movies,
    this.initialMovieId,
    required this.onAddReview,
  });

  @override
  State<AddReviewScreen> createState() => _AddReviewScreenState();
}

class _AddReviewScreenState extends State<AddReviewScreen> {
  final _formKey = GlobalKey<FormState>();
  late String _selectedMovieId;
  final TextEditingController _authorController = TextEditingController();
  final TextEditingController _commentController = TextEditingController();
  double _rating = 4.5;

  @override
  void initState() {
    super.initState();
    _selectedMovieId = widget.initialMovieId ?? widget.movies.first.id;
  }

  void _submitForm() {
    if (_formKey.currentState!.validate()) {
      final newReview = Review(
        id: 'rev_\${DateTime.now().millisecondsSinceEpoch}',
        author: _authorController.text.trim(),
        rating: _rating,
        comment: _commentController.text.trim(),
        date: DateTime.now(),
      );
      widget.onAddReview(_selectedMovieId, newReview);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Votre avis a été publié avec succès !')),
      );
      context.pushReplacement('/movie/\$_selectedMovieId');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Rédiger une critique')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              DropdownButtonFormField<String>(
                value: _selectedMovieId,
                items: widget.movies.map((m) => DropdownMenuItem(value: m.id, child: Text(m.title))).toList(),
                onChanged: (val) => setState(() => _selectedMovieId = val!),
                validator: (val) => val == null ? 'Sélectionnez un film' : null,
              ),
              const SizedBox(height: 20),
              TextFormField(
                controller: _authorController,
                decoration: const InputDecoration(labelText: 'Votre nom ou pseudo *'),
                validator: (val) => (val == null || val.trim().length < 3) ? 'Au moins 3 caractères requis' : null,
              ),
              const SizedBox(height: 20),
              Slider(
                value: _rating,
                min: 1.0,
                max: 5.0,
                divisions: 8,
                label: _rating.toStringAsFixed(1),
                onChanged: (val) => setState(() => _rating = val),
              ),
              const SizedBox(height: 20),
              TextFormField(
                controller: _commentController,
                maxLines: 4,
                decoration: const InputDecoration(labelText: 'Critique détaillée (min. 15 car.) *'),
                validator: (val) => (val == null || val.trim().length < 15) ? 'Au moins 15 caractères requis' : null,
              ),
              const SizedBox(height: 30),
              ElevatedButton(
                onPressed: _submitForm,
                child: const Text('Publier mon avis'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}`,
  },
  {
    path: 'lib/widgets/movie_card.dart',
    name: 'movie_card.dart',
    category: 'widgets',
    description: 'Composant réutilisable MovieCard supportant le mode Grille (affiche + badges) et mode Liste.',
    code: `import 'package:flutter/material.dart';
import '../models/movie.dart';
import 'rating_badge.dart';

enum MovieCardDisplayMode { grid, list }

class MovieCard extends StatelessWidget {
  final Movie movie;
  final VoidCallback onTap;
  final VoidCallback? onToggleWatchlist;
  final MovieCardDisplayMode displayMode;

  const MovieCard({
    super.key,
    required this.movie,
    required this.onTap,
    this.onToggleWatchlist,
    this.displayMode = MovieCardDisplayMode.grid,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      clipBehavior: Clip.antiAlias,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: InkWell(
        onTap: onTap,
        child: Column(
          children: [
            Expanded(
              child: Stack(
                fit: StackFit.expand,
                children: [
                  Hero(
                    tag: 'movie-poster-\${movie.id}',
                    child: Image.network(movie.posterUrl, fit: BoxFit.cover),
                  ),
                  Positioned(
                    top: 8,
                    left: 8,
                    child: RatingBadge(rating: movie.rating),
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(10),
              child: Text(movie.title, maxLines: 1, overflow: TextOverflow.ellipsis),
            ),
          ],
        ),
      ),
    );
  }
}`,
  },
  {
    path: 'lib/widgets/rating_badge.dart',
    name: 'rating_badge.dart',
    category: 'widgets',
    description: 'Composant réutilisable Badge de note avec étoile dorée et arrondi.',
    code: `import 'package:flutter/material.dart';

class RatingBadge extends StatelessWidget {
  final double rating;
  final bool showStar;
  final double fontSize;

  const RatingBadge({
    super.key,
    required this.rating,
    this.showStar = true,
    this.fontSize = 13.0,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: const Color(0xFF1E202C).withOpacity(0.85),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: const Color(0xFFFFB800).withOpacity(0.3)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (showStar) ...[
            const Icon(Icons.star_rounded, color: Color(0xFFFFB800), size: 16),
            const SizedBox(width: 4),
          ],
          Text(
            rating.toStringAsFixed(1),
            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: fontSize),
          ),
        ],
      ),
    );
  }
}`,
  },
  {
    path: 'lib/widgets/genre_chip.dart',
    name: 'genre_chip.dart',
    category: 'widgets',
    description: 'Composant réutilisable Puce de filtrage animée pour les catégories de films.',
    code: `import 'package:flutter/material.dart';

class GenreChip extends StatelessWidget {
  final String label;
  final bool isSelected;
  final VoidCallback? onTap;

  const GenreChip({
    super.key,
    required this.label,
    this.isSelected = false,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? theme.colorScheme.primary : const Color(0xFF1F2230),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Text(
          label,
          style: TextStyle(color: Colors.white, fontWeight: isSelected ? FontWeight.bold : FontWeight.w500),
        ),
      ),
    );
  }
}`,
  },
  {
    path: 'lib/models/movie.dart',
    name: 'movie.dart',
    category: 'models',
    description: 'Modèle de données typé pour les films avec copyWith pour l\'immutabilité.',
    code: `import 'review.dart';

class Movie {
  final String id;
  final String title;
  final String originalTitle;
  final int releaseYear;
  final String duration;
  final double rating;
  final int reviewCount;
  final List<String> genres;
  final String director;
  final List<String> cast;
  final String synopsis;
  final String posterUrl;
  final String backdropUrl;
  final String ageRating;
  final bool isFeatured;
  final List<Review> reviews;
  final bool isWatchlisted;

  const Movie({
    required this.id,
    required this.title,
    required this.originalTitle,
    required this.releaseYear,
    required this.duration,
    required this.rating,
    required this.reviewCount,
    required this.genres,
    required this.director,
    required this.cast,
    required this.synopsis,
    required this.posterUrl,
    required this.backdropUrl,
    required this.ageRating,
    this.isFeatured = false,
    this.reviews = const [],
    this.isWatchlisted = false,
  });

  Movie copyWith({
    String? id,
    String? title,
    String? originalTitle,
    int? releaseYear,
    String? duration,
    double? rating,
    int? reviewCount,
    List<String>? genres,
    String? director,
    List<String>? cast,
    String? synopsis,
    String? posterUrl,
    String? backdropUrl,
    String? ageRating,
    bool? isFeatured,
    List<Review>? reviews,
    bool? isWatchlisted,
  }) {
    return Movie(
      id: id ?? this.id,
      title: title ?? this.title,
      originalTitle: originalTitle ?? this.originalTitle,
      releaseYear: releaseYear ?? this.releaseYear,
      duration: duration ?? this.duration,
      rating: rating ?? this.rating,
      reviewCount: reviewCount ?? this.reviewCount,
      genres: genres ?? this.genres,
      director: director ?? this.director,
      cast: cast ?? this.cast,
      synopsis: synopsis ?? this.synopsis,
      posterUrl: posterUrl ?? this.posterUrl,
      backdropUrl: backdropUrl ?? this.backdropUrl,
      ageRating: ageRating ?? this.ageRating,
      isFeatured: isFeatured ?? this.isFeatured,
      reviews: reviews ?? this.reviews,
      isWatchlisted: isWatchlisted ?? this.isWatchlisted,
    );
  }
}`,
  },
  {
    path: 'lib/theme/app_theme.dart',
    name: 'app_theme.dart',
    category: 'theme',
    description: 'Définition des thèmes ThemeData.dark et ThemeData.light Material 3 avec Google Fonts.',
    code: `import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  static const Color primaryCrimson = Color(0xFFE50914);
  static const Color darkBackground = Color(0xFF0F1016);
  static const Color darkSurface = Color(0xFF181A24);

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: darkBackground,
      colorScheme: const ColorScheme.dark(
        primary: primaryCrimson,
        surface: darkSurface,
      ),
      textTheme: GoogleFonts.plusJakartaSansTextTheme(ThemeData.dark().textTheme),
    );
  }

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      scaffoldBackgroundColor: const Color(0xFFF8F9FA),
      colorScheme: const ColorScheme.light(
        primary: primaryCrimson,
        surface: Colors.white,
      ),
      textTheme: GoogleFonts.plusJakartaSansTextTheme(ThemeData.light().textTheme),
    );
  }
}`,
  },
];
