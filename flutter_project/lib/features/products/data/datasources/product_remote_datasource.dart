import 'package:dio/dio.dart';
import '../../../../core/api/api_endpoints.dart';
import '../../../../core/api/app_exception.dart';
import '../models/product_model.dart';

abstract class ProductRemoteDataSource {
  Future<List<ProductModel>> getProducts({String? category, String? searchQuery});
  Future<ProductModel> getProductById(int id);
  Future<List<String>> getCategories();
}

class ProductRemoteDataSourceImpl implements ProductRemoteDataSource {
  final Dio dio;

  ProductRemoteDataSourceImpl({required this.dio});

  @override
  Future<List<ProductModel>> getProducts({String? category, String? searchQuery}) async {
    try {
      String endpoint = ApiEndpoints.products;
      Map<String, dynamic> queryParams = {'limit': 30};

      if (searchQuery != null && searchQuery.trim().isNotEmpty) {
        endpoint = ApiEndpoints.productSearch;
        queryParams['q'] = searchQuery.trim();
      } else if (category != null && category.isNotEmpty && category.toLowerCase() != 'all') {
        endpoint = '${ApiEndpoints.products}/category/$category';
      }

      final response = await dio.get(endpoint, queryParameters: queryParams);

      if (response.statusCode == 200 && response.data != null) {
        final productsRaw = response.data['products'] as List? ?? [];
        return productsRaw.map((e) => ProductModel.fromJson(e as Map<String, dynamic>)).toList();
      } else {
        throw const ServerException('Impossible de récupérer les produits.');
      }
    } on DioException catch (e) {
      throw ErrorHandler.handleDioError(e);
    } catch (e) {
      if (e is AppException) rethrow;
      throw AppException(e.toString());
    }
  }

  @override
  Future<ProductModel> getProductById(int id) async {
    try {
      final response = await dio.get(ApiEndpoints.productDetail(id.toString()));
      if (response.statusCode == 200 && response.data != null) {
        return ProductModel.fromJson(response.data as Map<String, dynamic>);
      }
      throw const NotFoundException('Produit introuvable sur le serveur.');
    } on DioException catch (e) {
      throw ErrorHandler.handleDioError(e);
    } catch (e) {
      if (e is AppException) rethrow;
      throw AppException(e.toString());
    }
  }

  @override
  Future<List<String>> getCategories() async {
    try {
      final response = await dio.get(ApiEndpoints.categories);
      if (response.statusCode == 200 && response.data != null) {
        final data = response.data;
        if (data is List) {
          return data.map((item) {
            if (item is Map) return item['slug']?.toString() ?? item['name']?.toString() ?? '';
            return item.toString();
          }).where((s) => s.isNotEmpty).toList();
        }
      }
      return ['beauty', 'fragrances', 'furniture', 'groceries', 'smartphones', 'laptops'];
    } catch (_) {
      return ['beauty', 'fragrances', 'furniture', 'groceries', 'smartphones', 'laptops'];
    }
  }
}
