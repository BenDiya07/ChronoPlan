import '../../../../core/api/app_exception.dart';
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

        // Write to Hive local database for offline availability
        await localDataSource.cacheTasks(remoteTasks);
        _isOfflineModeActive = false;

        return _filterTasks(remoteTasks, project: project, completed: completed);
      } catch (error) {
        // Fallback to local Hive cache on network failure (timeout/server error)
        return _fallbackToCache(project: project, completed: completed, originalError: error);
      }
    } else {
      // Offline mode: load directly from Hive
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

    if (originalError is AppException) {
      throw originalError;
    }
    throw const CacheException(
      'Mode hors-ligne : Aucune tâche en cache local Hive. Veuillez vous connecter à Internet pour synchroniser votre planning.',
    );
  }

  List<TaskEntity> _filterTasks(
    List<TaskModel> list, {
    String? project,
    bool? completed,
  }) {
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
  Future<TaskEntity> getTaskById(int id) async {
    final isOnline = await networkInfo.isConnected;

    if (isOnline) {
      try {
        final task = await remoteDataSource.getTaskById(id);
        return task.toEntity();
      } catch (_) {
        final cached = await localDataSource.getCachedTaskById(id);
        if (cached != null) {
          _isOfflineModeActive = true;
          return cached.toEntity();
        }
        rethrow;
      }
    } else {
      final cached = await localDataSource.getCachedTaskById(id);
      if (cached != null) {
        _isOfflineModeActive = true;
        return cached.toEntity();
      }
      throw const NetworkException('Tâche non disponible dans le cache hors-ligne.');
    }
  }

  @override
  Future<TaskEntity> toggleTaskCompletion(int id, bool completed) async {
    // 1. Immediately update Hive cache so UI responds instantly
    await localDataSource.updateCachedTaskStatus(id, completed);

    final isOnline = await networkInfo.isConnected;
    if (isOnline) {
      try {
        final updated = await remoteDataSource.updateTaskStatus(id, completed);
        return updated.toEntity();
      } catch (_) {
        // Kept in local cache with isSyncPending
      }
    }

    final localTask = await localDataSource.getCachedTaskById(id);
    if (localTask != null) {
      return localTask.copyWith(completed: completed, isSyncPending: !isOnline).toEntity();
    }

    return TaskEntity(id: id, title: 'Tâche #$id', completed: completed, userId: 1);
  }

  @override
  Future<TaskEntity> createTask(
    String title, {
    TaskPriority priority = TaskPriority.p2Medium,
    String project = 'Inbox',
    int estimatedMinutes = 25,
  }) async {
    final isOnline = await networkInfo.isConnected;

    if (isOnline) {
      try {
        final created = await remoteDataSource.createTask(
          title,
          project: project,
          estimatedMinutes: estimatedMinutes,
        );
        final enriched = TaskModel(
          id: created.id,
          title: created.title,
          completed: false,
          userId: created.userId,
          priority: priority,
          project: project,
          estimatedMinutes: estimatedMinutes,
          dueDate: 'Aujourd\'hui',
        );
        await localDataSource.saveLocalTask(enriched);
        return enriched.toEntity();
      } catch (_) {}
    }

    // Offline task creation with temporary local ID
    final tempId = DateTime.now().millisecondsSinceEpoch % 100000;
    final localModel = TaskModel(
      id: tempId,
      title: title,
      completed: false,
      userId: 1,
      priority: priority,
      project: project,
      estimatedMinutes: estimatedMinutes,
      dueDate: 'Aujourd\'hui',
      isSyncPending: true,
    );
    await localDataSource.saveLocalTask(localModel);
    return localModel.toEntity();
  }

  @override
  Future<void> deleteTask(int id) async {
    await localDataSource.deleteCachedTask(id);
    final isOnline = await networkInfo.isConnected;
    if (isOnline) {
      try {
        await remoteDataSource.deleteTask(id);
      } catch (_) {}
    }
  }
}
