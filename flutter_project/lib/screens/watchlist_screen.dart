import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../models/movie.dart';
import '../widgets/movie_card.dart';

class WatchlistScreen extends StatelessWidget {
  final List<Movie> movies;
  final Function(String) onToggleWatchlist;

  const WatchlistScreen({
    super.key,
    required this.movies,
    required this.onToggleWatchlist,
  });

  @override
  Widget build(BuildContext context) {
    final watchlistedMovies = movies.where((m) => m.isWatchlisted).toList();
    final isTablet = MediaQuery.of(context).size.width >= 768;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Ma Liste de films', style: TextStyle(fontWeight: FontWeight.bold)),
      ),
      body: watchlistedMovies.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.bookmark_remove_rounded, size: 70, color: Colors.grey[600]),
                  const SizedBox(height: 16),
                  const Text(
                    'Votre liste est vide',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 40),
                    child: Text(
                      'Ajoutez des films à votre liste en cliquant sur l\'icône marque-page dans l\'accueil ou l\'explorateur.',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: Colors.grey[500], fontSize: 13, height: 1.4),
                    ),
                  ),
                  const SizedBox(height: 20),
                  ElevatedButton.icon(
                    icon: const Icon(Icons.explore_rounded),
                    label: const Text('Découvrir des films'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Theme.of(context).colorScheme.primary,
                      foregroundColor: Colors.white,
                    ),
                    onPressed: () => context.go('/explore'),
                  ),
                ],
              ),
            )
          : isTablet
              ? GridView.builder(
                  padding: const EdgeInsets.all(16),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 3,
                    childAspectRatio: 0.68,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                  ),
                  itemCount: watchlistedMovies.length,
                  itemBuilder: (context, index) {
                    final movie = watchlistedMovies[index];
                    return MovieCard(
                      movie: movie,
                      displayMode: MovieCardDisplayMode.grid,
                      onTap: () => context.push('/movie/${movie.id}'),
                      onToggleWatchlist: () => onToggleWatchlist(movie.id),
                    );
                  },
                )
              : ListView.builder(
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  itemCount: watchlistedMovies.length,
                  itemBuilder: (context, index) {
                    final movie = watchlistedMovies[index];
                    return MovieCard(
                      movie: movie,
                      displayMode: MovieCardDisplayMode.list,
                      onTap: () => context.push('/movie/${movie.id}'),
                      onToggleWatchlist: () => onToggleWatchlist(movie.id),
                    );
                  },
                ),
    );
  }
}
