import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:chronoplan_time_management/main.dart';

void main() {
  testWidgets('ChronoPlanApp boots up and renders main screens with ProviderScope', (WidgetTester tester) async {
    // Build our app wrapped in ProviderScope and trigger a frame.
    await tester.pumpWidget(
      const ProviderScope(
        child: ChronoPlanApp(),
      ),
    );

    // Initial pump to resolve route
    await tester.pump();
    await tester.pump(const Duration(seconds: 1));

    // Verify MaterialApp.router is rendered
    expect(find.byType(MaterialApp), findsOneWidget);
  });
}
