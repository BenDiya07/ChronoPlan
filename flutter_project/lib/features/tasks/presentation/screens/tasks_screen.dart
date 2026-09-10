import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../shared/widgets/network_error_view.dart';
import '../../shared/widgets/offline_banner.dart';
import '../../domain/entities/task_entity.dart';
import '../providers/tasks_provider.dart';

class TasksScreen extends ConsumerStatefulWidget {
  const TasksScreen({super.key});

  @override
  ConsumerState<TasksScreen> createState() => _TasksScreenState();
}

class _TasksScreenState extends ConsumerState<TasksScreen> {
  String _selectedProject = 'Tous';
  String _searchQuery = '';
  final _newTaskController = TextEditingController();

  final List<String> _projects = ['Tous', 'Travail', 'Personnel', 'Études', 'Santé', 'Finance'];

  @override
  void dispose() {
    _newTaskController.dispose();
    super.dispose();
  }

  Color _getPriorityColor(TaskPriority priority) {
    switch (priority) {
      case TaskPriority.p1High:
        return Colors.redAccent;
      case TaskPriority.p2Medium:
        return Colors.orangeAccent;
      case TaskPriority.p3Low:
        return Colors.blueAccent;
      case TaskPriority.p4None:
        return Colors.grey;
    }
  }

  String _getPriorityLabel(TaskPriority priority) {
    switch (priority) {
      case TaskPriority.p1High:
        return 'P1 Urgent';
      case TaskPriority.p2Medium:
        return 'P2 Élevée';
      case TaskPriority.p3Low:
        return 'P3 Moyenne';
      case TaskPriority.p4None:
        return 'P4 Basse';
    }
  }

