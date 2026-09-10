import '../../../../core/cache/hive_service.dart';
import '../models/product_model.dart';

abstract class ProductLocalDataSource {
  Future<void> cacheProducts(List<ProductModel> products);
  Future<List<ProductModel>> getCachedProducts();
  Future<ProductModel?> getCachedProductById(int id);
  Future<void> clearCache();
  String? getLastCacheTime();
}

class ProductLocalDataSourceImpl implements ProductLocalDataSource {
  final HiveService hiveService;

  ProductLocalDataSourceImpl({required this.hiveService});

  @override
  Future<void> cacheProducts(List<ProductModel> products) async {
    final listJson = products.map((p) => p.toJson()).toList();
    await hiveService.cacheProducts(listJson);
  }

  @override
  Future<List<ProductModel>> getCachedProducts() async {
    final cached = hiveService.getCachedProducts();
    if (cached.isEmpty) return [];
    return cached.map((map) => ProductModel.fromJson(map)).toList();
  }

  @override
  Future<ProductModel?> getCachedProductById(int id) async {
    final list = await getCachedProducts();
    try {
      return list.firstWhere((p) => p.id == id);
    } catch (_) {
      return null;
    }
  }

  @override
  Future<void> clearCache() async {
    await hiveService.clearProductCache();
  }

  @override
  String? getLastCacheTime() => hiveService.getLastCacheTime();
}
