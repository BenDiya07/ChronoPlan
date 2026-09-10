import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/network/network_info.dart';
import '../../../auth/presentation/providers/auth_provider.dart';
import '../../data/datasources/product_local_datasource.dart';
import '../../data/datasources/product_remote_datasource.dart';
import '../../data/repositories/product_repository_impl.dart';
import '../../domain/entities/product_entity.dart';
import '../../domain/repositories/product_repository.dart';

final networkInfoProvider = Provider<NetworkInfo>((ref) {
  return NetworkInfoImpl();
});

final productLocalDataSourceProvider = Provider<ProductLocalDataSource>((ref) {
  return ProductLocalDataSourceImpl(hiveService: ref.watch(hiveServiceProvider));
});

final productRemoteDataSourceProvider = Provider<ProductRemoteDataSource>((ref) {
  return ProductRemoteDataSourceImpl(dio: ref.watch(dioClientProvider).dio);
});

final productRepositoryProvider = Provider<ProductRepository>((ref) {
  return ProductRepositoryImpl(
    remoteDataSource: ref.watch(productRemoteDataSourceProvider),
    localDataSource: ref.watch(productLocalDataSourceProvider),
    networkInfo: ref.watch(networkInfoProvider),
  );
});

// Category and Search State
final selectedCategoryProvider = StateProvider<String>((ref) => 'All');
final productSearchQueryProvider = StateProvider<String>((ref) => '');

// Products State with Offline indicator
class ProductsCatalogState {
  final AsyncValue<List<ProductEntity>> products;
  final bool isOffline;
  final String? lastCacheTime;

  const ProductsCatalogState({
    required this.products,
    this.isOffline = false,
    this.lastCacheTime,
  });

  ProductsCatalogState copyWith({
    AsyncValue<List<ProductEntity>>? products,
    bool? isOffline,
    String? lastCacheTime,
  }) {
    return ProductsCatalogState(
      products: products ?? this.products,
      isOffline: isOffline ?? this.isOffline,
      lastCacheTime: lastCacheTime ?? this.lastCacheTime,
    );
  }
}

class ProductsCatalogNotifier extends StateNotifier<ProductsCatalogState> {
  final ProductRepository _repository;
  final ProductLocalDataSource _localDataSource;

  ProductsCatalogNotifier({
    required ProductRepository repository,
    required ProductLocalDataSource localDataSource,
  })  : _repository = repository,
        _localDataSource = localDataSource,
        super(const ProductsCatalogState(products: AsyncValue.loading())) {
    loadProducts();
  }

  Future<void> loadProducts({String? category, String? search}) async {
    state = state.copyWith(products: const AsyncValue.loading());
    try {
      final list = await _repository.getProducts(
        category: category,
        searchQuery: search,
      );
      final isOffline = await _repository.isOfflineModeActive();
      final cacheTime = _localDataSource.getLastCacheTime();

      state = state.copyWith(
        products: AsyncValue.data(list),
        isOffline: isOffline,
        lastCacheTime: cacheTime,
      );
    } catch (e, st) {
      final isOffline = await _repository.isOfflineModeActive();
      state = state.copyWith(
        products: AsyncValue.error(e, st),
        isOffline: isOffline,
      );
    }
  }

  Future<void> refresh() async {
    await loadProducts();
  }
}

final productsCatalogProvider = StateNotifierProvider<ProductsCatalogNotifier, ProductsCatalogState>((ref) {
  final repository = ref.watch(productRepositoryProvider);
  final localDs = ref.watch(productLocalDataSourceProvider);
  final notifier = ProductsCatalogNotifier(repository: repository, localDataSource: localDs);

  // Auto-listen to filter and search changes
  ref.listen<String>(selectedCategoryProvider, (prev, next) {
    notifier.loadProducts(category: next, search: ref.read(productSearchQueryProvider));
  });

  ref.listen<String>(productSearchQueryProvider, (prev, next) {
    notifier.loadProducts(category: ref.read(selectedCategoryProvider), search: next);
  });

  return notifier;
});

// Categories FutureProvider from REST API
final categoriesFutureProvider = FutureProvider<List<String>>((ref) async {
  final repository = ref.watch(productRepositoryProvider);
  final list = await repository.getCategories();
  return ['All', ...list];
});

// Single Product Details FutureProvider (family)
final productDetailsProvider = FutureProvider.family<ProductEntity, int>((ref, id) async {
  final repository = ref.watch(productRepositoryProvider);
  return repository.getProductById(id);
});
