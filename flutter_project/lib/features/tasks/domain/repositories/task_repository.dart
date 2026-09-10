import '../entities/task_entity.dart';

abstract class TaskRepository {
  Future<List<TaskEntity>> getTasks({String? project, bool? completed});
  Future<TaskEntity> getTaskById(int id);
  Future<TaskEntity> toggleTaskCompletion(int id, bool completed);
  Future<TaskEntity> createTask(String title, {TaskPriority priority, String project, int estimatedMinutes});
  Future<void> deleteTask(int id);
  Future<bool> isOfflineModeActive();
}
