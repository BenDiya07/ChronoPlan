import 'package:hive_flutter/hive_flutter.dart';

class HiveService {
  static const String authBoxName = 'auth_box';
  static const String tasksBoxName = 'tasks_box';
  static const String productsBoxName = 'products_box';
  static const String metadataBoxName = 'metadata_box';

  static final HiveService _instance = HiveService._internal();
  factory HiveService() => _instance;
  HiveService._internal();

  late Box _authBox;
  late Box _tasksBox;
  late Box _productsBox;
  late Box _metadataBox;

  Future<void> init() async {
    await Hive.initFlutter();
    _authBox = await Hive.openBox(authBoxName);
    _tasksBox = await Hive.openBox(tasksBoxName);
    _productsBox = await Hive.openBox(productsBoxName);
    _metadataBox = await Hive.openBox(metadataBoxName);
  }

  // --- Auth Session Cache ---
  Future<void> saveAuthData({
    required String accessToken,
    required String refreshToken,
    required Map<String, dynamic> userJson,
  }) async {
    await _authBox.put('access_token', accessToken);
    await _authBox.put('refresh_token', refreshToken);
    await _authBox.put('cached_user', userJson);
  }

  String? getAccessToken() => _authBox.get('access_token') as String?;
  String? getRefreshToken() => _authBox.get('refresh_token') as String?;

  Map<String, dynamic>? getCachedUser() {
    final raw = _authBox.get('cached_user');
    if (raw == null) return null;
    return Map<String, dynamic>.from(raw as Map);
  }

  Future<void> clearAuthData() async {
    await _authBox.clear();
  }

  // --- Tasks Planning Cache (Hive NoSQL) ---
  Future<void> cacheTasks(List<Map<String, dynamic>> tasksJson) async {
    await _tasksBox.put('cached_tasks_list', tasksJson);
    final now = DateTime.now();
    final timeStr = '${now.hour.toString().padLeft(2, '0')}:${now.minute.toString().padLeft(2, '0')}';
    await _metadataBox.put('last_tasks_sync_time', timeStr);
  }

  List<Map<String, dynamic>> getCachedTasks() {
    final raw = _tasksBox.get('cached_tasks_list');
    if (raw == null) return [];
    return (raw as List).map((item) => Map<String, dynamic>.from(item as Map)).toList();
  }

  Future<void> updateCachedTask(int taskId, bool completed) async {
    final list = getCachedTasks();
    final updated = list.map((item) {
      if (item['id'] == taskId) {
        return {...item, 'completed': completed};
      }
      return item;
    }).toList();
    await cacheTasks(updated);
  }

  String? getLastSyncTime() => _metadataBox.get('last_tasks_sync_time') as String?;

  Future<void> clearAllTasks() async {
    await _tasksBox.clear();
  }

  // --- Products Cache (Hive NoSQL) ---
  Future<void> cacheProducts(List<Map<String, dynamic>> productsJson) async {
    await _productsBox.put('cached_products_list', productsJson);
    final now = DateTime.now();
    final timeStr = '${now.hour.toString().padLeft(2, '0')}:${now.minute.toString().padLeft(2, '0')}';
    await _metadataBox.put('last_products_cache_time', timeStr);
  }

  List<Map<String, dynamic>> getCachedProducts() {
    final raw = _productsBox.get('cached_products_list');
    if (raw == null) return [];
    return (raw as List).map((item) => Map<String, dynamic>.from(item as Map)).toList();
  }

  Future<void> clearProductCache() async {
    await _productsBox.delete('cached_products_list');
  }

  String? getLastCacheTime() => _metadataBox.get('last_products_cache_time') as String?;
}
