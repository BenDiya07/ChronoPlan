import 'package:dio/dio.dart';

abstract class AppException implements Exception {
  final String message;
  final int? statusCode;

  const AppException(this.message, [this.statusCode]);

  @override
  String toString() => message;
}

class NetworkException extends AppException {
  const NetworkException([String message = 'Pas de connexion internet. Données hors-ligne affichées.'])
      : super(message);
}

class UnauthorizedException extends AppException {
  const UnauthorizedException([String message = 'Session expirée ou identifiants invalides. Veuillez vous reconnecter.'])
      : super(message, 401);
}

class ServerException extends AppException {
  const ServerException([String message = 'Erreur serveur temporaire. Veuillez réessayer plus tard.'])
      : super(message, 500);
}

class NotFoundException extends AppException {
  const NotFoundException([String message = 'Ressource demandée introuvable.'])
      : super(message, 404);
}

class CacheException extends AppException {
  const CacheException([String message = 'Aucune donnée en cache local disponible.'])
      : super(message);
}

class ErrorHandler {
  static AppException handleDioError(DioException error) {
    switch (error.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        return const NetworkException('Délai d\'attente dépassé. Veuillez vérifier votre connexion.');
      case DioExceptionType.connectionError:
        return const NetworkException('Impossible de contacter le serveur. Mode hors-ligne activé.');
      case DioExceptionType.badResponse:
        final code = error.response?.statusCode;
        if (code == 400 || code == 401) {
          final serverMsg = error.response?.data is Map ? error.response?.data['message'] : null;
          return UnauthorizedException(serverMsg?.toString() ?? 'Échec de l\'authentification.');
        } else if (code == 404) {
          return const NotFoundException();
        } else if (code != null && code >= 500) {
          return const ServerException();
        }
        return AppException(error.response?.statusMessage ?? 'Une erreur réseau est survenue.', code);
      case DioExceptionType.cancel:
        return const AppException('Requête annulée.');
      case DioExceptionType.unknown:
      default:
        return const NetworkException('Erreur de communication réseau.');
    }
  }
}
