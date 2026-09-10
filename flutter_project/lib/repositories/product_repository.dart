import '../models/product.dart';
import '../data/mock_products.dart';

abstract class ProductRepository {
  Future<List<Product>> fetchProducts({bool forceError = false});
  Future<Product> fetchProductById(String id);
}

class MockProductRepository implements ProductRepository {
  @override
  Future<List<Product>> fetchProducts({bool forceError = false}) async {
    // Simulate real network latency (e.g. 600ms)
    await Future.delayed(const Duration(milliseconds: 600));

    if (forceError) {
      throw Exception('Impossible de récupérer le catalogue de produits. Veuillez réessayer.');
    }

    return MOCK_PRODUCTS_DATA;
  }

  @override
  Future<Product> fetchProductById(String id) async {
    await Future.delayed(const Duration(milliseconds: 300));
    final product = MOCK_PRODUCTS_DATA.firstWhere(
      (p) => p.id == id,
      orElse: () => throw Exception('Produit introuvable (ID: $id)'),
    );
    return product;
  }
}
