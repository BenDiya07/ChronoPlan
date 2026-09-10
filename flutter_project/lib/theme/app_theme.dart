import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  static const Color primary = Color(0xFF6366F1); // Vibrant Indigo
  static const Color primaryDark = Color(0xFF4F46E5);
  static const Color accent = Color(0xFF10B981); // Emerald
  static const Color secondary = Color(0xFFF43F5E); // Rose
  
  static final ThemeData darkTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    colorScheme: const ColorScheme.dark(
      primary: primary,
      secondary: accent,
      surface: Color(0xFF12141C),
      background: Color(0xFF0B0C10),
      error: Color(0xFFEF4444),
    ),
    scaffoldBackgroundColor: const Color(0xFF0B0C10),
    cardColor: const Color(0xFF181A24),
    textTheme: GoogleFonts.plusJakartaSansTextTheme(
      ThemeData(brightness: Brightness.dark).textTheme,
    ),
    appBarTheme: const AppBarTheme(
      backgroundColor: Color(0xFF0B0C10),
      elevation: 0,
      centerTitle: false,
    ),
  );

  static final ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    colorScheme: const ColorScheme.light(
      primary: primary,
      secondary: accent,
      surface: Colors.white,
      background: Color(0xFFF8F9FC),
      error: Color(0xFFEF4444),
    ),
    scaffoldBackgroundColor: const Color(0xFFF8F9FC),
    cardColor: Colors.white,
    textTheme: GoogleFonts.plusJakartaSansTextTheme(
      ThemeData(brightness: Brightness.light).textTheme,
    ),
    appBarTheme: const AppBarTheme(
      backgroundColor: Colors.white,
      elevation: 0,
      centerTitle: false,
    ),
  );
}
