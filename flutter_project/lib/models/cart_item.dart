import 'product.dart';

class CartItem {
  final Product product;
  final int quantity;
  final String? selectedColor;

  const CartItem({
    required this.product,
    required this.quantity,
    this.selectedColor,
  });

  double get totalPrice => product.price * quantity;

  CartItem copyWith({
    Product? product,
    int? quantity,
    String? selectedColor,
  }) {
    return CartItem(
      product: product ?? this.product,
      quantity: quantity ?? this.quantity,
      selectedColor: selectedColor ?? this.selectedColor,
    );
  }
}

class CartState {
  final List<CartItem> items;
  final String? appliedCoupon;
  final double discountRate; // e.g. 0.20 for 20%
  final double shippingCost;

  const CartState({
    this.items = const [],
    this.appliedCoupon,
    this.discountRate = 0.0,
    this.shippingCost = 0.0,
  });

  int get totalQuantity => items.fold(0, (sum, item) => sum + item.quantity);

  int get totalItemCount => totalQuantity;

  double get subtotal => items.fold(0.0, (sum, item) => sum + item.totalPrice);

  double get discountAmount => subtotal * discountRate;

  double get total => (subtotal - discountAmount + (subtotal > 0 ? shippingCost : 0.0)).clamp(0.0, double.infinity);

  bool get isEmpty => items.isEmpty;

  CartState copyWith({
    List<CartItem>? items,
    String? appliedCoupon,
    double? discountRate,
    double? shippingCost,
  }) {
    return CartState(
      items: items ?? this.items,
      appliedCoupon: appliedCoupon ?? this.appliedCoupon,
      discountRate: discountRate ?? this.discountRate,
      shippingCost: shippingCost ?? this.shippingCost,
    );
  }
}
