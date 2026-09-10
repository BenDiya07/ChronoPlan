import 'package:dio/dio.dart';
import '../../../../core/api/api_endpoints.dart';
import '../../../../core/api/app_exception.dart';
import '../models/user_model.dart';

abstract class AuthRemoteDataSource {
  Future<UserModel> login({required String username, required String password});
  Future<UserModel> register({
    required String username,
    required String email,
    required String password,
    required String firstName,
    required String lastName,
  });
  Future<UserModel> getCurrentUser();
  Future<Map<String, String>> refreshToken(String refreshToken);
}

class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  final Dio dio;

  AuthRemoteDataSourceImpl({required this.dio});

  @override
  Future<UserModel> login({required String username, required String password}) async {
    try {
      final response = await dio.post(
        ApiEndpoints.login,
        data: {
          'username': username,
          'password': password,
          'expiresInMins': 60,
        },
      );

      if (response.statusCode == 200 && response.data != null) {
        final data = response.data as Map<String, dynamic>;
        final accessToken = data['accessToken'] as String? ?? data['token'] as String;
        final refreshToken = data['refreshToken'] as String? ?? '';
        return UserModel.fromJson(data, token: accessToken, refreshToken: refreshToken);
      } else {
        throw const UnauthorizedException('Identifiants invalides');
      }
    } on DioException catch (e) {
      throw ErrorHandler.handleDioError(e);
    } catch (e) {
      if (e is AppException) rethrow;
      throw AppException(e.toString());
    }
  }

  @override
  Future<UserModel> register({
    required String username,
    required String email,
    required String password,
    required String firstName,
    required String lastName,
  }) async {
    try {
      final response = await dio.post(
        ApiEndpoints.register,
        data: {
          'username': username,
          'email': email,
          'password': password,
          'firstName': firstName,
          'lastName': lastName,
        },
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = response.data as Map<String, dynamic>;
        // DummyJSON simulates addition, return simulated JWT token
        return UserModel.fromJson(
          data,
          token: 'simulated_jwt_token_${DateTime.now().millisecondsSinceEpoch}',
          refreshToken: 'simulated_refresh_token',
        );
      } else {
        throw const AppException('Échec de la création du compte');
      }
    } on DioException catch (e) {
      throw ErrorHandler.handleDioError(e);
    } catch (e) {
      if (e is AppException) rethrow;
      throw AppException(e.toString());
    }
  }

  @override
  Future<UserModel> getCurrentUser() async {
    try {
      final response = await dio.get(ApiEndpoints.currentUser);
      if (response.statusCode == 200 && response.data != null) {
        return UserModel.fromJson(response.data as Map<String, dynamic>);
      }
      throw const UnauthorizedException();
    } on DioException catch (e) {
      throw ErrorHandler.handleDioError(e);
    }
  }

  @override
  Future<Map<String, String>> refreshToken(String refreshToken) async {
    try {
      final response = await dio.post(
        ApiEndpoints.refreshToken,
        data: {
          'refreshToken': refreshToken,
          'expiresInMins': 60,
        },
      );
      if (response.statusCode == 200 && response.data != null) {
        final data = response.data as Map<String, dynamic>;
        return {
          'accessToken': data['accessToken'] as String? ?? data['token'] as String,
          'refreshToken': data['refreshToken'] as String? ?? refreshToken,
        };
      }
      throw const UnauthorizedException('Impossible de renouveler le token.');
    } on DioException catch (e) {
      throw ErrorHandler.handleDioError(e);
    }
  }
}
