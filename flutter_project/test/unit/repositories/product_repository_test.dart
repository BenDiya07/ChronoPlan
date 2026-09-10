import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:chronoplan_time_management/core/api/app_exception.dart';
import 'package:chronoplan_time_management/core/network/network_info.dart';
import 'package:chronoplan_time_management/features/products/data/datasources/product_local_datasource.dart';
import 'package:chronoplan_time_management/features/products/data/datasources/product_remote_datasource.dart';
import 'package:chronoplan_time_management/features/products/data/models/product_model.dart';
import 'package:chronoplan_time_management/features/products/data/repositories/product_repository_impl.dart';

class MockProductRemoteDataSource extends Mock implements ProductRemoteDataSource {}
class MockProductLocalDataSource extends Mock implements ProductLocalDataSource {}
class MockNetworkInfo extends Mock implements NetworkInfo {}

void main() {
  late ProductRepositoryImpl repository;
  late MockProductRemoteDataSource mockRemoteDataSource;
  late MockProductLocalDataSource mockLocalDataSource;
  late MockNetworkInfo mockNetworkInfo;

  final tProductModel = ProductModel(
    id: 1,
    title: 'iPhone 15 Pro',
    description: 'Flagship smartphone',
    price: 999.99,
    discountPercentage: 5.0,
    rating: 4.8,
    stock: 25,
    brand: 'Apple',
    category: 'smartphones',
    thumbnail: 'https://cdn.dummyjson.com/products/1/thumbnail.jpg',
    images: ['https://cdn.dummyjson.com/products/1/1.jpg'],
  );

  final tProductsList = [tProductModel];

  setUp(() {
    mockRemoteDataSource = MockProductRemoteDataSource();
    mockLocalDataSource = MockProductLocalDataSource();
    mockNetworkInfo = MockNetworkInfo();

    repository = ProductRepositoryImpl(
      remoteDataSource: mockRemoteDataSource,
      localDataSource: mockLocalDataSource,
      networkInfo: mockNetworkInfo,
    );
  });

  group('ProductRepository Unit Tests (Repository Layer)', () {
    test('1. Should return remote data and cache in Hive when device is ONLINE', () async {
      // Arrange
      when(() => mockNetworkInfo.isConnected).thenAnswer((_) async => true);
      when(() => mockRemoteDataSource.getProducts(category: any(named: 'category'), searchQuery: any(named: 'searchQuery')))
          .thenAnswer((_) async => tProductsList);
      when(() => mockLocalDataSource.cacheProducts(any())).thenAnswer((_) async => Future.value());

      // Act
      final result = await repository.getProducts();

      // Assert
      expect(result.length, 1);
      expect(result.first.id, 1);
      expect(result.first.title, 'iPhone 15 Pro');
      verify(() => mockRemoteDataSource.getProducts()).called(1);
      verify(() => mockLocalDataSource.cacheProducts(tProductsList)).called(1);
    });

    test('2. Should return cached data from Hive when device is OFFLINE (Offline Mode)', () async {
      // Arrange
      when(() => mockNetworkInfo.isConnected).thenAnswer((_) async => false);
      when(() => mockLocalDataSource.getCachedProducts()).thenAnswer((_) async => tProductsList);

      // Act
      final result = await repository.getProducts();

      // Assert
      expect(result.length, 1);
      expect(result.first.title, 'iPhone 15 Pro');
      verifyZeroInteractions(mockRemoteDataSource);
      verify(() => mockLocalDataSource.getCachedProducts()).called(1);
    });

    test('3. Should return cached data from Hive when remote call fails with NetworkException', () async {
      // Arrange
      when(() => mockNetworkInfo.isConnected).thenAnswer((_) async => true);
      when(() => mockRemoteDataSource.getProducts(category: any(named: 'category'), searchQuery: any(named: 'searchQuery')))
          .thenThrow(const NetworkException('Connection timeout'));
      when(() => mockLocalDataSource.getCachedProducts()).thenAnswer((_) async => tProductsList);

      // Act
      final result = await repository.getProducts();

      // Assert
      expect(result.length, 1);
      expect(result.first.id, 1);
      verify(() => mockRemoteDataSource.getProducts()).called(1);
      verify(() => mockLocalDataSource.getCachedProducts()).called(1);
    });

    test('4. Should throw CacheException when offline and Hive local cache is empty', () async {
      // Arrange
      when(() => mockNetworkInfo.isConnected).thenAnswer((_) async => false);
      when(() => mockLocalDataSource.getCachedProducts()).thenAnswer((_) async => []);

      // Act & Assert
      expect(
        () => repository.getProducts(),
        throwsA(isA<CacheException>()),
      );
      verifyZeroInteractions(mockRemoteDataSource);
      verify(() => mockLocalDataSource.getCachedProducts()).called(1);
    });

    test('5. Should return product details from remote data source by ID', () async {
      // Arrange
      when(() => mockNetworkInfo.isConnected).thenAnswer((_) async => true);
      when(() => mockRemoteDataSource.getProductById(1)).thenAnswer((_) async => tProductModel);

      // Act
      final result = await repository.getProductById(1);

      // Assert
      expect(result.id, 1);
      expect(result.price, 999.99);
      verify(() => mockRemoteDataSource.getProductById(1)).called(1);
    });
  });
}
