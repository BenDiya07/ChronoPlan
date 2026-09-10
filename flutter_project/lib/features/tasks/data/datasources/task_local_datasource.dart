import '../../../../core/cache/hive_service.dart';
import '../models/task_model.dart';

abstract class TaskLocalDataSource {
  Future<void> cacheTasks(List<TaskModel> tasks);
  Future<List<TaskModel>> getCachedTasks();
  Future<TaskModel?> getCachedTaskById(int id);
  Future<void> updateCachedTaskStatus(int id, bool completed);
  Future<void> saveLocalTask(TaskModel task);
  Future<void> deleteCachedTask(int id);
  String? getLastSyncTime();
}

class TaskLocalDataSourceImpl implements TaskLocalDataSource {
  final HiveService hiveService;

  TaskLocalDataSourceImpl({required this.hiveService});

  @override
  Future<void> cacheTasks(List<TaskModel> tasks) async {
    final list = tasks.map((t) => t.toJson()).toList();
    await hiveService.cacheTasks(list);
  }

  @override
  Future<List<TaskModel>> getCachedTasks() async {
    final cached = hiveService.getCachedTasks();
    if (cached.isEmpty) return [];
    return cached.map((map) => TaskModel.fromJson(map)).toList();
  }

  @override
  Future<TaskModel?> getCachedTaskById(int id) async {
    final list = await getCachedTasks();
    try {
      return list.firstWhere((t) => t.id == id);
    } catch (_) {
      return null;
    }
  }

  @override
  Future<void> updateCachedTaskStatus(int id, bool completed) async {
    await hiveService.updateCachedTask(id, completed);
  }

  @override
  Future<void> saveLocalTask(TaskModel task) async {
    final list = await getCachedTasks();
    final updated = [task, ...list.where((t) => t.id != task.id)];
    await cacheTasks(updated);
  }

  @override
  Future<void> deleteCachedTask(int id) async {
    final list = await getCachedTasks();
    final updated = list.where((t) => t.id != id).toList();
    await cacheTasks(updated);
  }

  @override
  String? getLastSyncTime() => hiveService.getLastSyncTime();
}
