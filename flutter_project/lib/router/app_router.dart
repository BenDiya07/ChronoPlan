import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../features/auth/presentation/screens/login_screen.dart';
import '../features/auth/presentation/screens/register_screen.dart';
import '../features/products/presentation/screens/catalog_screen.dart';
import '../features/products/presentation/screens/product_detail_screen.dart';
import '../features/profile/presentation/screens/profile_stats_screen.dart';
import '../features/shared/screens/main_shell_screen.dart';
import '../features/tasks/presentation/screens/task_detail_screen.dart';
import '../features/tasks/presentation/screens/tasks_screen.dart';

final GlobalKey<NavigatorState> _rootNavigatorKey = GlobalKey<NavigatorState>();

final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    navigatorKey: _rootNavigatorKey,
    initialLocation: '/tasks',
    routes: [
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/register',
        builder: (context, state) => const RegisterScreen(),
      ),
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) {
          return MainShellScreen(navigationShell: navigationShell);
        },
        branches: [
          // Branch 0: Tasks & Planning
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/tasks',
                builder: (context, state) => const TasksScreen(),
              ),
            ],
          ),
          // Branch 1: Products Catalog
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/catalog',
                builder: (context, state) => const CatalogScreen(),
              ),
            ],
          ),
          // Branch 2: Profile & Stats
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/profile',
                builder: (context, state) => const ProfileStatsScreen(),
              ),
            ],
          ),
        ],
      ),
      // Direct Task Detail Route (Screen 2: REST API /todos/:id)
      GoRoute(
        parentNavigatorKey: _rootNavigatorKey,
        path: '/task/:id',
        builder: (context, state) {
          final idParam = state.pathParameters['id'] ?? '1';
          final taskId = int.tryParse(idParam) ?? 1;
          return TaskDetailScreen(taskId: taskId);
        },
      ),
      // Product Detail Route (REST API /products/:id)
      GoRoute(
        parentNavigatorKey: _rootNavigatorKey,
        path: '/product/:id',
        builder: (context, state) {
          final idParam = state.pathParameters['id'] ?? '1';
          final productId = int.tryParse(idParam) ?? 1;
          return ProductDetailScreen(productId: productId);
        },
      ),
    ],
  );
});
