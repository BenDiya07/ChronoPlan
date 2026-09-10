import { Product, UserProfile } from '../types/ecommerceTypes';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'Sony WH-1000XM5 Wireless ANC',
    subtitle: 'Casque à réduction de bruit active haute résolution',
    description: 'Le casque sans fil Sony WH-1000XM5 réinvente l\'écoute sans distraction grâce à ses deux processeurs contrôlant 8 microphones pour une réduction du bruit exceptionnelle. Profitez d\'un confort ultra-léger et de 30 heures d\'autonomie.',
    price: 349.99,
    originalPrice: 399.99,
    rating: 4.9,
    reviewCount: 428,
    category: 'Audio',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80'
    ],
    isFeatured: true,
    isFlashSale: true,
    stock: 18,
    colors: [
      { name: 'Noir Minéral', hex: '#1C1C1E' },
      { name: 'Argent Platine', hex: '#E5E5EA' },
      { name: 'Bleu Minuit', hex: '#1E293B' },
    ],
    tags: ['Best Seller', 'ANC', 'Hi-Res Audio', 'Bluetooth 5.2'],
    specs: {
      'Autonomie': 'Jusqu\'à 30 heures',
      'Poids': '250 g',
      'Connexion': 'Bluetooth 5.2 & Jack 3.5mm',
      'Charge rapide': '3 min de charge = 3h d\'écoute',
      'Microphone': '8 micros avec filtrage IA'
    }
  },
  {
    id: 'prod-2',
    title: 'Apple Watch Ultra 2 Titanium 49mm',
    subtitle: 'Montre connectée sportive GPS + Cellular',
    description: 'Conçue pour les athlètes de l\'extrême et les explorateurs. Boîtier en titane robuste de 49 mm, écran Retina toujours activé le plus lumineux d\'Apple (3 000 nits) et autonomie prolongée jusqu\'à 72 heures en mode économie.',
    price: 799.00,
    originalPrice: 899.00,
    rating: 4.8,
    reviewCount: 310,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80'
    ],
    isFeatured: true,
    isFlashSale: false,
    stock: 12,
    colors: [
      { name: 'Titane Naturel', hex: '#D1D5DB' },
      { name: 'Boucle Trail Orange', hex: '#EA580C' },
      { name: 'Bracelet Océan Noir', hex: '#111827' }
    ],
    tags: ['GPS Double Fréquence', 'Étanche 100m', 'Plongée'],
    specs: {
      'Taille du boîtier': '49 mm Titane Grade 5',
      'Écran': 'OLED Retina 3000 nits',
      'Étanchéité': '100 mètres (ISO 22810)',
      'Capteurs': 'ECG, Oxygène sanguin, Température'
    }
  },
  {
    id: 'prod-3',
    title: 'Nike Air Max Pulse Roam',
    subtitle: 'Baskets Urbaines Respirantes Amorti Max Air',
    description: 'Inspirée de la scène musicale underground, la Nike Air Max Pulse Roam allie durabilité robuste et confort urbain avec un point d\'amorti Air réactif enveloppé sous le talon.',
    price: 159.99,
    originalPrice: 179.99,
    rating: 4.7,
    reviewCount: 185,
    category: 'Fashion',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80'
    ],
    isFeatured: false,
    isFlashSale: true,
    stock: 24,
    colors: [
      { name: 'Rouge Crimson', hex: '#DC2626' },
      { name: 'Gris Loup', hex: '#6B7280' },
      { name: 'Noir Phantom', hex: '#18181B' }
    ],
    tags: ['Air Max', 'Streetwear', 'Confort'],
    specs: {
      'Semelle intermédiaire': 'Mousse avec unité Air intégrée',
      'Matière tige': 'Mesh aéré et renforts cuir',
      'Usage': 'Lifestyle / Ville'
    }
  },
  {
    id: 'prod-4',
    title: 'Fujifilm X-T5 Mirrorless Camera',
    subtitle: 'Appareil photo hybride 40.2 MP 4K/60p',
    description: 'Capteur X-Trans CMOS 5 HR de 40,2 mégapixels, stabilisation d\'image sur 5 axes jusqu\'à 7 stops, et molettes analogiques classiques pour une expérience photographique tactile et pure.',
    price: 1699.00,
    originalPrice: 1899.00,
    rating: 4.95,
    reviewCount: 94,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80'
    ],
    isFeatured: true,
    isFlashSale: false,
    stock: 5,
    colors: [
      { name: 'Noir Classique', hex: '#09090B' },
      { name: 'Argent Rétro', hex: '#CBD5E1' }
    ],
    tags: ['40.2 MP', 'Stabilisé 5 Axes', 'Simulations de Film'],
    specs: {
      'Capteur': 'APS-C X-Trans CMOS 5 HR',
      'Vidéo': '6.2K/30p & 4K/60p 10-bit',
      'Viseur': 'OLED 3.69 millions de points',
      'Poids': '557 g (avec batterie)'
    }
  },
  {
    id: 'prod-5',
    title: 'Sac à Dos Minimaliste Bellroy Transit 28L',
    subtitle: 'Sac d\'ordinateur étanche et compartiment voyage',
    description: 'Fabriqué à partir de tissu recyclé résistant aux intempéries. Compartiment dédié pour ordinateur portable 16 pouces avec accès rapide, poches zippées discrètes et confort ergonomique dorsal.',
    price: 239.00,
    originalPrice: 269.00,
    rating: 4.85,
    reviewCount: 142,
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'
    ],
    isFeatured: false,
    isFlashSale: false,
    stock: 30,
    colors: [
      { name: 'Noir Ébène', hex: '#27272A' },
      { name: 'Bleu Marine', hex: '#1E3A8A' },
      { name: 'Vert Olive', hex: '#3F6212' }
    ],
    tags: ['Tissu Recyclé', 'Laptop 16"', 'Imperméable'],
    specs: {
      'Capacité': '28 Litres',
      'Dimensions': '530 x 360 x 190 mm',
      'Garantie': '3 ans constructeur'
    }
  },
  {
    id: 'prod-6',
    title: 'Cafetière Espresso Manuelle De\'Longhi Dedica',
    subtitle: 'Machine à expresso compacte 15 bars en inox',
    description: 'Une largeur de seulement 15 cm pour préparer de véritables expressos italiens et cappuccinos crémeux grâce à sa buse vapeur réglable avec technologie Thermoblock.',
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.6,
    reviewCount: 512,
    category: 'Home',
    imageUrl: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80'
    ],
    isFeatured: true,
    isFlashSale: true,
    stock: 15,
    colors: [
      { name: 'Inox Brossé', hex: '#94A3B8' },
      { name: 'Noir Mat', hex: '#18181B' },
      { name: 'Rouge Métal', hex: '#991B1B' }
    ],
    tags: ['15 Bars', 'Thermoblock', 'Buse Cappuccino'],
    specs: {
      'Pression': '15 Bars',
      'Capacité réservoir': '1.1 Litres',
      'Puissance': '1300 W',
      'Arrêt automatique': 'Oui'
    }
  },
  {
    id: 'prod-7',
    title: 'Lunettes de Soleil Ray-Ban Meta Wayfarer Smart',
    subtitle: 'Lunettes intelligentes avec caméra 12 MP & Audio ouvert',
    description: 'Capturez des photos 12 MP et vidéos 1080p en mains-libres, écoutez de la musique et passez des appels avec 5 microphones intégrés et haut-parleurs personnalisés en branches.',
    price: 329.00,
    rating: 4.75,
    reviewCount: 98,
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80'
    ],
    isFeatured: false,
    isFlashSale: false,
    stock: 8,
    colors: [
      { name: 'Noir Brillant / Vert G-15', hex: '#000000' },
      { name: 'Écaille Matte / Brun', hex: '#78350F' }
    ],
    tags: ['Caméra 12 MP', 'Audio Directionnel', 'Commandes Vocales'],
    specs: {
      'Caméra': 'Ultra grand angle 12 MP',
      'Vidéo': '1080p à 30 ips',
      'Étui de charge': 'Jusqu\'à 36 heures d\'autonomie'
    }
  },
  {
    id: 'prod-8',
    title: 'Enceinte Portable Marshall Emberton II',
    subtitle: 'Son multidirectionnel True Stereophonic 30+ heures',
    description: 'Son riche, clair et puissant signé Marshall dans un format compact ultra-résistant certifié IP67 (étanche à l\'eau et à la poussière) avec mode Stack pour associer plusieurs enceintes.',
    price: 169.00,
    originalPrice: 179.00,
    rating: 4.88,
    reviewCount: 260,
    category: 'Audio',
    imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80'
    ],
    isFeatured: false,
    isFlashSale: false,
    stock: 22,
    colors: [
      { name: 'Black & Brass', hex: '#B45309' },
      { name: 'Cream Vintage', hex: '#FEF3C7' },
      { name: 'Black Noir', hex: '#18181B' }
    ],
    tags: ['IP67 Waterproof', '30h Autonomie', 'True Stereophonic'],
    specs: {
      'Puissance': '2 amplificateurs classe D 10 W',
      'Autonomie': 'Plus de 30 heures',
      'Norme IP': 'IP67'
    }
  }
];

export const MOCK_USER: UserProfile = {
  id: 'usr-902',
  name: 'Bénit Diyavanga',
  email: 'benitdiyavanga@gmail.com',
  phone: '+33 6 12 34 56 78',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  memberTier: 'Gold Member',
  rewardPoints: 1250,
  addresses: [
    { label: 'Domicile (Principal)', street: '142 Avenue des Champs-Élysées', city: '75008 Paris, France', isDefault: true },
    { label: 'Bureau & Tech Lab', street: '18 Rue de la Paix', city: '75002 Paris, France', isDefault: false }
  ],
  orders: [
    {
      id: 'CMD-84920',
      date: 'Hier à 14:32',
      status: 'In Transit',
      total: 349.99,
      itemsCount: 1,
      items: [
        {
          title: 'Sony WH-1000XM5 Wireless ANC',
          quantity: 1,
          price: 349.99,
          imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80'
        }
      ]
    },
    {
      id: 'CMD-79104',
      date: '18 Août 2026',
      status: 'Delivered',
      total: 239.00,
      itemsCount: 1,
      items: [
        {
          title: 'Sac à Dos Bellroy Transit 28L',
          quantity: 1,
          price: 239.00,
          imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80'
        }
      ]
    }
  ]
};
