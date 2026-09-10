import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/product.dart';
import '../repositories/storage_repository.dart';
import 'products_provider.dart';

final storageRepositoryProvider = Provider<StorageRepository>((ref) {
  return SharedPreferencesStorageRepository();
});

class FavoritesNotifier extends StateNotifier<Set<String>> {
  final StorageRepository _storageRepository;

  FavoritesNotifier(this._storageRepository) : super({}) {
    _loadFromStorage();
  }

  Future<void> _loadFromStorage() async {
    final savedFavorites = await _storageRepository.loadFavorites();
    state = savedFavorites;
  }

  Future<void> toggleFavorite(String productId) async {
    final updated = Set<String>.from(state);
    if (updated.contains(productId)) {
      updated.remove(productId);
    } else {
      updated.add(productId);
    }
    state = updated;
    await _storageRepository.saveFavorites(updated);
  }

  bool isFavorite(String productId) => state.contains(productId);

  Future<void> clearAll() async {
    state = {};
    await _storageRepository.saveFavorites({});
  }
}

final favoritesProvider = StateNotifierProvider<FavoritesNotifier, Set<String>>((ref) {
  final storage = ref.watch(storageRepositoryProvider);
  return FavoritesNotifier(storage);
});

// Computed Favorites Products List Provider
final favoriteProductsProvider = Provider<AsyncValue<List<Product>>>((ref) {
  final favoritesIds = ref.watch(favoritesProvider);
  final productsAsync = ref.watch(productsFutureProvider);

  return productsAsync.whenData(
    (products) => products.where((p) => favoritesIds.contains(p.id)).toList(),
  );
});
