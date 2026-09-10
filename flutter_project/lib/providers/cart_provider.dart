import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/cart_item.dart';
import '../models/product.dart';

class CartNotifier extends StateNotifier<CartState> {
  CartNotifier() : super(const CartState(shippingCost: 0.0)); // Free shipping

  void addItem(Product product, {int quantity = 1, String? selectedColor}) {
    final existingIndex = state.items.indexWhere(
      (item) => item.product.id == product.id && item.selectedColor == selectedColor,
    );

    if (existingIndex >= 0) {
      // Update quantity
      final existingItem = state.items[existingIndex];
      final updatedList = List<CartItem>.from(state.items);
      updatedList[existingIndex] = existingItem.copyWith(
        quantity: existingItem.quantity + quantity,
      );
      state = state.copyWith(items: updatedList);
    } else {
      // Add new item
      final newItem = CartItem(
        product: product,
        quantity: quantity,
        selectedColor: selectedColor ?? (product.colors.isNotEmpty ? product.colors.first.name : null),
      );
      state = state.copyWith(items: [...state.items, newItem]);
    }
  }

  void updateQuantity(String productId, int newQuantity, {String? selectedColor}) {
    if (newQuantity <= 0) {
      removeItem(productId, selectedColor: selectedColor);
      return;
    }

    final updatedList = state.items.map((item) {
      if (item.product.id == productId && (selectedColor == null || item.selectedColor == selectedColor)) {
        return item.copyWith(quantity: newQuantity);
      }
      return item;
    }).toList();

    state = state.copyWith(items: updatedList);
  }

  void removeItem(String productId, {String? selectedColor}) {
    final updatedList = state.items.where(
      (item) => !(item.product.id == productId && (selectedColor == null || item.selectedColor == selectedColor)),
    ).toList();

    state = state.copyWith(items: updatedList);
  }

  bool applyCoupon(String code) {
    final upper = code.trim().toUpperCase();
    if (upper == 'SAVE20') {
      state = state.copyWith(appliedCoupon: 'SAVE20', discountRate: 0.20);
      return true;
    } else if (upper == 'WELCOME10') {
      state = state.copyWith(appliedCoupon: 'WELCOME10', discountRate: 0.10);
      return true;
    }
    return false;
  }

  void removeCoupon() {
    state = state.copyWith(appliedCoupon: null, discountRate: 0.0);
  }

  void clearCart() {
    state = const CartState();
  }
}

final cartProvider = StateNotifierProvider<CartNotifier, CartState>((ref) {
  return CartNotifier();
});

// Computed Count Provider
final cartCountProvider = Provider<int>((ref) {
  final cart = ref.watch(cartProvider);
  return cart.totalQuantity;
});

// Computed Total Provider
final cartTotalProvider = Provider<double>((ref) {
  final cart = ref.watch(cartProvider);
  return cart.total;
});
