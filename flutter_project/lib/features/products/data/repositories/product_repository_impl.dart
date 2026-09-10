import '../../../../core/api/app_exception.dart';
import '../../../../core/network/network_info.dart';
import '../../domain/entities/product_entity.dart';
import '../../domain/repositories/product_repository.dart';
import '../datasources/product_local_datasource.dart';
import '../datasources/product_remote_datasource.dart';
import '../models/product_model.dart';

class ProductRepositoryImpl implements ProductRepository {
  final ProductRemoteDataSource remoteDataSource;
  final ProductLocalDataSource localDataSource;
  final NetworkInfo networkInfo;

  bool _isLastFetchOffline = false;

  ProductRepositoryImpl({
    required this.remoteDataSource,
    required this.localDataSource,
    required this.networkInfo,
  });

  @override
  bool get isOfflineModeActiveCached => _isLastFetchOffline;

  @override
  Future<bool> isOfflineModeActive() async {
    final connected = await networkInfo.isConnected;
    return !connected || _isLastFetchOffline;
  }

  @override
  Future<List<ProductEntity>> getProducts({
    String? category,
    String? searchQuery,
    bool forceRefresh = false,
  }) async {
    final isOnline = await networkInfo.isConnected;

    if (isOnline) {
      try {
        final remoteProducts = await remoteDataSource.getProducts(
          category: category,
          searchQuery: searchQuery,
        );

        // Update local cache in Hive if this was a general fetch
        if (category == null && (searchQuery == null || searchQuery.isEmpty)) {
          await localDataSource.cacheProducts(remoteProducts);
        }

        _isLastFetchOffline = false;
        return remoteProducts.map((p) => p.toEntity()).toList();
      } catch (error) {
        // Network failed (e.g. server down or timeout), attempt Hive cache fallback
        return _fallbackToCache(category, searchQuery, originalError: error);
      }
    } else {
      // Offline mode: directly fetch from Hive local cache
      return _fallbackToCache(category, searchQuery);
    }
  }

  Future<List<ProductEntity>> _fallbackToCache(
    String? category,
    String? searchQuery, {
    Object? originalError,
  }) async {
    final cached = await localDataSource.getCachedProducts();

    if (cached.isNotEmpty) {
      _isLastFetchOffline = true;
      Iterable<ProductModel> filtered = cached;

      if (category != null && category.isNotEmpty && category.toLowerCase() != 'all') {
        filtered = filtered.where((p) => p.category.toLowerCase() == category.toLowerCase());
      }

      if (searchQuery != null && searchQuery.trim().isNotEmpty) {
        final q = searchQuery.toLowerCase().trim();
        filtered = filtered.where((p) =>
            p.title.toLowerCase().contains(q) ||
            p.description.toLowerCase().contains(q));
      }

      return filtered.map((p) => p.toEntity()).toList();
    }

    // If cache is empty and network failed, propagate error
    if (originalError is AppException) {
      throw originalError;
    }
    throw const CacheException(
      'Aucune connexion réseau et aucun produit en cache local. Veuillez vous connecter à Internet.',
    );
  }

  @override
  Future<ProductEntity> getProductById(int id) async {
    final isOnline = await networkInfo.isConnected;

    if (isOnline) {
      try {
        final product = await remoteDataSource.getProductById(id);
        return product.toEntity();
      } catch (_) {
        // Fallback to local cache
        final cached = await localDataSource.getCachedProductById(id);
        if (cached != null) {
          _isLastFetchOffline = true;
          return cached.toEntity();
        }
        rethrow;
      }
    } else {
      final cached = await localDataSource.getCachedProductById(id);
      if (cached != null) {
        _isLastFetchOffline = true;
        return cached.toEntity();
      }
      throw const NetworkException('Mode hors-ligne : Ce produit n\'est pas encore disponible en cache.');
    }
  }

  @override
  Future<List<String>> getCategories() async {
    try {
      if (await networkInfo.isConnected) {
        return await remoteDataSource.getCategories();
      }
    } catch (_) {}

    // Fallback: extract distinct categories from cached products
    final cached = await localDataSource.getCachedProducts();
    if (cached.isNotEmpty) {
      final cats = cached.map((p) => p.category).toSet().toList();
      return cats;
    }
    return ['beauty', 'fragrances', 'furniture', 'groceries', 'smartphones', 'laptops'];
  }
}
