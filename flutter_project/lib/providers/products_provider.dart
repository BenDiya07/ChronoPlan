import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/product.dart';
import '../models/filter_state.dart';
import '../repositories/product_repository.dart';

// 1. Product Repository Provider (Dependency Injection)
final productRepositoryProvider = Provider<ProductRepository>((ref) {
  return MockProductRepository();
});

// 2. Products FutureProvider (Exposes AsyncValue<List<Product>>)
final productsFutureProvider = FutureProvider<List<Product>>((ref) async {
  final repository = ref.watch(productRepositoryProvider);
  return repository.fetchProducts();
});

// 3. Filter State Notifier & Provider
class FilterNotifier extends StateNotifier<FilterState> {
  FilterNotifier() : super(const FilterState());

  void setSearchQuery(String query) {
    state = state.copyWith(searchQuery: query);
  }

  void setCategory(String category) {
    state = state.copyWith(selectedCategory: category);
  }

  void setPriceRange(double min, double max) {
    state = state.copyWith(minPrice: min, maxPrice: max);
  }

  void setMaxPrice(double max) {
    state = state.copyWith(maxPrice: max);
  }

  void setMinRating(double rating) {
    state = state.copyWith(minRating: rating);
  }

  void setSortOption(SortOption sortBy) {
    state = state.copyWith(sortBy: sortBy);
  }

  void setSortBy(SortOption sortBy) {
    state = state.copyWith(sortBy: sortBy);
  }

  void toggleInStock(bool onlyInStock) {
    state = state.copyWith(onlyInStock: onlyInStock);
  }

  void resetFilters() {
    state = state.reset();
  }
}

final filterStateProvider = StateNotifierProvider<FilterNotifier, FilterState>((ref) {
  return FilterNotifier();
});

// 4. Filtered & Sorted Products Computed Provider
final filteredProductsProvider = Provider<AsyncValue<List<Product>>>((ref) {
  final productsAsync = ref.watch(productsFutureProvider);
  final filter = ref.watch(filterStateProvider);

  return productsAsync.whenData((products) {
    var result = products.where((product) {
      // Search Query Filter
      if (filter.searchQuery.isNotEmpty) {
        final q = filter.searchQuery.toLowerCase();
        final matchTitle = product.title.toLowerCase().contains(q);
        final matchSub = product.subtitle.toLowerCase().contains(q);
        final matchCategory = product.category.toLowerCase().contains(q);
        final matchTag = product.tags.any((t) => t.toLowerCase().contains(q));
        if (!matchTitle && !matchSub && !matchCategory && !matchTag) return false;
      }

      // Category Filter
      if (filter.selectedCategory != 'All' && product.category != filter.selectedCategory) {
        return false;
      }

      // Price Filter
      if (product.price < filter.minPrice || product.price > filter.maxPrice) {
        return false;
      }

      // Rating Filter
      if (product.rating < filter.minRating) {
        return false;
      }

      // Stock Filter
      if (filter.onlyInStock && !product.inStock) {
        return false;
      }

      return true;
    }).toList();

    // Sorting
    switch (filter.sortBy) {
      case SortOption.priceAsc:
        result.sort((a, b) => a.price.compareTo(b.price));
        break;
      case SortOption.priceDesc:
        result.sort((a, b) => b.price.compareTo(a.price));
        break;
      case SortOption.rating:
        result.sort((a, b) => b.rating.compareTo(a.rating));
        break;
      case SortOption.newest:
        // By stock or id reverse
        result.sort((a, b) => b.stock.compareTo(a.stock));
        break;
      case SortOption.popularity:
      default:
        result.sort((a, b) => b.reviewCount.compareTo(a.reviewCount));
        break;
    }

    return result;
  });
});

// 5. Featured Products Provider
final featuredProductsProvider = Provider<AsyncValue<List<Product>>>((ref) {
  final productsAsync = ref.watch(productsFutureProvider);
  return productsAsync.whenData((products) => products.where((p) => p.isFeatured).toList());
});

// 6. Flash Sale Products Provider
final flashSaleProductsProvider = Provider<AsyncValue<List<Product>>>((ref) {
  final productsAsync = ref.watch(productsFutureProvider);
  return productsAsync.whenData((products) => products.where((p) => p.isFlashSale).toList());
});
