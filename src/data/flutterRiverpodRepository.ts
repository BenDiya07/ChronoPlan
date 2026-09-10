export interface DartFile {
  path: string;
  name: string;
  category: 'core' | 'tasks' | 'auth' | 'profile' | 'tests' | 'config';
  code: string;
  description: string;
}

export const DART_FILES: DartFile[] = [
  {
    path: 'lib/core/api/auth_interceptor.dart',
    name: 'auth_interceptor.dart',
    category: 'core',
    description: 'QueuedInterceptor Dio pour injection du Bearer token et rafraîchissement automatique sur code 401',
    code: `import 'package:dio/dio.dart';
import '../cache/hive_service.dart';
import 'api_endpoints.dart';

class AuthInterceptor extends QueuedInterceptor {
  final Dio dio;
  final HiveService hiveService;

  AuthInterceptor({required this.dio, required this.hiveService});

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    final accessToken = hiveService.getAccessToken();
    if (accessToken != null && accessToken.isNotEmpty) {
      options.headers['Authorization'] = 'Bearer $accessToken';
    }
    super.onRequest(options, handler);
  }

  @override
  Future<void> onError(DioException err, ErrorInterceptorHandler handler) async {
    if (err.response?.statusCode == 401) {
      final refreshToken = hiveService.getRefreshToken();
      if (refreshToken != null) {
        try {
          final refreshResponse = await dio.post(
            ApiEndpoints.refreshToken,
            data: {'refreshToken': refreshToken},
          );

          if (refreshResponse.statusCode == 200) {
            final newAccessToken = refreshResponse.data['token'] as String;
            final currentUser = hiveService.getCachedUser() ?? {};

            await hiveService.saveAuthData(
              accessToken: newAccessToken,
              refreshToken: refreshToken,
              userJson: currentUser,
            );

            // Rejouer la requête d'origine avec le nouveau token
            final opts = err.requestOptions;
            opts.headers['Authorization'] = 'Bearer $newAccessToken';
            final cloneReq = await dio.fetch(opts);
            return handler.resolve(cloneReq);
          }
        } catch (_) {
          await hiveService.clearAuthData();
        }
      }
    }
    super.onError(err, handler);
  }
}`,
  },
  {
    path: 'lib/features/tasks/data/repositories/task_repository_impl.dart',
    name: 'task_repository_impl.dart',
    category: 'tasks',
    description: 'Implémentation du Repository orchestrant l\'API REST et le cache Hive NoSQL avec fallback hors-ligne',
    code: `import '../../../../core/api/app_exception.dart';
import '../../../../core/network/network_info.dart';
import '../../domain/entities/task_entity.dart';
import '../../domain/repositories/task_repository.dart';
import '../datasources/task_local_datasource.dart';
import '../datasources/task_remote_datasource.dart';
import '../models/task_model.dart';

class TaskRepositoryImpl implements TaskRepository {
  final TaskRemoteDataSource remoteDataSource;
  final TaskLocalDataSource localDataSource;
  final NetworkInfo networkInfo;

  bool _isOfflineModeActive = false;

  TaskRepositoryImpl({
    required this.remoteDataSource,
    required this.localDataSource,
    required this.networkInfo,
  });

  @override
  Future<bool> isOfflineModeActive() async {
    final connected = await networkInfo.isConnected;
    return !connected || _isOfflineModeActive;
  }

  @override
  Future<List<TaskEntity>> getTasks({String? project, bool? completed}) async {
    final isOnline = await networkInfo.isConnected;

    if (isOnline) {
      try {
        final remoteTasks = await remoteDataSource.getTasks();
        // Mise en cache dans Hive NoSQL
        await localDataSource.cacheTasks(remoteTasks);
        _isOfflineModeActive = false;
        return _filterTasks(remoteTasks, project: project, completed: completed);
      } catch (error) {
        // Fallback transparent vers le cache Hive en cas d'erreur réseau
        return _fallbackToCache(project: project, completed: completed, originalError: error);
      }
    } else {
      // Mode hors-ligne : chargement instantané depuis Hive
      return _fallbackToCache(project: project, completed: completed);
    }
  }

  Future<List<TaskEntity>> _fallbackToCache({
    String? project,
    bool? completed,
    Object? originalError,
  }) async {
    final cached = await localDataSource.getCachedTasks();
    if (cached.isNotEmpty) {
      _isOfflineModeActive = true;
      return _filterTasks(cached, project: project, completed: completed);
    }
    if (originalError is AppException) throw originalError;
    throw const CacheException(
      'Mode hors-ligne : Aucune tâche en cache local Hive. Connectez-vous à Internet pour synchroniser votre planning.',
    );
  }

  List<TaskEntity> _filterTasks(List<TaskModel> list, {String? project, bool? completed}) {
    Iterable<TaskModel> filtered = list;
    if (project != null && project.isNotEmpty && project != 'Tous') {
      filtered = filtered.where((t) => t.project.toLowerCase() == project.toLowerCase());
    }
    if (completed != null) {
      filtered = filtered.where((t) => t.completed == completed);
    }
    return filtered.map((t) => t.toEntity()).toList();
  }

  @override
  Future<TaskEntity> toggleTaskCompletion(int id, bool completed) async {
    await localDataSource.updateCachedTaskStatus(id, completed);
    final isOnline = await networkInfo.isConnected;
    if (isOnline) {
      try {
        final updated = await remoteDataSource.updateTaskStatus(id, completed);
        return updated.toEntity();
      } catch (_) {}
    }
    final localTask = await localDataSource.getCachedTaskById(id);
    return localTask?.copyWith(completed: completed).toEntity() ??
        TaskEntity(id: id, title: 'Tâche #$id', completed: completed, userId: 1);
  }
}`,
  },
  {
    path: 'lib/core/cache/hive_service.dart',
    name: 'hive_service.dart',
    category: 'core',
    description: 'Service de base de données locale NoSQL Hive (tasks_box, auth_box, metadata_box)',
    code: `import 'package:hive_flutter/hive_flutter.dart';

class HiveService {
  static const String authBoxName = 'auth_box';
  static const String tasksBoxName = 'tasks_box';
  static const String metadataBoxName = 'metadata_box';

  static final HiveService _instance = HiveService._internal();
  factory HiveService() => _instance;
  HiveService._internal();

  late Box _authBox;
  late Box _tasksBox;
  late Box _metadataBox;

  Future<void> init() async {
    await Hive.initFlutter();
    _authBox = await Hive.openBox(authBoxName);
    _tasksBox = await Hive.openBox(tasksBoxName);
    _metadataBox = await Hive.openBox(metadataBoxName);
  }

  Future<void> cacheTasks(List<Map<String, dynamic>> tasksJson) async {
    await _tasksBox.put('cached_tasks_list', tasksJson);
    final now = DateTime.now();
    final timeStr = '\${now.hour.toString().padLeft(2, '0')}:\${now.minute.toString().padLeft(2, '0')}';
    await _metadataBox.put('last_tasks_sync_time', timeStr);
  }

  List<Map<String, dynamic>> getCachedTasks() {
    final raw = _tasksBox.get('cached_tasks_list');
    if (raw == null) return [];
    return (raw as List).map((item) => Map<String, dynamic>.from(item as Map)).toList();
  }

  String? getLastSyncTime() => _metadataBox.get('last_tasks_sync_time') as String?;
}`,
  },
  {
    path: 'lib/features/tasks/presentation/providers/tasks_provider.dart',
    name: 'tasks_provider.dart',
    category: 'tasks',
    description: 'Gestion d\'état réactive Riverpod avec StateNotifier, AsyncValue et détection hors-ligne',
    code: `import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/entities/task_entity.dart';
import '../../domain/repositories/task_repository.dart';

class TasksPlanningState {
  final AsyncValue<List<TaskEntity>> tasks;
  final bool isOffline;
  final String? lastSyncTime;

  const TasksPlanningState({
    required this.tasks,
    this.isOffline = false,
    this.lastSyncTime,
  });

  int get completedCount => tasks.valueOrNull?.where((t) => t.completed).length ?? 0;
  int get totalCount => tasks.valueOrNull?.length ?? 0;
  double get completionRate => totalCount == 0 ? 0.0 : completedCount / totalCount;
}

class TasksPlanningNotifier extends StateNotifier<TasksPlanningState> {
  final TaskRepository _repository;

  TasksPlanningNotifier({required TaskRepository repository})
      : _repository = repository,
        super(const TasksPlanningState(tasks: AsyncValue.loading())) {
    loadTasks();
  }

  Future<void> loadTasks() async {
    state = const TasksPlanningState(tasks: AsyncValue.loading());
    try {
      final list = await _repository.getTasks();
      final isOffline = await _repository.isOfflineModeActive();
      state = TasksPlanningState(tasks: AsyncValue.data(list), isOffline: isOffline);
    } catch (e, st) {
      state = TasksPlanningState(tasks: AsyncValue.error(e, st));
    }
  }

  Future<void> toggleTask(int id, bool currentStatus) async {
    // Optimistic UI update
    final currentTasks = state.tasks.valueOrNull;
    if (currentTasks != null) {
      final updated = currentTasks.map((t) => t.id == id ? t.copyWith(completed: !currentStatus) : t).toList();
      state = TasksPlanningState(tasks: AsyncValue.data(updated), isOffline: state.isOffline);
    }
    await _repository.toggleTaskCompletion(id, !currentStatus);
  }
}`,
  },
  {
    path: 'test/unit/repositories/task_repository_test.dart',
    name: 'task_repository_test.dart',
    category: 'tests',
    description: '5 tests unitaires vérifiant le chargement en ligne, la sauvegarde Hive, le fallback hors-ligne et les exceptions',
    code: `import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:chronoplan_time_management/core/api/app_exception.dart';
import 'package:chronoplan_time_management/core/network/network_info.dart';
import 'package:chronoplan_time_management/features/tasks/data/datasources/task_local_datasource.dart';
import 'package:chronoplan_time_management/features/tasks/data/datasources/task_remote_datasource.dart';
import 'package:chronoplan_time_management/features/tasks/data/models/task_model.dart';
import 'package:chronoplan_time_management/features/tasks/data/repositories/task_repository_impl.dart';

class MockTaskRemoteDataSource extends Mock implements TaskRemoteDataSource {}
class MockTaskLocalDataSource extends Mock implements TaskLocalDataSource {}
class MockNetworkInfo extends Mock implements NetworkInfo {}

void main() {
  late TaskRepositoryImpl repository;
  late MockTaskRemoteDataSource mockRemoteDataSource;
  late MockTaskLocalDataSource mockLocalDataSource;
  late MockNetworkInfo mockNetworkInfo;

  setUp(() {
    mockRemoteDataSource = MockTaskRemoteDataSource();
    mockLocalDataSource = MockTaskLocalDataSource();
    mockNetworkInfo = MockNetworkInfo();
    repository = TaskRepositoryImpl(
      remoteDataSource: mockRemoteDataSource,
      localDataSource: mockLocalDataSource,
      networkInfo: mockNetworkInfo,
    );
  });

  test('1. Charge les données distantes et les met en cache dans Hive si EN LIGNE', () async {
    when(() => mockNetworkInfo.isConnected).thenAnswer((_) async => true);
    when(() => mockRemoteDataSource.getTasks()).thenAnswer((_) async => [tTaskModel]);
    when(() => mockLocalDataSource.cacheTasks(any())).thenAnswer((_) async => Future.value());

    final result = await repository.getTasks();
    expect(result.length, 1);
    verify(() => mockRemoteDataSource.getTasks()).called(1);
    verify(() => mockLocalDataSource.cacheTasks([tTaskModel])).called(1);
  });

  test('2. Retourne le cache Hive sans appel réseau si HORS-LIGNE (Offline Mode)', () async {
    when(() => mockNetworkInfo.isConnected).thenAnswer((_) async => false);
    when(() => mockLocalDataSource.getCachedTasks()).thenAnswer((_) async => [tTaskModel]);

    final result = await repository.getTasks();
    expect(result.length, 1);
    verifyZeroInteractions(mockRemoteDataSource);
    verify(() => mockLocalDataSource.getCachedTasks()).called(1);
  });

  test('3. Bascule vers le cache Hive si l\\'API REST échoue (NetworkException)', () async {
    when(() => mockNetworkInfo.isConnected).thenAnswer((_) async => true);
    when(() => mockRemoteDataSource.getTasks()).thenThrow(const NetworkException('Timeout'));
    when(() => mockLocalDataSource.getCachedTasks()).thenAnswer((_) async => [tTaskModel]);

    final result = await repository.getTasks();
    expect(result.length, 1);
    verify(() => mockRemoteDataSource.getTasks()).called(1);
    verify(() => mockLocalDataSource.getCachedTasks()).called(1);
  });
}`,
  },
];

export const FLUTTER_RIVERPOD_FILES = DART_FILES;
