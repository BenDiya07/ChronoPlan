enum TaskPriority { p1High, p2Medium, p3Low, p4None }

class TaskEntity {
  final int id;
  final String title;
  final bool completed;
  final int userId;
  final TaskPriority priority;
  final String project;
  final int estimatedMinutes;
  final String? dueDate;
  final String? notes;
  final bool isSyncPending;

  const TaskEntity({
    required this.id,
    required this.title,
    required this.completed,
    required this.userId,
    this.priority = TaskPriority.p2Medium,
    this.project = 'Inbox',
    this.estimatedMinutes = 25,
    this.dueDate = 'Aujourd\'hui',
    this.notes,
    this.isSyncPending = false,
  });

  TaskEntity copyWith({
    int? id,
    String? title,
    bool? completed,
    int? userId,
    TaskPriority? priority,
    String? project,
    int? estimatedMinutes,
    String? dueDate,
    String? notes,
    bool? isSyncPending,
  }) {
    return TaskEntity(
      id: id ?? this.id,
      title: title ?? this.title,
      completed: completed ?? this.completed,
      userId: userId ?? this.userId,
      priority: priority ?? this.priority,
      project: project ?? this.project,
      estimatedMinutes: estimatedMinutes ?? this.estimatedMinutes,
      dueDate: dueDate ?? this.dueDate,
      notes: notes ?? this.notes,
      isSyncPending: isSyncPending ?? this.isSyncPending,
    );
  }
}
