class Review {
  final String id;
  final String author;
  final double rating;
  final String comment;
  final DateTime date;

  const Review({
    required this.id,
    required this.author,
    required this.rating,
    required this.comment,
    required this.date,
  });

  Review copyWith({
    String? id,
    String? author,
    double? rating,
    String? comment,
    DateTime? date,
  }) {
    return Review(
      id: id ?? this.id,
      author: author ?? this.author,
      rating: rating ?? this.rating,
      comment: comment ?? this.comment,
      date: date ?? this.date,
    );
  }
}
