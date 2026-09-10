import '../../domain/entities/user_entity.dart';
import '../../domain/repositories/auth_repository.dart';
import '../datasources/auth_local_datasource.dart';
import '../datasources/auth_remote_datasource.dart';

class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource remoteDataSource;
  final AuthLocalDataSource localDataSource;

  AuthRepositoryImpl({
    required this.remoteDataSource,
    required this.localDataSource,
  });

  @override
  Future<UserEntity> login({required String username, required String password}) async {
    final userModel = await remoteDataSource.login(username: username, password: password);
    
    // Save token and user in local cache
    if (userModel.accessToken != null) {
      await localDataSource.saveUserSession(
        userModel,
        accessToken: userModel.accessToken!,
        refreshToken: userModel.refreshToken ?? '',
      );
    }
    
    return userModel.toEntity();
  }

  @override
  Future<UserEntity> register({
    required String username,
    required String email,
    required String password,
    required String firstName,
    required String lastName,
  }) async {
    final userModel = await remoteDataSource.register(
      username: username,
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
    );

    if (userModel.accessToken != null) {
      await localDataSource.saveUserSession(
        userModel,
        accessToken: userModel.accessToken!,
        refreshToken: userModel.refreshToken ?? '',
      );
    }

    return userModel.toEntity();
  }

  @override
  Future<UserEntity?> getCurrentUser() async {
    // Check cached session first
    final cached = await localDataSource.getCachedUser();
    if (cached != null) {
      return cached.toEntity();
    }

    // Otherwise if token exists, try fetching from remote
    final token = await localDataSource.getAccessToken();
    if (token != null && token.isNotEmpty) {
      try {
        final remoteUser = await remoteDataSource.getCurrentUser();
        return remoteUser.toEntity();
      } catch (_) {
        return null;
      }
    }
    return null;
  }

  @override
  Future<void> logout() async {
    await localDataSource.clearSession();
  }

  @override
  Future<bool> isAuthenticated() async {
    final token = await localDataSource.getAccessToken();
    return token != null && token.isNotEmpty;
  }
}
