import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:chronoplan_time_management/models/product.dart';
import 'package:chronoplan_time_management/providers/cart_provider.dart';

void main() {
  group('CartNotifier Unit Tests', () {
    late ProviderContainer container;

    final dummyProduct1 = Product(
      id: 'prod_1',
      title: 'Wireless Headphones',
      subtitle: 'Noise cancelling headphones',
      description: 'Noise cancelling headphones',
      price: 100.0,
      rating: 4.8,
      reviewCount: 120,
      category: 'Audio',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      additionalImages: const [],
      isFlashSale: false,
      stock: 15,
      colors: const [
        ProductColor(name: 'Midnight Black', hex: '#000000'),
        ProductColor(name: 'Silver', hex: '#C0C0C0'),
      ],
      tags: const ['audio'],
      specs: const {'Driver': '40mm'},
    );

    final dummyProduct2 = Product(
      id: 'prod_2',
      title: 'Smart Watch',
      subtitle: 'Fitness tracker',
      description: 'Fitness tracker',
      price: 200.0,
      rating: 4.6,
      reviewCount: 90,
      category: 'Electronics',
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      additionalImages: const [],
      isFlashSale: true,
      stock: 8,
      colors: const [
        ProductColor(name: 'Space Gray', hex: '#717378'),
      ],
      tags: const ['electronics'],
      specs: const {'Battery': '48h'},
    );

    setUp(() {
      container = ProviderContainer();
    });

    tearDown(() {
      container.dispose();
    });

    test('Initial cart state is empty', () {
      final cart = container.read(cartProvider);
      expect(cart.items.isEmpty, true);
      expect(cart.totalItemCount, 0);
      expect(cart.subtotal, 0.0);
      expect(cart.total, 0.0);
    });

    test('Adding product adds item to cart and updates subtotal', () {
      final cartNotifier = container.read(cartProvider.notifier);
      cartNotifier.addItem(dummyProduct1, selectedColor: 'Midnight Black', quantity: 1);

      final state = container.read(cartProvider);
      expect(state.items.length, 1);
      expect(state.items.first.product.id, 'prod_1');
      expect(state.items.first.quantity, 1);
      expect(state.subtotal, 100.0);
      expect(state.totalItemCount, 1);
    });

    test('Adding existing product increments quantity rather than duplicating item', () {
      final cartNotifier = container.read(cartProvider.notifier);
      cartNotifier.addItem(dummyProduct1, selectedColor: 'Midnight Black', quantity: 1);
      cartNotifier.addItem(dummyProduct1, selectedColor: 'Midnight Black', quantity: 2);

      final state = container.read(cartProvider);
      expect(state.items.length, 1);
      expect(state.items.first.quantity, 3);
      expect(state.subtotal, 300.0);
      expect(state.totalItemCount, 3);
    });

    test('Updating quantity adjusts cart item and totals', () {
      final cartNotifier = container.read(cartProvider.notifier);
      cartNotifier.addItem(dummyProduct1, selectedColor: 'Midnight Black', quantity: 2);
      
      final itemId = container.read(cartProvider).items.first.id;
      cartNotifier.updateQuantity(itemId, 5);

      final state = container.read(cartProvider);
      expect(state.items.first.quantity, 5);
      expect(state.subtotal, 500.0);
    });

    test('Setting quantity to 0 removes the item from cart', () {
      final cartNotifier = container.read(cartProvider.notifier);
      cartNotifier.addItem(dummyProduct1, selectedColor: 'Midnight Black', quantity: 1);
      
      final itemId = container.read(cartProvider).items.first.id;
      cartNotifier.updateQuantity(itemId, 0);

      final state = container.read(cartProvider);
      expect(state.items.isEmpty, true);
      expect(state.totalItemCount, 0);
    });

    test('Applying valid promo code SAVE20 applies 20% discount', () {
      final cartNotifier = container.read(cartProvider.notifier);
      cartNotifier.addItem(dummyProduct1, selectedColor: 'Midnight Black', quantity: 1); // 100.0
      
      final success = cartNotifier.applyCoupon('SAVE20');
      expect(success, true);

      final state = container.read(cartProvider);
      expect(state.appliedCoupon, 'SAVE20');
      expect(state.discountAmount, 20.0); // 20% of 100
      expect(state.total, 80.0); // 100 - 20 (free shipping over 50)
    });

    test('Applying invalid promo code fails and leaves cart unchanged', () {
      final cartNotifier = container.read(cartProvider.notifier);
      cartNotifier.addItem(dummyProduct1, selectedColor: 'Midnight Black', quantity: 1);
      
      final success = cartNotifier.applyCoupon('INVALID_CODE');
      expect(success, false);

      final state = container.read(cartProvider);
      expect(state.appliedCoupon, null);
      expect(state.discountAmount, 0.0);
    });

    test('Clearing cart resets all items and applied coupon', () {
      final cartNotifier = container.read(cartProvider.notifier);
      cartNotifier.addItem(dummyProduct1, quantity: 1);
      cartNotifier.addItem(dummyProduct2, quantity: 1);
      cartNotifier.applyCoupon('WELCOME10');

      expect(container.read(cartProvider).items.length, 2);

      cartNotifier.clearCart();
      final state = container.read(cartProvider);
      expect(state.items.isEmpty, true);
      expect(state.appliedCoupon, null);
      expect(state.subtotal, 0.0);
      expect(state.total, 0.0);
    });
  });
}
