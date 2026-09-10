import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:chronoplan_time_management/models/filter_state.dart';
import 'package:chronoplan_time_management/providers/products_provider.dart';

void main() {
  group('FilterNotifier & Computed Provider Unit Tests', () {
    late ProviderContainer container;

    setUp(() {
      container = ProviderContainer();
    });

    tearDown(() {
      container.dispose();
    });

    test('Initial filter state has default values', () {
      final filter = container.read(filterStateProvider);
      expect(filter.searchQuery, '');
      expect(filter.selectedCategory, 'All');
      expect(filter.sortBy, SortOption.popularity);
      expect(filter.inStockOnly, false);
      expect(filter.minRating, 0.0);
      expect(filter.maxPrice, 1500.0);
    });

    test('Setting search query updates filter state', () {
      final notifier = container.read(filterStateProvider.notifier);
      notifier.setSearchQuery('Sony');

      final filter = container.read(filterStateProvider);
      expect(filter.searchQuery, 'Sony');
    });

    test('Setting category filter updates selected category', () {
      final notifier = container.read(filterStateProvider.notifier);
      notifier.setCategory('Electronics');

      final filter = container.read(filterStateProvider);
      expect(filter.selectedCategory, 'Electronics');
    });

    test('Setting sorting option updates sortBy', () {
      final notifier = container.read(filterStateProvider.notifier);
      notifier.setSortBy(SortOption.priceAsc);

      final filter = container.read(filterStateProvider);
      expect(filter.sortBy, SortOption.priceAsc);
    });

    test('Resetting filters restores default values', () {
      final notifier = container.read(filterStateProvider.notifier);
      notifier.setSearchQuery('Smart');
      notifier.setCategory('Audio');
      notifier.setMaxPrice(300.0);
      notifier.setSortBy(SortOption.rating);

      notifier.resetFilters();

      final filter = container.read(filterStateProvider);
      expect(filter.searchQuery, '');
      expect(filter.selectedCategory, 'All');
      expect(filter.maxPrice, 1500.0);
      expect(filter.sortBy, SortOption.popularity);
    });
  });
}
