import 'package:flutter/material.dart';

class RatingBadge extends StatelessWidget {
  final double rating;
  final bool showStar;
  final double fontSize;
  final EdgeInsetsGeometry padding;

  const RatingBadge({
    super.key,
    required this.rating,
    this.showStar = true,
    this.fontSize = 13.0,
    this.padding = const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: padding,
      decoration: BoxDecoration(
        color: const Color(0xFF1E202C).withOpacity(0.85),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: const Color(0xFFFFB800).withOpacity(0.3), width: 1),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (showStar) ...[
            const Icon(
              Icons.star_rounded,
              color: Color(0xFFFFB800),
              size: 16,
            ),
            const SizedBox(width: 4),
          ],
          Text(
            rating.toStringAsFixed(1),
            style: TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.w700,
              fontSize: fontSize,
            ),
          ),
        ],
      ),
    );
  }
}
