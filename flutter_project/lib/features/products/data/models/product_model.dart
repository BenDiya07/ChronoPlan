import '../../domain/entities/product_entity.dart';

class ProductModel extends ProductEntity {
  const ProductModel({
    required super.id,
    required super.title,
    required super.description,
    required super.price,
    super.discountPercentage,
    required super.rating,
    required super.stock,
    super.brand,
    required super.category,
    required super.thumbnail,
    super.images,
    super.specifications,
  });

  factory ProductModel.fromJson(Map<String, dynamic> json) {
    List<String> imagesList = [];
    if (json['images'] is List) {
      imagesList = (json['images'] as List).map((e) => e.toString()).toList();
    }

    return ProductModel(
      id: json['id'] as int? ?? 0,
      title: json['title'] as String? ?? 'Untitled Product',
      description: json['description'] as String? ?? '',
      price: (json['price'] as num?)?.toDouble() ?? 0.0,
      discountPercentage: (json['discountPercentage'] as num?)?.toDouble() ?? 0.0,
      rating: (json['rating'] as num?)?.toDouble() ?? 4.5,
      stock: (json['stock'] as num?)?.toInt() ?? 10,
      brand: json['brand'] as String? ?? 'ShopVerse',
      category: json['category'] as String? ?? 'general',
      thumbnail: json['thumbnail'] as String? ?? 
          (imagesList.isNotEmpty ? imagesList.first : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'),
      images: imagesList.isNotEmpty
          ? imagesList
          : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'],
      specifications: json['specifications'] is Map
          ? Map<String, dynamic>.from(json['specifications'] as Map)
          : {
              'Brand': json['brand'] ?? 'ShopVerse',
              'Category': json['category'] ?? 'General',
              'Warranty': json['warrantyInformation'] ?? '1 Year Official Warranty',
              'Shipping': json['shippingInformation'] ?? 'Free Standard Delivery',
            },
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'price': price,
      'discountPercentage': discountPercentage,
      'rating': rating,
      'stock': stock,
      'brand': brand,
      'category': category,
      'thumbnail': thumbnail,
      'images': images,
      'specifications': specifications,
    };
  }

  ProductEntity toEntity() => this;
}
