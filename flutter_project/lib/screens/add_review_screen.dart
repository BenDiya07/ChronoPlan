import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../models/movie.dart';
import '../models/review.dart';

class AddReviewScreen extends StatefulWidget {
  final List<Movie> movies;
  final String? initialMovieId;
  final Function(String movieId, Review review) onAddReview;

  const AddReviewScreen({
    super.key,
    required this.movies,
    this.initialMovieId,
    required this.onAddReview,
  });

  @override
  State<AddReviewScreen> createState() => _AddReviewScreenState();
}

class _AddReviewScreenState extends State<AddReviewScreen> {
  final _formKey = GlobalKey<FormState>();
  
  late String _selectedMovieId;
  final TextEditingController _authorController = TextEditingController();
  final TextEditingController _commentController = TextEditingController();
  double _rating = 4.5;
  bool _recommend = true;
  bool _isSubmitting = false;

  @override
  void initState() {
    super.initState();
    _selectedMovieId = (widget.initialMovieId != null &&
            widget.movies.any((m) => m.id == widget.initialMovieId))
        ? widget.initialMovieId!
        : widget.movies.first.id;
  }

  @override
  void dispose() {
    _authorController.dispose();
    _commentController.dispose();
    super.dispose();
  }

  void _submitForm() {
    if (_formKey.currentState!.validate()) {
      setState(() => _isSubmitting = true);

      final newReview = Review(
        id: 'rev_${DateTime.now().millisecondsSinceEpoch}',
        author: _authorController.text.trim(),
        rating: _rating,
        comment: _commentController.text.trim(),
        date: DateTime.now(),
      );

      widget.onAddReview(_selectedMovieId, newReview);

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Row(
            children: const [
              Icon(Icons.check_circle_rounded, color: Colors.white),
              SizedBox(width: 10),
              Text('Votre avis a été publié avec succès !'),
            ],
          ),
          backgroundColor: const Color(0xFF10B981),
          behavior: SnackBarBehavior.floating,
        ),
      );

      // Navigate to the movie detail or pop
      Future.delayed(const Duration(milliseconds: 400), () {
        if (mounted) {
          context.pushReplacement('/movie/$_selectedMovieId');
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Rédiger une critique', style: TextStyle(fontWeight: FontWeight.bold)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          autovalidateMode: AutovalidateMode.onUserInteraction,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header note
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: theme.colorScheme.primary.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: theme.colorScheme.primary.withOpacity(0.3)),
                ),
                child: Row(
                  children: [
                    Icon(Icons.rate_review_rounded, color: theme.colorScheme.primary),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        'Partagez votre ressenti avec la communauté CineVerse. Tous les champs avec * sont obligatoires.',
                        style: TextStyle(
                          fontSize: 13,
                          color: isDark ? Colors.grey[300] : const Color(0xFF374151),
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // Field 1: Film selection (DropdownButtonFormField)
              const Text(
                'Film concerné *',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
              ),
              const SizedBox(height: 8),
              DropdownButtonFormField<String>(
                value: _selectedMovieId,
                decoration: const InputDecoration(
                  prefixIcon: Icon(Icons.movie_outlined),
                ),
                items: widget.movies.map((movie) {
                  return DropdownMenuItem(
                    value: movie.id,
                    child: Text(
                      movie.title,
                      overflow: TextOverflow.ellipsis,
                    ),
                  );
                }).toList(),
                onChanged: (val) {
                  if (val != null) setState(() => _selectedMovieId = val);
                },
                validator: (value) => value == null ? 'Veuillez sélectionner un film' : null,
              ),

              const SizedBox(height: 20),

              // Field 2: Author Name (TextFormField with length validation)
              const Text(
                'Votre nom ou pseudonyme *',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
              ),
              const SizedBox(height: 8),
              TextFormField(
                controller: _authorController,
                decoration: const InputDecoration(
                  hintText: 'Ex: Alice Dupont ou CineFan92',
                  prefixIcon: Icon(Icons.person_outline_rounded),
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Le nom de l\'auteur est requis.';
                  }
                  if (value.trim().length < 3) {
                    return 'Le pseudonyme doit contenir au moins 3 caractères.';
                  }
                  return null;
                },
              ),

              const SizedBox(height: 20),

              // Field 3: Star Rating (Slider / Rating Bar with interactive display)
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Votre note *',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFFB800).withOpacity(0.2),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.star_rounded, color: Color(0xFFFFB800), size: 18),
                        const SizedBox(width: 4),
                        Text(
                          '${_rating.toStringAsFixed(1)} / 5.0',
                          style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFFFFB800)),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Slider(
                value: _rating,
                min: 1.0,
                max: 5.0,
                divisions: 8,
                activeColor: const Color(0xFFFFB800),
                inactiveColor: Colors.grey[700],
                label: _rating.toStringAsFixed(1),
                onChanged: (val) => setState(() => _rating = val),
              ),

              const SizedBox(height: 16),

              // Field 4: Detailed Review Comment (TextFormField multiline with validation)
              const Text(
                'Votre critique détaillée *',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
              ),
              const SizedBox(height: 8),
              TextFormField(
                controller: _commentController,
                maxLines: 4,
                decoration: const InputDecoration(
                  hintText: 'Qu\'avez-vous pensé de l\'intrigue, des acteurs, de la mise en scène ? (min. 15 caractères)',
                  alignLabelWithHint: true,
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Veuillez écrire quelques lignes de critique.';
                  }
                  if (value.trim().length < 15) {
                    return 'Votre critique doit faire au moins 15 caractères (${value.trim().length}/15).';
                  }
                  return null;
                },
              ),

              const SizedBox(height: 16),

              // Switch Recommandation
              SwitchListTile(
                contentPadding: EdgeInsets.zero,
                title: const Text('Recommanderiez-vous ce film ?', style: TextStyle(fontWeight: FontWeight.w600)),
                subtitle: const Text('Aide les autres cinéphiles à faire leur choix', style: TextStyle(fontSize: 12)),
                value: _recommend,
                activeColor: theme.colorScheme.primary,
                onChanged: (val) => setState(() => _recommend = val),
              ),

              const SizedBox(height: 28),

              // Submit Button
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: theme.colorScheme.primary,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    elevation: 3,
                  ),
                  onPressed: _isSubmitting ? null : _submitForm,
                  icon: _isSubmitting
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                        )
                      : const Icon(Icons.send_rounded),
                  label: Text(
                    _isSubmitting ? 'Publication en cours...' : 'Publier mon avis',
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
              const SizedBox(height: 30),
            ],
          ),
        ),
      ),
    );
  }
}
