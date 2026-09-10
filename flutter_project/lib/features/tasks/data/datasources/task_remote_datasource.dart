import 'package:dio/dio.dart';
import '../../../../core/api/api_endpoints.dart';
import '../../../../core/api/app_exception.dart';
import '../models/task_model.dart';

abstract class TaskRemoteDataSource {
  Future<List<TaskModel>> getTasks();
  Future<TaskModel> getTaskById(int id);
  Future<TaskModel> updateTaskStatus(int id, bool completed);
  Future<TaskModel> createTask(String title, {String? project, int? estimatedMinutes});
  Future<void> deleteTask(int id);
}

class TaskRemoteDataSourceImpl implements TaskRemoteDataSource {
  final Dio dio;

  TaskRemoteDataSourceImpl({required this.dio});

  @override
  Future<List<TaskModel>> getTasks() async {
    try {
      final response = await dio.get(
        ApiEndpoints.todos,
        queryParameters: {'limit': 25},
      );

      if (response.statusCode == 200 && response.data != null) {
        final todosRaw = response.data['todos'] as List? ?? [];
        return todosRaw.map((e) => TaskModel.fromJson(e as Map<String, dynamic>)).toList();
      } else {
        throw const ServerException('Impossible de charger les tâches du serveur.');
      }
    } on DioException catch (e) {
      throw ErrorHandler.handleDioError(e);
    } catch (e) {
      if (e is AppException) rethrow;
      throw AppException(e.toString());
    }
  }

  @override
  Future<TaskModel> getTaskById(int id) async {
    try {
      final response = await dio.get(ApiEndpoints.todoDetail(id.toString()));
      if (response.statusCode == 200 && response.data != null) {
        return TaskModel.fromJson(response.data as Map<String, dynamic>);
      }
      throw const NotFoundException('Tâche introuvable sur le serveur.');
    } on DioException catch (e) {
      throw ErrorHandler.handleDioError(e);
    } catch (e) {
      if (e is AppException) rethrow;
      throw AppException(e.toString());
    }
  }

  @override
  Future<TaskModel> updateTaskStatus(int id, bool completed) async {
    try {
      final response = await dio.put(
        ApiEndpoints.todoDetail(id.toString()),
        data: {'completed': completed},
      );
      if (response.statusCode == 200 && response.data != null) {
        return TaskModel.fromJson(response.data as Map<String, dynamic>);
      }
      throw const ServerException('Échec de la mise à jour de la tâche.');
    } on DioException catch (e) {
      throw ErrorHandler.handleDioError(e);
    } catch (e) {
      if (e is AppException) rethrow;
      throw AppException(e.toString());
    }
  }

  @override
  Future<TaskModel> createTask(String title, {String? project, int? estimatedMinutes}) async {
    try {
      final response = await dio.post(
        ApiEndpoints.addTodo,
        data: {
          'todo': title,
          'completed': false,
          'userId': 5,
        },
      );
      if (response.statusCode == 200 || response.statusCode == 201) {
        return TaskModel.fromJson(response.data as Map<String, dynamic>);
      }
      throw const ServerException('Échec de la création de la tâche.');
    } on DioException catch (e) {
      throw ErrorHandler.handleDioError(e);
    } catch (e) {
      if (e is AppException) rethrow;
      throw AppException(e.toString());
    }
  }

  @override
  Future<void> deleteTask(int id) async {
    try {
      await dio.delete(ApiEndpoints.todoDetail(id.toString()));
    } on DioException catch (e) {
      throw ErrorHandler.handleDioError(e);
    }
  }
}
