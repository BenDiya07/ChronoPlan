class ProductColor {
  final String name;
  final String hex;

  const ProductColor({required this.name, required this.hex});

  factory ProductColor.fromJson(Map<String, dynamic> json) {
    return ProductColor(
      name: json['name'] as String,
      hex: json['hex'] as String,
    );
  }

  Map<String, dynamic> toJson() => {'name': name, 'hex': hex};
}

class Product {
  final String id;
  final String title;
  final String subtitle;
  final String description;
  final double price;
  final double? originalPrice;
  final double rating;
  final int reviewCount;
  final String category;
  final String imageUrl;
  final List<String> additionalImages;
  final bool isFeatured;
  final bool isFlashSale;
  final int stock;
  final List<ProductColor> colors;
  final List<String> tags;
  final Map<String, String> specs;

  const Product({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.description,
    required this.price,
    this.originalPrice,
    required this.rating,
    required this.reviewCount,
    required this.category,
    required this.imageUrl,
    required this.additionalImages,
    this.isFeatured = false,
    this.isFlashSale = false,
    required this.stock,
    required this.colors,
    required this.tags,
    required this.specs,
  });

  bool get hasDiscount => originalPrice != null && originalPrice! > price;

  int get discountPercentage {
    if (!hasDiscount) return 0;
    return (((originalPrice! - price) / originalPrice!) * 100).round();
  }

  bool get inStock => stock > 0;

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'] as String,
      title: json['title'] as String,
      subtitle: json['subtitle'] as String,
      description: json['description'] as String,
      price: (json['price'] as num).toDouble(),
      originalPrice: json['originalPrice'] != null
          ? (json['originalPrice'] as num).toDouble()
          : null,
      rating: (json['rating'] as num).toDouble(),
      reviewCount: json['reviewCount'] as int,
      category: json['category'] as String,
      imageUrl: json['imageUrl'] as String,
      additionalImages: List<String>.from(json['additionalImages'] ?? []),
      isFeatured: json['isFeatured'] as bool? ?? false,
      isFlashSale: json['isFlashSale'] as bool? ?? false,
      stock: json['stock'] as int,
      colors: (json['colors'] as List<dynamic>?)
              ?.map((c) => ProductColor.fromJson(c as Map<String, dynamic>))
              .toList() ??
          [],
      tags: List<String>.from(json['tags'] ?? []),
      specs: Map<String, String>.from(json['specs'] ?? {}),
    );
  }
}