  void _showAddTaskDialog(BuildContext context) {
    TaskPriority selectedPriority = TaskPriority.p2Medium;
    String selectedProj = 'Travail';
    int minutes = 25;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setSheetState) => Padding(
          padding: EdgeInsets.only(
            left: 20,
            right: 20,
            top: 20,
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 20,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text(
                'Ajouter une tâche (API /todos/add)',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _newTaskController,
                autofocus: true,
                decoration: const InputDecoration(
                  hintText: 'Ex: Préparer la réunion sprint...',
                  border: OutlineInputBorder(),
                  contentPadding: EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                ),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: DropdownButtonFormField<TaskPriority>(
                      value: selectedPriority,
                      decoration: const InputDecoration(
                        labelText: 'Priorité',
                        contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                        border: OutlineInputBorder(),
                      ),
                      items: TaskPriority.values.map((p) {
                        return DropdownMenuItem(
                          value: p,
                          child: Text(_getPriorityLabel(p), style: const TextStyle(fontSize: 12)),
                        );
                      }).toList(),
                      onChanged: (val) {
                        if (val != null) setSheetState(() => selectedPriority = val);
                      },
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: DropdownButtonFormField<String>(
                      value: selectedProj,
                      decoration: const InputDecoration(
                        labelText: 'Projet',
                        contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                        border: OutlineInputBorder(),
                      ),
                      items: _projects.where((p) => p != 'Tous').map((p) {
                        return DropdownMenuItem(value: p, child: Text(p, style: const TextStyle(fontSize: 12)));
                      }).toList(),
                      onChanged: (val) {
                        if (val != null) setSheetState(() => selectedProj = val);
                      },
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () {
                  final text = _newTaskController.text.trim();
                  if (text.isNotEmpty) {
                    ref.read(tasksPlanningProvider.notifier).createTask(
                          text,
                          priority: selectedPriority,
                          project: selectedProj,
                          minutes: minutes,
                        );
                    _newTaskController.clear();
                    Navigator.pop(ctx);
                  }
                },
                child: const Text('Enregistrer la tâche'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final planningState = ref.watch(tasksPlanningProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('ChronoPlan — Planning & Tâches'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            tooltip: 'Recharger les données REST API',
            onPressed: () => ref.read(tasksPlanningProvider.notifier).refresh(),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showAddTaskDialog(context),
        tooltip: 'Ajouter une tâche',
        child: const Icon(Icons.add),
      ),
      body: Column(
        children: [
          // Offline Banner
          if (planningState.isOffline)
            OfflineBanner(
              lastCacheTime: planningState.lastSyncTime,
              onRetry: () => ref.read(tasksPlanningProvider.notifier).refresh(),
            ),

          // Search Bar
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
            child: TextField(
              decoration: InputDecoration(
                hintText: 'Rechercher une tâche...',
                prefixIcon: const Icon(Icons.search, size: 20),
                contentPadding: const EdgeInsets.symmetric(vertical: 0, horizontal: 16),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              ),
              onChanged: (val) => setState(() => _searchQuery = val.trim().toLowerCase()),
            ),
          ),

          // Project Filter Chips
          SizedBox(
            height: 44,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: _projects.length,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (context, idx) {
                final proj = _projects[idx];
                final isSelected = _selectedProject == proj;
                return ChoiceChip(
                  label: Text(proj),
                  selected: isSelected,
                  onSelected: (selected) {
                    if (selected) setState(() => _selectedProject = proj);
                  },
                );
              },
            ),
          ),
          const SizedBox(height: 6),

          // Tasks List
          Expanded(
            child: planningState.tasks.when(
              data: (tasks) {
                var filtered = tasks;
                if (_selectedProject != 'Tous') {
                  filtered = filtered.where((t) => t.project == _selectedProject).toList();
                }
                if (_searchQuery.isNotEmpty) {
                  filtered = filtered.where((t) => t.title.toLowerCase().contains(_searchQuery)).toList();
                }

                if (filtered.isEmpty) {
                  return const Center(
                    child: Text('Aucune tâche pour ce filtre.'),
                  );
                }

                return RefreshIndicator(
                  onRefresh: () => ref.read(tasksPlanningProvider.notifier).refresh(),
                  child: ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    itemCount: filtered.length,
                    itemBuilder: (context, index) {
                      final task = filtered[index];
                      final pColor = _getPriorityColor(task.priority);

                      return Card(
                        margin: const EdgeInsets.only(bottom: 8),
                        elevation: 1,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        child: InkWell(
                          borderRadius: BorderRadius.circular(12),
                          onTap: () => context.push('/task/${task.id}'),
                          child: Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                            child: Row(
                              children: [
                                // Checkbox
                                Checkbox(
                                  value: task.completed,
                                  shape: const CircleBorder(),
                                  activeColor: Colors.emerald,
                                  onChanged: (_) {
                                    ref.read(tasksPlanningProvider.notifier).toggleTask(task.id, task.completed);
                                  },
                                ),
                                const SizedBox(width: 8),

                                // Title & details
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        task.title,
                                        style: TextStyle(
                                          fontWeight: FontWeight.w600,
                                          fontSize: 14,
                                          decoration: task.completed ? TextDecoration.lineThrough : null,
                                          color: task.completed ? Colors.grey : null,
                                        ),
                                      ),
                                      const SizedBox(height: 4),
                                      Row(
                                        children: [
                                          Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                            decoration: BoxDecoration(
                                              color: pColor.withOpacity(0.15),
                                              borderRadius: BorderRadius.circular(4),
                                            ),
                                            child: Text(
                                              _getPriorityLabel(task.priority),
                                              style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: pColor),
                                            ),
                                          ),
                                          const SizedBox(width: 8),
                                          Text(
                                            '#${task.project}',
                                            style: TextStyle(fontSize: 11, color: Colors.grey.shade600),
                                          ),
                                          const SizedBox(width: 8),
                                          Icon(Icons.timer_outlined, size: 13, color: Colors.grey.shade600),
                                          const SizedBox(width: 3),
                                          Text(
                                            '${task.estimatedMinutes}m',
                                            style: TextStyle(fontSize: 11, color: Colors.grey.shade600),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),

                                const Icon(Icons.chevron_right, size: 20, color: Colors.grey),
                              ],
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                );
              },
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (err, _) => NetworkErrorView(
                message: err.toString(),
                onRetry: () => ref.read(tasksPlanningProvider.notifier).refresh(),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
