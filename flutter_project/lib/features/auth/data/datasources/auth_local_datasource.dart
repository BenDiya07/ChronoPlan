import '../../../../core/cache/hive_service.dart';
import '../models/user_model.dart';

abstract class AuthLocalDataSource {
  Future<void> saveUserSession(UserModel user, {required String accessToken, required String refreshToken});
  Future<UserModel?> getCachedUser();
  Future<String?> getAccessToken();
  Future<String?> getRefreshToken();
  Future<void> clearSession();
}

class AuthLocalDataSourceImpl implements AuthLocalDataSource {
  final HiveService hiveService;

  AuthLocalDataSourceImpl({required this.hiveService});

  @override
  Future<void> saveUserSession(UserModel user, {required String accessToken, required String refreshToken}) async {
    await hiveService.saveAuthData(
      accessToken: accessToken,
      refreshToken: refreshToken,
      userJson: user.toJson(),
    );
  }

  @override
  Future<UserModel?> getCachedUser() async {
    final cached = hiveService.getCachedUser();
    if (cached != null) {
      final token = hiveService.getAccessToken();
      final refreshToken = hiveService.getRefreshToken();
      return UserModel.fromJson(cached, token: token, refreshToken: refreshToken);
    }
    return null;
  }

  @override
  Future<String?> getAccessToken() async => hiveService.getAccessToken();

  @override
  Future<String?> getRefreshToken() async => hiveService.getRefreshToken();

  @override
  Future<void> clearSession() async {
    await hiveService.clearAuthData();
  }
}
