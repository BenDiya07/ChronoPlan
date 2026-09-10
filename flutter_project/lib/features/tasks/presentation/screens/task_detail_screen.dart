import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../shared/widgets/network_error_view.dart';
import '../providers/tasks_provider.dart';

class TaskDetailScreen extends ConsumerStatefulWidget {
  final int taskId;

  const TaskDetailScreen({super.key, required this.taskId});

  @override
  ConsumerState<TaskDetailScreen> createState() => _TaskDetailScreenState();
}

class _TaskDetailScreenState extends ConsumerState<TaskDetailScreen> {
  // Pomodoro Timer State
  int _secondsLeft = 25 * 60;
  bool _isRunning = false;
  Timer? _timer;

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _togglePomodoro() {
    if (_isRunning) {
      _timer?.cancel();
      setState(() => _isRunning = false);
    } else {
      _timer = Timer.periodic(const Duration(seconds: 1), (t) {
        if (_secondsLeft > 0) {
          setState(() => _secondsLeft--);
        } else {
          t.cancel();
          setState(() => _isRunning = false);
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Session Pomodoro terminée ! Prenez une pause de 5 minutes.'),
              backgroundColor: Colors.green,
            ),
          );
        }
      });
      setState(() => _isRunning = true);
    }
  }

  void _resetPomodoro() {
    _timer?.cancel();
    setState(() {
      _secondsLeft = 25 * 60;
      _isRunning = false;
    });
  }

  String _formatTime(int totalSeconds) {
    final minutes = (totalSeconds ~/ 60).toString().padLeft(2, '0');
    final seconds = (totalSeconds % 60).toString().padLeft(2, '0');
    return '$minutes:$seconds';
  }

  @override
  Widget build(BuildContext context) {
    final taskAsync = ref.watch(taskDetailsProvider(widget.taskId));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Détail de la tâche & Pomodoro'),
      ),
      body: taskAsync.when(
        data: (task) {
          return SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Project & Status
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Chip(
                      label: Text('#${task.project}'),
                      visualDensity: VisualDensity.compact,
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: task.completed ? Colors.green.withOpacity(0.15) : Colors.amber.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        task.completed ? 'Terminée' : 'À faire',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: task.completed ? Colors.green : Colors.amber.shade800,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),

                // Task Title
                Text(
                  task.title,
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
                const SizedBox(height: 8),

                // Due Date & Estimated
                Row(
                  children: [
                    const Icon(Icons.calendar_today_outlined, size: 14, color: Colors.grey),
                    const SizedBox(width: 4),
                    Text(task.dueDate ?? 'Aujourd\'hui', style: const TextStyle(fontSize: 12, color: Colors.grey)),
                    const SizedBox(width: 16),
                    const Icon(Icons.timelapse, size: 14, color: Colors.grey),
                    const SizedBox(width: 4),
                    Text('Estimation : ${task.estimatedMinutes} min', style: const TextStyle(fontSize: 12, color: Colors.grey)),
                  ],
                ),
                const SizedBox(height: 24),

                // Pomodoro Focus Timer Card
                Card(
                  elevation: 2,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  child: Padding(
                    padding: const EdgeInsets.all(20.0),
                    child: Column(
                      children: [
                        const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.local_fire_department, color: Colors.deepOrange),
                            SizedBox(width: 6),
                            Text(
                              'Minuteur Pomodoro (Focus)',
                              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        Text(
                          _formatTime(_secondsLeft),
                          style: const TextStyle(
                            fontSize: 44,
                            fontWeight: FontWeight.bold,
                            fontFamily: 'monospace',
                          ),
                        ),
                        const SizedBox(height: 16),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            ElevatedButton.icon(
                              onPressed: _togglePomodoro,
                              icon: Icon(_isRunning ? Icons.pause : Icons.play_arrow),
                              label: Text(_isRunning ? 'Pause' : 'Démarrer (25m)'),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: _isRunning ? Colors.amber.shade800 : Colors.indigo,
                                foregroundColor: Colors.white,
                              ),
                            ),
                            const SizedBox(width: 12),
                            OutlinedButton.icon(
                              onPressed: _resetPomodoro,
                              icon: const Icon(Icons.restart_alt, size: 18),
                              label: const Text('Reset'),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                // Subtasks / Checklist
                const Text(
                  'Sous-tâches',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                _subtaskItem('Analyser les exigences du ticket', true),
                _subtaskItem('Écrire les tests unitaires du repository', true),
                _subtaskItem('Mettre à jour la persistance locale dans Hive', false),
                const SizedBox(height: 24),

                // Complete Task Action
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: () {
                      ref.read(tasksPlanningProvider.notifier).toggleTask(task.id, task.completed);
                      Navigator.pop(context);
                    },
                    icon: Icon(task.completed ? Icons.undo : Icons.check_circle_outline),
                    label: Text(task.completed ? 'Marquer comme non terminée' : 'Marquer comme terminée'),
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      backgroundColor: task.completed ? Colors.grey.shade700 : Colors.green,
                      foregroundColor: Colors.white,
                    ),
                  ),
                ),
              ],
            ),
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, _) => NetworkErrorView(
          message: err.toString(),
          onRetry: () => ref.refresh(taskDetailsProvider(widget.taskId)),
        ),
      ),
    );
  }

  Widget _subtaskItem(String title, bool done) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Icon(
            done ? Icons.check_box : Icons.check_box_outline_blank,
            size: 20,
            color: done ? Colors.green : Colors.grey,
          ),
          const SizedBox(width: 10),
          Text(
            title,
            style: TextStyle(
              fontSize: 13,
              decoration: done ? TextDecoration.lineThrough : null,
              color: done ? Colors.grey : null,
            ),
          ),
        ],
      ),
    );
  }
}
