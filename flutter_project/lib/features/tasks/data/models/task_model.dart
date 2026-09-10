import '../../domain/entities/task_entity.dart';

class TaskModel extends TaskEntity {
  const TaskModel({
    required super.id,
    required super.title,
    required super.completed,
    required super.userId,
    super.priority,
    super.project,
    super.estimatedMinutes,
    super.dueDate,
    super.notes,
    super.isSyncPending,
  });

  factory TaskModel.fromJson(Map<String, dynamic> json) {
    // Map priority
    TaskPriority priority = TaskPriority.p2Medium;
    final pStr = json['priority']?.toString();
    if (pStr == 'p1High' || json['id'] % 4 == 1) {
      priority = TaskPriority.p1High;
    } else if (pStr == 'p2Medium' || json['id'] % 4 == 2) {
      priority = TaskPriority.p2Medium;
    } else if (pStr == 'p3Low' || json['id'] % 4 == 3) {
      priority = TaskPriority.p3Low;
    } else if (pStr == 'p4None') {
      priority = TaskPriority.p4None;
    }

    // Map project
    final projects = ['Travail', 'Personnel', 'Études', 'Santé', 'Finance'];
    final project = json['project'] as String? ?? projects[json['id'] % projects.length];

    // Map estimated minutes
    final minutes = [15, 25, 30, 45, 60][json['id'] % 5];

    return TaskModel(
      id: json['id'] as int? ?? 1,
      title: json['todo'] as String? ?? json['title'] as String? ?? 'Nouvelle tâche',
      completed: json['completed'] as bool? ?? false,
      userId: json['userId'] as int? ?? 1,
      priority: priority,
      project: project,
      estimatedMinutes: json['estimatedMinutes'] as int? ?? minutes,
      dueDate: json['dueDate'] as String? ?? 'Aujourd\'hui',
      notes: json['notes'] as String? ?? 'Tâche synchronisée via l\'API REST DummyJSON /todos.',
      isSyncPending: json['isSyncPending'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'todo': title,
      'title': title,
      'completed': completed,
      'userId': userId,
      'priority': priority.name,
      'project': project,
      'estimatedMinutes': estimatedMinutes,
      'dueDate': dueDate,
      'notes': notes,
      'isSyncPending': isSyncPending,
    };
  }

  TaskEntity toEntity() => this;
}
