import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/products_provider.dart';
import '../models/filter_state.dart';
import '../widgets/product_card.dart';
import '../widgets/async_value_widget.dart';

class CatalogScreen extends ConsumerStatefulWidget {
  const CatalogScreen({super.key});

  @override
  ConsumerState<CatalogScreen> createState() => _CatalogScreenState();
}

class _CatalogScreenState extends ConsumerState<CatalogScreen> {
  final TextEditingController _searchController = TextEditingController();
  bool _isGridView = true;

  final List<String> categories = ['All', 'Audio', 'Electronics', 'Fashion', 'Accessories', 'Home'];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _showFilterModal() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Theme.of(context).cardColor,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return Consumer(
          builder: (context, ref, child) {
            final filter = ref.watch(filterStateProvider);
            return Padding(
              padding: EdgeInsets.only(
                top: 20,
                left: 20,
                right: 20,
                bottom: MediaQuery.of(context).viewInsets.bottom + 20,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Filtres & Tri', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                      TextButton(
                        onPressed: () => ref.read(filterStateProvider.notifier).resetFilters(),
                        child: const Text('Réinitialiser'),
                      ),
                    ],
                  ),
                  const Divider(),
                  const SizedBox(height: 8),
                  const Text('Trier par', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                  Wrap(
                    spacing: 8,
                    children: [
                      ChoiceChip(
                        label: const Text('Popularité'),
                        selected: filter.sortBy == SortOption.popularity,
                        onSelected: (_) => ref.read(filterStateProvider.notifier).setSortOption(SortOption.popularity),
                      ),
                      ChoiceChip(
                        label: const Text('Prix croissant'),
                        selected: filter.sortBy == SortOption.priceAsc,
                        onSelected: (_) => ref.read(filterStateProvider.notifier).setSortOption(SortOption.priceAsc),
                      ),
                      ChoiceChip(
                        label: const Text('Prix décroissant'),
                        selected: filter.sortBy == SortOption.priceDesc,
                        onSelected: (_) => ref.read(filterStateProvider.notifier).setSortOption(SortOption.priceDesc),
                      ),
                      ChoiceChip(
                        label: const Text('Meilleures notes'),
                        selected: filter.sortBy == SortOption.rating,
                        onSelected: (_) => ref.read(filterStateProvider.notifier).setSortOption(SortOption.rating),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Text('Prix max: $${filter.maxPrice.round()}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                  Slider(
                    value: filter.maxPrice,
                    min: 100,
                    max: 2000,
                    divisions: 19,
                    label: '$${filter.maxPrice.round()}',
                    onChanged: (val) => ref.read(filterStateProvider.notifier).setPriceRange(filter.minPrice, val),
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () => Navigator.pop(context),
                      child: const Text('Appliquer les filtres'),
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final filteredProductsAsync = ref.watch(filteredProductsProvider);
    final filterState = ref.watch(filterStateProvider);
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Catalogue Produits', style: TextStyle(fontWeight: FontWeight.bold)),
        actions: [
          IconButton(
            icon: Icon(_isGridView ? Icons.view_list_rounded : Icons.grid_view_rounded),
            onPressed: () => setState(() => _isGridView = !_isGridView),
          ),
          IconButton(
            icon: Stack(
              children: [
                const Icon(Icons.tune_rounded),
                if (filterState.hasActiveFilters)
                  Positioned(
                    right: 0,
                    top: 0,
                    child: Container(
                      width: 8,
                      height: 8,
                      decoration: const BoxDecoration(
                        color: Colors.redAccent,
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),
              ],
            ),
            onPressed: _showFilterModal,
          ),
        ],
      ),
      body: Column(
        children: [
          // Search Bar
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: TextField(
              controller: _searchController,
              onChanged: (val) => ref.read(filterStateProvider.notifier).setSearchQuery(val),
              decoration: InputDecoration(
                hintText: 'Rechercher un produit, marque ou catégorie...',
                prefixIcon: const Icon(Icons.search_rounded, size: 20),
                suffixIcon: _searchController.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear, size: 18),
                        onPressed: () {
                          _searchController.clear();
                          ref.read(filterStateProvider.notifier).setSearchQuery('');
                        },
                      )
                    : null,
                filled: true,
                fillColor: theme.cardColor,
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
          ),

          // Categories Horizontal Chips
          SizedBox(
            height: 42,
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              scrollDirection: Axis.horizontal,
              itemCount: categories.length,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (context, index) {
                final cat = categories[index];
                final isSelected = filterState.selectedCategory == cat;
                return ChoiceChip(
                  label: Text(cat),
                  selected: isSelected,
                  onSelected: (_) => ref.read(filterStateProvider.notifier).setCategory(cat),
                );
              },
            ),
          ),
          const SizedBox(height: 8),

          // Main Product List / Grid using AsyncValueWidget
          Expanded(
            child: AsyncValueWidget(
              value: filteredProductsAsync,
              onRetry: () => ref.refresh(productsFutureProvider),
              data: (products) {
                if (products.isEmpty) {
                  return Center(
                    child: Padding(
                      padding: const EdgeInsets.all(32),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.search_off_rounded, size: 64, color: Colors.grey.shade600),
                          const SizedBox(height: 16),
                          const Text(
                            'Aucun produit trouvé',
                            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 8),
                          const Text(
                            'Essayez de modifier votre recherche ou vos filtres.',
                            textAlign: TextAlign.center,
                            style: TextStyle(color: Colors.grey),
                          ),
                          const SizedBox(height: 16),
                          ElevatedButton(
                            onPressed: () {
                              _searchController.clear();
                              ref.read(filterStateProvider.notifier).resetFilters();
                            },
                            child: const Text('Réinitialiser les filtres'),
                          ),
                        ],
                      ),
                    ),
                  );
                }

                return _isGridView
                    ? GridView.builder(
                        padding: const EdgeInsets.all(16),
                        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2,
                          childAspectRatio: 0.64,
                          crossAxisSpacing: 14,
                          mainAxisSpacing: 14,
                        ),
                        itemCount: products.length,
                        itemBuilder: (context, index) => ProductCard(product: products[index]),
                      )
                    : ListView.separated(
                        padding: const EdgeInsets.all(16),
                        itemCount: products.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 12),
                        itemBuilder: (context, index) => ProductCard(product: products[index]),
                      );
              },
            ),
          ),
        ],
      ),
    );
  }
}
