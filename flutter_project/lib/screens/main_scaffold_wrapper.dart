import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class MainScaffoldWrapper extends StatelessWidget {
  final StatefulNavigationShell navigationShell;

  const MainScaffoldWrapper({
    super.key,
    required this.navigationShell,
  });

  void _onTap(BuildContext context, int index) {
    navigationShell.goBranch(
      index,
      initialLocation: index == navigationShell.currentIndex,
    );
  }

  @override
  Widget build(BuildContext context) {
    final isTablet = MediaQuery.of(context).size.width >= 768;
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    if (isTablet) {
      return Scaffold(
        body: Row(
          children: [
            NavigationRail(
              selectedIndex: navigationShell.currentIndex,
              onDestinationSelected: (index) => _onTap(context, index),
              labelType: NavigationRailLabelType.all,
              backgroundColor: isDark ? const Color(0xFF13151F) : const Color(0xFFF3F4F6),
              indicatorColor: theme.colorScheme.primary.withOpacity(0.2),
              leading: Padding(
                padding: const EdgeInsets.symmetric(vertical: 20),
                child: Row(
                  children: [
                    Icon(Icons.movie_filter_rounded, color: theme.colorScheme.primary, size: 28),
                    const SizedBox(width: 8),
                    const Text(
                      'CineVerse',
                      style: TextStyle(fontWeight: FontWeight.w900, fontSize: 18),
                    ),
                  ],
                ),
              ),
              destinations: const [
                NavigationRailDestination(
                  icon: Icon(Icons.home_outlined),
                  selectedIcon: Icon(Icons.home_filled, color: Color(0xFFE50914)),
                  label: Text('Accueil'),
                ),
                NavigationRailDestination(
                  icon: Icon(Icons.explore_outlined),
                  selectedIcon: Icon(Icons.explore, color: Color(0xFFE50914)),
                  label: Text('Explorer'),
                ),
                NavigationRailDestination(
                  icon: Icon(Icons.rate_review_outlined),
                  selectedIcon: Icon(Icons.rate_review, color: Color(0xFFE50914)),
                  label: Text('Ajouter Avis'),
                ),
                NavigationRailDestination(
                  icon: Icon(Icons.bookmark_outline_rounded),
                  selectedIcon: Icon(Icons.bookmark_rounded, color: Color(0xFFE50914)),
                  label: Text('Ma Liste'),
                ),
              ],
            ),
            const VerticalDivider(thickness: 1, width: 1),
            Expanded(child: navigationShell),
          ],
        ),
      );
    }

    return Scaffold(
      body: navigationShell,
      bottomNavigationBar: NavigationBar(
        selectedIndex: navigationShell.currentIndex,
        onDestinationSelected: (index) => _onTap(context, index),
        backgroundColor: isDark ? const Color(0xFF13151F) : Colors.white,
        indicatorColor: theme.colorScheme.primary.withOpacity(0.18),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home_filled, color: Color(0xFFE50914)),
            label: 'Accueil',
          ),
          NavigationDestination(
            icon: Icon(Icons.explore_outlined),
            selectedIcon: Icon(Icons.explore, color: Color(0xFFE50914)),
            label: 'Explorer',
          ),
          NavigationDestination(
            icon: Icon(Icons.rate_review_outlined),
            selectedIcon: Icon(Icons.rate_review, color: Color(0xFFE50914)),
            label: 'Avis',
          ),
          NavigationDestination(
            icon: Icon(Icons.bookmark_outline_rounded),
            selectedIcon: Icon(Icons.bookmark_rounded, color: Color(0xFFE50914)),
            label: 'Ma Liste',
          ),
        ],
      ),
    );
  }
}
