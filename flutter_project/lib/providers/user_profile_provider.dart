import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/user_profile.dart';
import '../models/cart_item.dart';

class UserProfileNotifier extends StateNotifier<UserProfile> {
  UserProfileNotifier()
      : super(
          const UserProfile(
            id: 'usr-902',
            name: 'Bénit Diyavanga',
            email: 'benitdiyavanga@gmail.com',
            phone: '+33 6 12 34 56 78',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
            memberTier: 'Gold Member',
            rewardPoints: 1250,
            addresses: [
              UserAddress(
                label: 'Domicile (Principal)',
                street: '142 Avenue des Champs-Élysées',
                city: '75008 Paris, France',
                isDefault: true,
              ),
              UserAddress(
                label: 'Bureau Tech Lab',
                street: '18 Rue de la Paix',
                city: '75002 Paris, France',
                isDefault: false,
              ),
            ],
            orders: [
              Order(
                id: 'CMD-84920',
                date: 'Hier à 14:32',
                status: 'In Transit',
                total: 349.99,
                itemsCount: 1,
                items: [
                  OrderItem(
                    title: 'Sony WH-1000XM5 Wireless ANC',
                    quantity: 1,
                    price: 349.99,
                    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
                  ),
                ],
              ),
              Order(
                id: 'CMD-79104',
                date: '18 Août 2026',
                status: 'Delivered',
                total: 239.00,
                itemsCount: 1,
                items: [
                  OrderItem(
                    title: 'Sac à Dos Bellroy Transit 28L',
                    quantity: 1,
                    price: 239.00,
                    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80',
                  ),
                ],
              ),
            ],
          ),
        );

  void addOrderFromCart(CartState cart) {
    if (cart.isEmpty) return;

    final newOrder = Order(
      id: 'CMD-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}',
      date: 'À l'instant',
      status: 'Processing',
      total: cart.total,
      itemsCount: cart.totalQuantity,
      items: cart.items
          .map(
            (i) => OrderItem(
              title: i.product.title,
              quantity: i.quantity,
              price: i.product.price,
              imageUrl: i.product.imageUrl,
            ),
          )
          .toList(),
    );

    state = state.copyWith(
      orders: [newOrder, ...state.orders],
      rewardPoints: state.rewardPoints + (cart.total * 2).round(),
    );
  }

  void updateName(String newName) {
    state = state.copyWith(name: newName);
  }
}

final userProfileProvider = StateNotifierProvider<UserProfileNotifier, UserProfile>((ref) {
  return UserProfileNotifier();
});
