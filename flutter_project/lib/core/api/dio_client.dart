import 'package:dio/dio.dart';
import '../cache/hive_service.dart';
import 'api_endpoints.dart';
import 'auth_interceptor.dart';

class DioClient {
  late final Dio dio;
  final HiveService hiveService;

  DioClient({required this.hiveService}) {
    dio = Dio(
      BaseOptions(
        baseUrl: ApiEndpoints.baseUrl,
        connectTimeout: const Duration(seconds: 10),
        receiveTimeout: const Duration(seconds: 10),
        sendTimeout: const Duration(seconds: 10),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      ),
    );

    dio.interceptors.add(AuthInterceptor(dio, hiveService));
    
    // Optional debug logger for development
    dio.interceptors.add(
      LogInterceptor(
        request: true,
        requestHeader: true,
        requestBody: true,
        responseHeader: false,
        responseBody: false,
        error: true,
      ),
    );
  }
}
