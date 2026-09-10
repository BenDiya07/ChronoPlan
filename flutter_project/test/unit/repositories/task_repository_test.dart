import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:chronoplan_time_management/core/api/app_exception.dart';
import 'package:chronoplan_time_management/core/network/network_info.dart';
import 'package:chronoplan_time_management/features/tasks/data/datasources/task_local_datasource.dart';
import 'package:chronoplan_time_management/features/tasks/data/datasources/task_remote_datasource.dart';
import 'package:chronoplan_time_management/features/tasks/data/models/task_model.dart';
import 'package:chronoplan_time_management/features/tasks/data/repositories/task_repository_impl.dart';
import 'package:chronoplan_time_management/features/tasks/domain/entities/task_entity.dart';

class MockTaskRemoteDataSource extends Mock implements TaskRemoteDataSource {}
class MockTaskLocalDataSource extends Mock implements TaskLocalDataSource {}
class MockNetworkInfo extends Mock implements NetworkInfo {}

void main() {
  late TaskRepositoryImpl repository;
  late MockTaskRemoteDataSource mockRemoteDataSource;
  late MockTaskLocalDataSource mockLocalDataSource;
  late MockNetworkInfo mockNetworkInfo;

  final tTaskModel = TaskModel(
    id: 1,
    title: 'Finaliser l\'architecture Clean et l\'intercepteur Dio',
    completed: false,
    userId: 5,
    priority: TaskPriority.p1High,
    project: 'Travail',
    estimatedMinutes: 45,
    dueDate: 'Aujourd\'hui',
    notes: 'Priorité P1 urgente pour la soumission',
  );

  final tTasksList = [tTaskModel];

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

  group('TaskRepository Unit Tests (Repository Layer - Clean Architecture)', () {
    test('1. Should return remote data and cache into Hive when device is ONLINE', () async {
      // Arrange
      when(() => mockNetworkInfo.isConnected).thenAnswer((_) async => true);
      when(() => mockRemoteDataSource.getTasks()).thenAnswer((_) async => tTasksList);
      when(() => mockLocalDataSource.cacheTasks(any())).thenAnswer((_) async => Future.value());

      // Act
      final result = await repository.getTasks();

      // Assert
      expect(result.length, 1);
      expect(result.first.id, 1);
      expect(result.first.title, 'Finaliser l\'architecture Clean et l\'intercepteur Dio');
      verify(() => mockRemoteDataSource.getTasks()).called(1);
      verify(() => mockLocalDataSource.cacheTasks(tTasksList)).called(1);
    });

    test('2. Should return cached tasks from Hive when device is OFFLINE (Offline Mode)', () async {
      // Arrange
      when(() => mockNetworkInfo.isConnected).thenAnswer((_) async => false);
      when(() => mockLocalDataSource.getCachedTasks()).thenAnswer((_) async => tTasksList);

      // Act
      final result = await repository.getTasks();

      // Assert
      expect(result.length, 1);
      expect(result.first.id, 1);
      verifyZeroInteractions(mockRemoteDataSource);
      verify(() => mockLocalDataSource.getCachedTasks()).called(1);
    });

    test('3. Should fall back to Hive cached tasks when remote API throws NetworkException (Timeout/500)', () async {
      // Arrange
      when(() => mockNetworkInfo.isConnected).thenAnswer((_) async => true);
      when(() => mockRemoteDataSource.getTasks()).thenThrow(const NetworkException('Délai d\'attente dépassé'));
      when(() => mockLocalDataSource.getCachedTasks()).thenAnswer((_) async => tTasksList);

      // Act
      final result = await repository.getTasks();

      // Assert
      expect(result.length, 1);
      expect(result.first.id, 1);
      verify(() => mockRemoteDataSource.getTasks()).called(1);
      verify(() => mockLocalDataSource.getCachedTasks()).called(1);
    });

    test('4. Should throw CacheException when offline and Hive local cache is empty', () async {
      // Arrange
      when(() => mockNetworkInfo.isConnected).thenAnswer((_) async => false);
      when(() => mockLocalDataSource.getCachedTasks()).thenAnswer((_) async => []);

      // Act & Assert
      expect(
        () => repository.getTasks(),
        throwsA(isA<CacheException>()),
      );
      verifyZeroInteractions(mockRemoteDataSource);
      verify(() => mockLocalDataSource.getCachedTasks()).called(1);
    });

    test('5. Should update task completion status in Hive local cache immediately', () async {
      // Arrange
      when(() => mockLocalDataSource.updateCachedTaskStatus(1, true)).thenAnswer((_) async => Future.value());
      when(() => mockNetworkInfo.isConnected).thenAnswer((_) async => true);
      when(() => mockRemoteDataSource.updateTaskStatus(1, true))
          .thenAnswer((_) async => tTaskModel.copyWith(completed: true) as TaskModel);

      // Act
      final result = await repository.toggleTaskCompletion(1, true);

      // Assert
      expect(result.completed, true);
      verify(() => mockLocalDataSource.updateCachedTaskStatus(1, true)).called(1);
      verify(() => mockRemoteDataSource.updateTaskStatus(1, true)).called(1);
    });
  });
}
