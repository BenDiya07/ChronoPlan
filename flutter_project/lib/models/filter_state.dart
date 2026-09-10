enum SortOption {
  popularity,
  priceAsc,
  priceDesc,
  rating,
  newest,
}

class FilterState {
  final String searchQuery;
  final String selectedCategory;
  final double minPrice;
  final double maxPrice;
  final double minRating;
  final SortOption sortBy;
  final bool onlyInStock;

  const FilterState({
    this.searchQuery = '',
    this.selectedCategory = 'All',
    this.minPrice = 0.0,
    this.maxPrice = 1500.0,
    this.minRating = 0.0,
    this.sortBy = SortOption.popularity,
    this.onlyInStock = false,
  });

  bool get hasActiveFilters =>
      searchQuery.isNotEmpty ||
      selectedCategory != 'All' ||
      minPrice > 0 ||
      maxPrice < 1500 ||
      minRating > 0 ||
      onlyInStock ||
      sortBy != SortOption.popularity;

  FilterState copyWith({
    String? searchQuery,
    String? selectedCategory,
    double? minPrice,
    double? maxPrice,
    double? minRating,
    SortOption? sortBy,
    bool? onlyInStock,
  }) {
    return FilterState(
      searchQuery: searchQuery ?? this.searchQuery,
      selectedCategory: selectedCategory ?? this.selectedCategory,
      minPrice: minPrice ?? this.minPrice,
      maxPrice: maxPrice ?? this.maxPrice,
      minRating: minRating ?? this.minRating,
      sortBy: sortBy ?? this.sortBy,
      onlyInStock: onlyInStock ?? this.onlyInStock,
    );
  }

  FilterState reset() => const FilterState();
}
