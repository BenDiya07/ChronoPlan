import 'review.dart';

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
}
