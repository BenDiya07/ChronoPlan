import 'package:dio/dio.dart';
import '../cache/hive_service.dart';
import 'api_endpoints.dart';

class AuthInterceptor extends QueuedInterceptor {
  final Dio _dio;
  final HiveService _hiveService;

  AuthInterceptor(this._dio, this._hiveService);

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    // Inject JWT Bearer Token if available in Hive local cache
    final token = _hiveService.getAccessToken();
    if (token != null && token.isNotEmpty) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    options.headers['Accept'] = 'application/json';
    options.headers['Content-Type'] = 'application/json';
    return handler.next(options);
  }

  @override
  Future<void> onError(DioException err, ErrorInterceptorHandler handler) async {
    // Check if error is 401 Unauthorized and not already on the refresh endpoint
    if (err.response?.statusCode == 401 && !err.requestOptions.path.contains('/auth/refresh')) {
      final refreshToken = _hiveService.getRefreshToken();

      if (refreshToken != null && refreshToken.isNotEmpty) {
        try {
          // Attempt JWT Refresh Token call
          final refreshDio = Dio(BaseOptions(
            baseUrl: ApiEndpoints.baseUrl,
            connectTimeout: const Duration(seconds: 5),
          ));

          final refreshResponse = await refreshDio.post(
            ApiEndpoints.refreshToken,
            data: {
              'refreshToken': refreshToken,
              'expiresInMins': 60,
            },
          );

          if (refreshResponse.statusCode == 200 && refreshResponse.data != null) {
            final newAccessToken = refreshResponse.data['accessToken'] as String? ??
                refreshResponse.data['token'] as String;
            final newRefreshToken = refreshResponse.data['refreshToken'] as String? ?? refreshToken;

            // Persist renewed tokens in Hive
            await _hiveService.saveAuthData(
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
              userJson: _hiveService.getCachedUser() ?? {},
            );

            // Clone failed request options with new Bearer header and retry
            final options = err.requestOptions;
            options.headers['Authorization'] = 'Bearer $newAccessToken';

            final retryResponse = await _dio.fetch(options);
            return handler.resolve(retryResponse);
          }
        } catch (refreshError) {
          // Refresh failed: clear credentials to force user to log in again
          await _hiveService.clearAuthData();
        }
      }
    }

    return handler.next(err);
  }
}
