import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class CheckoutSuccessScreen extends StatelessWidget {
  const CheckoutSuccessScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.all(24),
                decoration: const BoxDecoration(
                  color: Color(0xFF10B981),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.check_rounded, size: 64, color: Colors.white),
              ),
              const SizedBox(height: 24),
              const Text(
                'Commande Confirmée !',
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              const Text(
                'Merci pour votre achat sur ShopVerse. Vous recevrez un email avec le numéro de suivi de livraison.',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.grey),
              ),
              const SizedBox(height: 32),
              ElevatedButton.icon(
                onPressed: () => context.go('/'),
                icon: const Icon(Icons.shopping_bag_outlined),
                label: const Text('Continuer mes achats'),
              ),
              const SizedBox(height: 12),
              OutlinedButton(
                onPressed: () => context.go('/profile'),
                child: const Text('Voir mes commandes'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
