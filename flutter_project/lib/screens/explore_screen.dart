import 'package:flutter/material.dart';
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
            tooltip: _isGridView ? 'Vue liste' : 'Vue grille',
            onPressed: () => setState(() => _isGridView = !_isGridView),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: Column(
        children: [
          // Search Input Bar
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: TextField(
              controller: _searchController,
              onChanged: (value) => setState(() => _searchQuery = value.trim()),
              decoration: InputDecoration(
                hintText: 'Rechercher un film, réalisateur, acteur...',
                prefixIcon: const Icon(Icons.search_rounded),
                suffixIcon: _searchQuery.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear_rounded),
                        onPressed: () {
                          _searchController.clear();
                          setState(() => _searchQuery = '');
                        },
                      )
                    : null,
              ),
            ),
          ),

          // Genre Filter Chips
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

          // Results counter
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  '${filtered.length} film${filtered.length > 1 ? 's' : ''} trouvé${filtered.length > 1 ? 's' : ''}',
                  style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13, color: Colors.grey),
                ),
                if (_selectedGenre != 'Tous' || _searchQuery.isNotEmpty)
                  GestureDetector(
                    onTap: () {
                      _searchController.clear();
                      setState(() {
                        _selectedGenre = 'Tous';
                        _searchQuery = '';
                      });
                    },
                    child: const Text(
                      'Réinitialiser',
                      style: TextStyle(
                        color: Color(0xFFE50914),
                        fontWeight: FontWeight.bold,
                        fontSize: 13,
                      ),
                    ),
                  ),
              ],
            ),
          ),

          // Movies List / Grid
          Expanded(
            child: filtered.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.search_off_rounded, size: 64, color: Colors.grey[600]),
                        const SizedBox(height: 16),
                        const Text(
                          'Aucun film ne correspond à votre recherche',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Essayez un autre mot-clé ou sélectionnez "Tous"',
                          style: TextStyle(color: Colors.grey[500], fontSize: 14),
                        ),
                      ],
                    ),
                  )
                : _isGridView || isTablet
                    ? GridView.builder(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: isTablet ? 3 : 2,
                          childAspectRatio: 0.68,
                          crossAxisSpacing: 12,
                          mainAxisSpacing: 12,
                        ),
                        itemCount: filtered.length,
                        itemBuilder: (context, index) {
                          final movie = filtered[index];
                          return MovieCard(
                            movie: movie,
                            displayMode: MovieCardDisplayMode.grid,
                            onTap: () => context.push('/movie/${movie.id}'),
                            onToggleWatchlist: () => widget.onToggleWatchlist(movie.id),
                          );
                        },
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.only(bottom: 20),
                        itemCount: filtered.length,
                        itemBuilder: (context, index) {
                          final movie = filtered[index];
                          return MovieCard(
                            movie: movie,
                            displayMode: MovieCardDisplayMode.list,
                            onTap: () => context.push('/movie/${movie.id}'),
                            onToggleWatchlist: () => widget.onToggleWatchlist(movie.id),
                          );
                        },
                      ),
          ),
        ],
      ),
    );
  }
}
