import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/providers.dart';
import '../../../auth/presentation/providers/auth_provider.dart';
import '../../data/datasources/task_local_datasource.dart';
import '../../data/datasources/task_remote_datasource.dart';
import '../../data/repositories/task_repository_impl.dart';
import '../../domain/entities/task_entity.dart';
import '../../domain/repositories/task_repository.dart';

final taskLocalDataSourceProvider = Provider<TaskLocalDataSource>((ref) {
  return TaskLocalDataSourceImpl(hiveService: ref.watch(hiveServiceProvider));
});

final taskRemoteDataSourceProvider = Provider<TaskRemoteDataSource>((ref) {
  return TaskRemoteDataSourceImpl(dio: ref.watch(dioClientProvider).dio);
});

final taskRepositoryProvider = Provider<TaskRepository>((ref) {
  return TaskRepositoryImpl(
    remoteDataSource: ref.watch(taskRemoteDataSourceProvider),
    localDataSource: ref.watch(taskLocalDataSourceProvider),
    networkInfo: ref.watch(networkInfoProvider),
  );
});

// Filters State
final selectedProjectFilterProvider = StateProvider<String>((ref) => 'Tous');
final searchQueryProvider = StateProvider<String>((ref) => '');

// State Model
class TasksPlanningState {
  final AsyncValue<List<TaskEntity>> tasks;
  final bool isOffline;
  final String? lastSyncTime;

  const TasksPlanningState({
    required this.tasks,
    this.isOffline = false,
    this.lastSyncTime,
  });

  TasksPlanningState copyWith({
    AsyncValue<List<TaskEntity>>? tasks,
    bool? isOffline,
    String? lastSyncTime,
  }) {
    return TasksPlanningState(
      tasks: tasks ?? this.tasks,
      isOffline: isOffline ?? this.isOffline,
      lastSyncTime: lastSyncTime ?? this.lastSyncTime,
    );
  }

  int get completedCount =>
      tasks.valueOrNull?.where((t) => t.completed).length ?? 0;
  int get totalCount => tasks.valueOrNull?.length ?? 0;
  double get completionRate => totalCount == 0 ? 0.0 : completedCount / totalCount;
}

class TasksPlanningNotifier extends StateNotifier<TasksPlanningState> {
  final TaskRepository _repository;
  final TaskLocalDataSource _localDataSource;

  TasksPlanningNotifier({
    required TaskRepository repository,
    required TaskLocalDataSource localDataSource,
  })  : _repository = repository,
        _localDataSource = localDataSource,
        super(const TasksPlanningState(tasks: AsyncValue.loading())) {
    loadTasks();
  }

  Future<void> loadTasks() async {
    state = state.copyWith(tasks: const AsyncValue.loading());
    try {
      final list = await _repository.getTasks();
      final isOffline = await _repository.isOfflineModeActive();
      final syncTime = _localDataSource.getLastSyncTime();

      state = state.copyWith(
        tasks: AsyncValue.data(list),
        isOffline: isOffline,
        lastSyncTime: syncTime,
      );
    } catch (e, st) {
      final isOffline = await _repository.isOfflineModeActive();
      state = state.copyWith(
        tasks: AsyncValue.error(e, st),
        isOffline: isOffline,
      );
    }
  }

  Future<void> toggleTask(int id, bool currentStatus) async {
    // Optimistic UI update
    final currentTasks = state.tasks.valueOrNull;
    if (currentTasks != null) {
      final updated = currentTasks.map((t) {
        if (t.id == id) {
          return t.copyWith(completed: !currentStatus);
        }
        return t;
      }).toList();
      state = state.copyWith(tasks: AsyncValue.data(updated));
    }

    try {
      await _repository.toggleTaskCompletion(id, !currentStatus);
    } catch (_) {
      // Revert if error
    }
  }

  Future<void> createTask(
    String title, {
    TaskPriority priority = TaskPriority.p2Medium,
    String project = 'Inbox',
    int minutes = 25,
  }) async {
    try {
      final created = await _repository.createTask(
        title,
        priority: priority,
        project: project,
        estimatedMinutes: minutes,
      );
      final currentList = state.tasks.valueOrNull ?? [];
      state = state.copyWith(
        tasks: AsyncValue.data([created, ...currentList]),
      );
    } catch (e, st) {
      state = state.copyWith(tasks: AsyncValue.error(e, st));
    }
  }

  Future<void> deleteTask(int id) async {
    final currentTasks = state.tasks.valueOrNull;
    if (currentTasks != null) {
      final updated = currentTasks.where((t) => t.id != id).toList();
      state = state.copyWith(tasks: AsyncValue.data(updated));
    }
    await _repository.deleteTask(id);
  }

  Future<void> refresh() async {
    await loadTasks();
  }
}

final tasksPlanningProvider = StateNotifierProvider<TasksPlanningNotifier, TasksPlanningState>((ref) {
  return TasksPlanningNotifier(
    repository: ref.watch(taskRepositoryProvider),
    localDataSource: ref.watch(taskLocalDataSourceProvider),
  );
});

// Single Task Details FutureProvider (family)
final taskDetailsProvider = FutureProvider.family<TaskEntity, int>((ref, id) async {
  final repository = ref.watch(taskRepositoryProvider);
  return repository.getTaskById(id);
});
