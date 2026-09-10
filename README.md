# ChronoPlan — Connected Flutter Time Management & Planning App

A complete Flutter app connected to a real REST API (DummyJSON): **JWT authentication (login / register / logout)**, **Dio `AuthInterceptor` with refresh-token handling**, **local caching with Hive**, **offline mode fallback**, and **network error handling**.



##  Architecture (Feature-First Clean Architecture)

```
lib/
├── main.dart                     # Bootstrap: HiveService().init() + ProviderScope
├── core/
│   ├── api/
│   │   ├── api_endpoints.dart    # DummyJSON REST API routes
│   │   ├── app_exception.dart    # AppException hierarchy + Dio error mapper
│   │   ├── auth_interceptor.dart # QueuedInterceptor: Bearer injection + 401 refresh
│   │   └── dio_client.dart       # Configured Dio instance (timeouts, LogInterceptor)
│   ├── cache/
│   │   └── hive_service.dart     # Hive boxes: auth_box, tasks_box, products_box, metadata_box
│   ├── network/
│   │   └── network_info.dart     # Connectivity listener (connectivity_plus)
│   └── theme/
│       └── app_theme.dart        # Material 3 light & dark themes
├── features/
│   ├── auth/                     # data / domain / presentation (login, register, logout, JWT)
│   ├── tasks/                    # data / domain / presentation (tasks from /todos)
│   ├── products/                 # data / domain / presentation (catalog from /products)
│   ├── profile/                  # presentation (stats & logout)
│   └── shared/                   # main_shell_screen, offline_banner, network_error_view
└── router/
    └── app_router.dart           # GoRouter: /login, /tasks, /catalog, /profile, /task/:id, /product/:id
```

Each feature follows the **repository pattern**: an abstract repository contract in `domain/repositories/`, an implementation in `data/repositories/`, with remote (`Dio`) and local (`Hive`) datasources below it. Repositories check connectivity and fall back to the Hive cache when offline.

---

##  APIs Used (DummyJSON)

Base URL: `https://dummyjson.com`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/login` | Login → returns JWT `accessToken` & `refreshToken` |
| `POST` | `/auth/refresh` | Renews the access token |
| `GET` | `/auth/me` | Current user profile |
| `POST` | `/users/add` | Registration (DummyJSON simulation) |
| `GET` | `/todos?limit=25` | Task list |
| `GET` | `/todos/:id` | Task details |
| `POST` | `/todos/add` | Create a task |
| `PUT` | `/todos/:id` | Toggle task completion |
| `DELETE` | `/todos/:id` | Delete a task |
| `GET` | `/products` | Product catalog |
| `GET` | `/products/search?q=` | Product search |
| `GET` | `/products/category/:slug` | Products by category |
| `GET` | `/products/:id` | Product details |

---

##  How to Configure the Project

### Prerequisites
- Flutter SDK `>= 3.0.0` (Dart `>= 3.0.0`)

### Steps
```bash
# 1. Clone & install dependencies
git clone https://github.com/BenDiya07/Flutter-Project-Multi-screen-app-with-navigation.git
cd Flutter-Project-Multi-screen-app-with-navigation/flutter_project
flutter pub get

# 2. Analyze & run tests
flutter analyze
flutter test

# 3. Launch the app
flutter run
```

### Demo credentials (DummyJSON)
- **Username**: `emilys`
- **Password**: `emilyspass`
- Guest access ("Continuer en tant qu'invité") is also available from the login screen.