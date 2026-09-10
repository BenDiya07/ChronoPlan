import '../entities/product_entity.dart';

abstract class ProductRepository {
  Future<List<ProductEntity>> getProducts({
    String? category,
    String? searchQuery,
    bool forceRefresh = false,
  });

  Future<ProductEntity> getProductById(int id);

  Future<List<String>> getCategories();

  Future<bool> isOfflineModeActive();
}
