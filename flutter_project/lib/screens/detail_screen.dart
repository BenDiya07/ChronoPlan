import 'package:flutter/material.dart';
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
    final movie = movies.firstWhere(
      (m) => m.id == movieId,
      orElse: () => movies.first,
    );
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // Collapsible Backdrop SliverAppBar
          SliverAppBar(
            expandedHeight: 280,
            pinned: true,
            leading: IconButton(
              icon: Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: Colors.black54,
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.arrow_back_rounded, color: Colors.white),
              ),
              onPressed: () => context.pop(),
            ),
            actions: [
              IconButton(
                icon: Container(
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(
                    color: Colors.black54,
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    movie.isWatchlisted ? Icons.bookmark_rounded : Icons.bookmark_border_rounded,
                    color: movie.isWatchlisted ? const Color(0xFFE50914) : Colors.white,
                  ),
                ),
                onPressed: () => onToggleWatchlist(movie.id),
              ),
              const SizedBox(width: 8),
            ],
            flexibleSpace: FlexibleSpaceBar(
              background: Stack(
                fit: StackFit.expand,
                children: [
                  Image.network(
                    movie.backdropUrl,
                    fit: BoxFit.cover,
                  ),
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.black.withOpacity(0.4),
                          Colors.black.withOpacity(0.8),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Content body
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Poster + Title + Meta header
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Poster with Hero tag
                      Hero(
                        tag: 'movie-poster-${movie.id}',
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(12),
                          child: SizedBox(
                            width: 100,
                            height: 150,
                            child: Image.network(
                              movie.posterUrl,
                              fit: BoxFit.cover,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 16),
                      // Details
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              movie.title,
                              style: const TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                                height: 1.2,
                              ),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              movie.originalTitle,
                              style: TextStyle(
                                fontSize: 13,
                                color: Colors.grey[500],
                                fontStyle: FontStyle.italic,
                              ),
                            ),
                            const SizedBox(height: 10),
                            Row(
                              children: [
                                RatingBadge(rating: movie.rating),
                                const SizedBox(width: 8),
                                Text(
                                  '(${movie.reviewCount} avis)',
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: Colors.grey[400],
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 10),
                            Text(
                              '${movie.releaseYear} • ${movie.duration} • ${movie.ageRating}',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                color: theme.colorScheme.primary,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 20),

                  // Genre pills
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: movie.genres.map((genre) {
                      return Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: isDark ? const Color(0xFF222533) : const Color(0xFFE5E7EB),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: isDark ? const Color(0xFF2E3346) : const Color(0xFFD1D5DB),
                          ),
                        ),
                        child: Text(
                          genre,
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: isDark ? Colors.grey[300] : Colors.grey[800],
                          ),
                        ),
                      );
                    }).toList(),
                  ),

                  const SizedBox(height: 24),

                  // Synopsis section
                  const Text(
                    'Synopsis',
                    style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    movie.synopsis,
                    style: TextStyle(
                      fontSize: 14,
                      height: 1.6,
                      color: isDark ? Colors.grey[300] : const Color(0xFF374151),
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Director & Cast info
                  Card(
                    elevation: 0,
                    color: isDark ? const Color(0xFF1B1D28) : const Color(0xFFF3F4F6),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    child: Padding(
                      padding: const EdgeInsets.all(14),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              const Icon(Icons.movie_filter_outlined, size: 18, color: Color(0xFFE50914)),
                              const SizedBox(width: 8),
                              Text(
                                'Réalisateur: ',
                                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                              ),
                              Text(movie.director, style: const TextStyle(fontSize: 13)),
                            ],
                          ),
                          const Divider(height: 16),
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Icon(Icons.people_outline_rounded, size: 18, color: Color(0xFFFFB800)),
                              const SizedBox(width: 8),
                              const Text(
                                'Casting: ',
                                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                              ),
                              Expanded(
                                child: Text(
                                  movie.cast.join(', '),
                                  style: const TextStyle(fontSize: 13),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Reviews Header + Add review button
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Avis des spectateurs (${movie.reviews.length})',
                        style: const TextStyle(fontSize: 17, fontWeight: FontWeight.bold),
                      ),
                      TextButton.icon(
                        icon: const Icon(Icons.add_comment_rounded, size: 16),
                        label: const Text('Donner mon avis'),
                        onPressed: () => context.push('/add-review?movieId=${movie.id}'),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),

                  // Reviews list
                  if (movie.reviews.isEmpty)
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: isDark ? const Color(0xFF1B1D28) : const Color(0xFFF3F4F6),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Column(
                        children: [
                          Icon(Icons.rate_review_outlined, color: Colors.grey[500], size: 36),
                          const SizedBox(height: 8),
                          const Text(
                            'Aucun avis pour l\'instant.',
                            style: TextStyle(fontWeight: FontWeight.w600),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Soyez le premier à partager votre critique !',
                            style: TextStyle(color: Colors.grey[500], fontSize: 13),
                          ),
                          const SizedBox(height: 12),
                          ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: theme.colorScheme.primary,
                              foregroundColor: Colors.white,
                            ),
                            onPressed: () => context.push('/add-review?movieId=${movie.id}'),
                            child: const Text('Rédiger une critique'),
                          ),
                        ],
                      ),
                    )
                  else
                    ListView.separated(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: movie.reviews.length,
                      separatorBuilder: (context, index) => const SizedBox(height: 10),
                      itemBuilder: (context, index) {
                        final review = movie.reviews[index];
                        return Card(
                          margin: EdgeInsets.zero,
                          elevation: 1,
                          color: isDark ? const Color(0xFF1E202C) : Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          child: Padding(
                            padding: const EdgeInsets.all(14),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Row(
                                      children: [
                                        CircleAvatar(
                                          radius: 14,
                                          backgroundColor: theme.colorScheme.primary.withOpacity(0.2),
                                          child: Text(
                                            review.author.isNotEmpty ? review.author[0].toUpperCase() : 'U',
                                            style: TextStyle(
                                              fontWeight: FontWeight.bold,
                                              fontSize: 12,
                                              color: theme.colorScheme.primary,
                                            ),
                                          ),
                                        ),
                                        const SizedBox(width: 8),
                                        Text(
                                          review.author,
                                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                                        ),
                                      ],
                                    ),
                                    RatingBadge(rating: review.rating, fontSize: 11),
                                  ],
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  review.comment,
                                  style: TextStyle(
                                    fontSize: 13,
                                    height: 1.4,
                                    color: isDark ? Colors.grey[300] : const Color(0xFF374151),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),

                  const SizedBox(height: 40),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
