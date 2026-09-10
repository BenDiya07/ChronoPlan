import 'package:shared_preferences/shared_preferences.dart';

abstract class StorageRepository {
  Future<Set<String>> loadFavorites();
  Future<void> saveFavorites(Set<String> favoriteIds);
}

class SharedPreferencesStorageRepository implements StorageRepository {
  static const _favoritesKey = 'shopverse_favorite_ids';

  @override
  Future<Set<String>> loadFavorites() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final list = prefs.getStringList(_favoritesKey) ?? [];
      return list.toSet();
    } catch (_) {
      return {};
    }
  }

  @override
  Future<void> saveFavorites(Set<String> favoriteIds) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setStringList(_favoritesKey, favoriteIds.toList());
    } catch (_) {
      // Handle storage exception
    }
  }
}
