import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:chronoplan_time_management/features/auth/data/datasources/auth_local_datasource.dart';
import 'package:chronoplan_time_management/features/auth/data/datasources/auth_remote_datasource.dart';
import 'package:chronoplan_time_management/features/auth/data/models/user_model.dart';
import 'package:chronoplan_time_management/features/auth/data/repositories/auth_repository_impl.dart';

class MockAuthRemoteDataSource extends Mock implements AuthRemoteDataSource {}
class MockAuthLocalDataSource extends Mock implements AuthLocalDataSource {}

void main() {
  late AuthRepositoryImpl authRepository;
  late MockAuthRemoteDataSource mockRemoteDataSource;
  late MockAuthLocalDataSource mockLocalDataSource;

  final tUserModel = UserModel(
    id: 1,
    username: 'emilys',
    email: 'emily.smith@x.dummyjson.com',
    firstName: 'Emily',
    lastName: 'Smith',
    gender: 'female',
    image: 'https://dummyjson.com/icon/emilys/128',
    accessToken: 'sample_jwt_access_token_12345',
    refreshToken: 'sample_jwt_refresh_token_67890',
  );

  setUp(() {
    mockRemoteDataSource = MockAuthRemoteDataSource();
    mockLocalDataSource = MockAuthLocalDataSource();

    authRepository = AuthRepositoryImpl(
      remoteDataSource: mockRemoteDataSource,
      localDataSource: mockLocalDataSource,
    );
  });

  group('AuthRepository Unit Tests (JWT & Session)', () {
    test('1. login returns UserEntity and persists JWT tokens in AuthLocalDataSource', () async {
      // Arrange
      when(() => mockRemoteDataSource.login(username: 'emilys', password: 'emilyspass'))
          .thenAnswer((_) async => tUserModel);
      when(() => mockLocalDataSource.saveUserSession(
            tUserModel,
            accessToken: 'sample_jwt_access_token_12345',
            refreshToken: 'sample_jwt_refresh_token_67890',
          )).thenAnswer((_) async => Future.value());

      // Act
      final result = await authRepository.login(username: 'emilys', password: 'emilyspass');

      // Assert
      expect(result.id, 1);
      expect(result.username, 'emilys');
      expect(result.accessToken, 'sample_jwt_access_token_12345');
      verify(() => mockRemoteDataSource.login(username: 'emilys', password: 'emilyspass')).called(1);
      verify(() => mockLocalDataSource.saveUserSession(
            tUserModel,
            accessToken: 'sample_jwt_access_token_12345',
            refreshToken: 'sample_jwt_refresh_token_67890',
          )).called(1);
    });

    test('2. logout clears user session and JWT tokens from local storage', () async {
      // Arrange
      when(() => mockLocalDataSource.clearSession()).thenAnswer((_) async => Future.value());

      // Act
      await authRepository.logout();

      // Assert
      verify(() => mockLocalDataSource.clearSession()).called(1);
    });

    test('3. getCurrentUser returns cached UserEntity if session exists in Hive', () async {
      // Arrange
      when(() => mockLocalDataSource.getCachedUser()).thenAnswer((_) async => tUserModel);

      // Act
      final result = await authRepository.getCurrentUser();

      // Assert
      expect(result, isNotNull);
      expect(result?.username, 'emilys');
      verify(() => mockLocalDataSource.getCachedUser()).called(1);
      verifyZeroInteractions(mockRemoteDataSource);
    });
  });
}
