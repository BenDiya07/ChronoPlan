class ProductEntity {
  final int id;
  final String title;
  final String description;
  final double price;
  final double discountPercentage;
  final double rating;
  final int stock;
  final String brand;
  final String category;
  final String thumbnail;
  final List<String> images;
  final Map<String, dynamic>? specifications;

  const ProductEntity({
    required this.id,
    required this.title,
    required this.description,
    required this.price,
    this.discountPercentage = 0.0,
    required this.rating,
    required this.stock,
    this.brand = 'Generic',
    required this.category,
    required this.thumbnail,
    this.images = const [],
    this.specifications,
  });

  double get discountedPrice {
    if (discountPercentage <= 0) return price;
    return price * (1 - (discountPercentage / 100));
  }

  bool get inStock => stock > 0;
}
