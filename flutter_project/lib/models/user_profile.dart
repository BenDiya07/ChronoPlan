class OrderItem {
  final String title;
  final int quantity;
  final double price;
  final String imageUrl;

  const OrderItem({
    required this.title,
    required this.quantity,
    required this.price,
    required this.imageUrl,
  });
}

class Order {
  final String id;
  final String date;
  final String status; // 'Delivered', 'In Transit', 'Processing'
  final double total;
  final int itemsCount;
  final List<OrderItem> items;

  const Order({
    required this.id,
    required this.date,
    required this.status,
    required this.total,
    required this.itemsCount,
    required this.items,
  });
}

class UserAddress {
  final String label;
  final String street;
  final String city;
  final bool isDefault;

  const UserAddress({
    required this.label,
    required this.street,
    required this.city,
    required this.isDefault,
  });
}

class UserProfile {
  final String id;
  final String name;
  final String email;
  final String phone;
  final String avatarUrl;
  final String memberTier;
  final int rewardPoints;
  final List<UserAddress> addresses;
  final List<Order> orders;

  const UserProfile({
    required this.id,
    required this.name,
    required this.email,
    required this.phone,
    required this.avatarUrl,
    required this.memberTier,
    required this.rewardPoints,
    required this.addresses,
    required this.orders,
  });

  UserProfile copyWith({
    String? name,
    String? email,
    String? phone,
    String? avatarUrl,
    String? memberTier,
    int? rewardPoints,
    List<UserAddress>? addresses,
    List<Order>? orders,
  }) {
    return UserProfile(
      id: id,
      name: name ?? this.name,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      avatarUrl: avatarUrl ?? this.avatarUrl,
      memberTier: memberTier ?? this.memberTier,
      rewardPoints: rewardPoints ?? this.rewardPoints,
      addresses: addresses ?? this.addresses,
      orders: orders ?? this.orders,
    );
  }
}
