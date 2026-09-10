import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/favorites_provider.dart';
import '../providers/cart_provider.dart';
import '../widgets/product_card.dart';
import '../widgets/async_value_widget.dart';

class FavoritesScreen extends ConsumerWidget {
  const FavoritesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final favoritesAsync = ref.watch(favoriteProductsProvider);
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Mes Favoris', style: TextStyle(fontWeight: FontWeight.bold)),
        actions: [
          IconButton(
            tooltip: 'Tout vider',
            icon: const Icon(Icons.delete_outline_rounded),
            onPressed: () => ref.read(favoritesProvider.notifier).clearAll(),
          ),
        ],
      ),
      body: AsyncValueWidget(
        value: favoritesAsync,
        data: (favoriteProducts) {
          if (favoriteProducts.isEmpty) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(32),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF43F5E).withOpacity(0.1),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.favorite_border_rounded, size: 64, color: Color(0xFFF43F5E)),
                    ),
                    const SizedBox(height: 20),
                    const Text(
                      'Aucun favori enregistré',
                      style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Enregistrez vos articles préférés pour les retrouver à tout moment.',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: Colors.grey),
                    ),
                    const SizedBox(height: 24),
                    ElevatedButton(
                      onPressed: () => context.go('/catalog'),
                      child: const Text('Découvrir des articles'),
                    ),
                  ],
                ),
              ),
            );
          }

          return Column(
            children: [
              // Quick action: Move all to cart
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '${favoriteProducts.length} articles sauvegardés',
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                    ),
                    TextButton.icon(
                      icon: const Icon(Icons.add_shopping_cart_rounded, size: 16),
                      label: const Text('Tout ajouter au panier'),
                      onPressed: () {
                        for (final p in favoriteProducts) {
                          ref.read(cartProvider.notifier).addItem(p);
                        }
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Tous les favoris ont été ajoutés au panier !')),
                        );
                      },
                    ),
                  ],
                ),
              ),

              Expanded(
                child: GridView.builder(
                  padding: const EdgeInsets.all(16),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    childAspectRatio: 0.64,
                    crossAxisSpacing: 14,
                    mainAxisSpacing: 14,
                  ),
                  itemCount: favoriteProducts.length,
                  itemBuilder: (context, index) => ProductCard(product: favoriteProducts[index]),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}
