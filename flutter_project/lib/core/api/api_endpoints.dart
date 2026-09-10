class ApiEndpoints {
  static const String baseUrl = 'https://dummyjson.com';
  
  // Auth Endpoints (JWT)
  static const String login = '/auth/login';
  static const String refreshToken = '/auth/refresh';
  static const String currentUser = '/auth/me';
  static const String register = '/users/add';
  
  // Products Endpoints
  static const String products = '/products';
  static const String productSearch = '/products/search';
  static const String categories = '/products/categories';
  
  static String productDetail(String id) => '/products/$id';
  static String productByCategory(String category) => '/products/category/$category';
  
  // Todos / Tasks Endpoints
  static const String todos = '/todos';
  static const String todosUser = '/todos/user';
  static const String addTodo = '/todos/add';
  
  static String todoDetail(String id) => '/todos/$id';
  static String userTodos(String userId) => '/todos/user/$userId';
}
