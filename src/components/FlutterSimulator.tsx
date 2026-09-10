import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Compass, 
  ShoppingCart, 
  Heart, 
  User, 
  Search, 
  SlidersHorizontal, 
  Star, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  Moon, 
  Sun, 
  TrendingUp, 
  Clock, 
  Tag, 
  ShieldCheck, 
  RotateCcw, 
  Truck, 
  Package,
  Layers,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  LayoutGrid,
  List
} from 'lucide-react';
import { 
  Product, 
  CartItem, 
  CartState, 
  FilterState, 
  UserProfile, 
  ActiveScreen, 
  DeviceMode,
  SortOption
} from '../types/ecommerceTypes';

interface FlutterSimulatorProps {
  products: Product[];
  cartState: CartState;
  favorites: Set<string>;
  filterState: FilterState;
  userProfile: UserProfile;
  isDarkMode: boolean;
  asyncStatus: 'data' | 'loading' | 'error';
  deviceMode: DeviceMode;
  onAddToCart: (product: Product, quantity?: number, color?: string) => void;
  onUpdateCartQuantity: (productId: string, quantity: number, color?: string) => void;
  onRemoveFromCart: (productId: string, color?: string) => void;
  onApplyCoupon: (code: string) => boolean;
  onRemoveCoupon: () => void;
  onClearCart: () => void;
  onToggleFavorite: (productId: string) => void;
  onClearFavorites: () => void;
  onUpdateFilter: (updates: Partial<FilterState>) => void;
  onResetFilter: () => void;
  onCheckout: () => void;
  onToggleTheme: () => void;
  onRetryAsync: () => void;
}

export const FlutterSimulator: React.FC<FlutterSimulatorProps> = ({
  products,
  cartState,
  favorites,
  filterState,
  userProfile,
  isDarkMode,
  asyncStatus,
  deviceMode,
  onAddToCart,
  onUpdateCartQuantity,
  onRemoveFromCart,
  onApplyCoupon,
  onRemoveCoupon,
  onClearCart,
  onToggleFavorite,
  onClearFavorites,
  onUpdateFilter,
  onResetFilter,
  onCheckout,
  onToggleTheme,
  onRetryAsync,
}) => {
  const [currentScreen, setCurrentScreen] = useState<ActiveScreen>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);
  const [detailQuantity, setDetailQuantity] = useState<number>(1);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [couponInput, setCouponInput] = useState<string>('');
  const [couponToast, setCouponToast] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isGridView, setIsGridView] = useState<boolean>(true);
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);

  const categories = ['All', 'Audio', 'Electronics', 'Fashion', 'Accessories', 'Home'];

  // Trigger brief toast message
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  // Filtered and Sorted Products (Computed via Riverpod logic)
  const filteredProducts = products.filter((product) => {
    if (filterState.searchQuery.trim()) {
      const q = filterState.searchQuery.toLowerCase();
      const matchTitle = product.title.toLowerCase().includes(q);
      const matchSub = product.subtitle.toLowerCase().includes(q);
      const matchCat = product.category.toLowerCase().includes(q);
      const matchTag = product.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchSub && !matchCat && !matchTag) return false;
    }
    if (filterState.selectedCategory !== 'All' && product.category !== filterState.selectedCategory) {
      return false;
    }
    if (product.price > filterState.maxPrice) return false;
    return true;
  });

  // Sort logic
  filteredProducts.sort((a, b) => {
    if (filterState.sortBy === 'price_asc') return a.price - b.price;
    if (filterState.sortBy === 'price_desc') return b.price - b.price;
    if (filterState.sortBy === 'rating') return b.rating - a.rating;
    if (filterState.sortBy === 'newest') return b.stock - a.stock;
    return b.reviewCount - a.reviewCount; // popularity
  });

  const featuredProducts = products.filter((p) => p.isFeatured);
  const flashSaleProducts = products.filter((p) => p.isFlashSale);
  const favoriteProducts = products.filter((p) => favorites.has(p.id));

  const totalCartCount = cartState.items.reduce((sum, item) => sum + item.quantity, 0);

  // Selected product object
  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  const handleApplyCouponCode = () => {
    const success = onApplyCoupon(couponInput);
    if (success) {
      setCouponToast('Code promo appliqué avec succès !');
      setCouponInput('');
    } else {
      setCouponToast('Code invalide. Essayez SAVE20 ou WELCOME10.');
    }
    setTimeout(() => setCouponToast(null), 3000);
  };

  const handleSimulateCheckout = () => {
    if (cartState.items.length === 0) return;
    setIsCheckingOut(true);
    setTimeout(() => {
      onCheckout();
      setIsCheckingOut(false);
      setCurrentScreen('checkout_success');
    }, 700);
  };

  // App Theme Palette
  const bgClass = isDarkMode ? 'bg-[#0B0C10] text-gray-100' : 'bg-[#F8F9FC] text-gray-900';
  const cardBgClass = isDarkMode ? 'bg-[#181A24] border-[#2E3346]' : 'bg-white border-gray-200 shadow-sm';
  const inputBgClass = isDarkMode ? 'bg-[#12141C] border-[#2E3346]' : 'bg-gray-100 border-gray-300';

  const isTablet = deviceMode === 'tablet';

  return (
    <div className={`relative flex h-full w-full select-none overflow-hidden font-sans ${bgClass}`}>
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xl animate-bounce">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Layout (NavigationRail on tablet or BottomBar on mobile) */}
      <div className="flex flex-1 overflow-hidden">
        {/* Tablet NavigationRail */}
        {isTablet && (
          <div className={`w-20 flex-shrink-0 flex flex-col items-center py-6 border-r ${isDarkMode ? 'bg-[#12141C] border-[#2E3346]' : 'bg-white border-gray-200'}`}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white mb-8 shadow-md">
              <ShoppingBagIcon />
            </div>

            <div className="flex flex-col gap-5">
              <NavButton
                active={currentScreen === 'home'}
                onClick={() => setCurrentScreen('home')}
                icon={<Home size={20} />}
                label="Accueil"
              />
              <NavButton
                active={currentScreen === 'catalog'}
                onClick={() => setCurrentScreen('catalog')}
                icon={<Compass size={20} />}
                label="Catalogue"
              />
              <NavButton
                active={currentScreen === 'cart'}
                onClick={() => setCurrentScreen('cart')}
                icon={<ShoppingCart size={20} />}
                label="Panier"
                badge={totalCartCount > 0 ? totalCartCount : undefined}
              />
              <NavButton
                active={currentScreen === 'favorites'}
                onClick={() => setCurrentScreen('favorites')}
                icon={<Heart size={20} />}
                label="Favoris"
                badge={favorites.size > 0 ? favorites.size : undefined}
              />
              <NavButton
                active={currentScreen === 'profile'}
                onClick={() => setCurrentScreen('profile')}
                icon={<User size={20} />}
                label="Profil"
              />
            </div>

            <div className="mt-auto">
              <button
                onClick={onToggleTheme}
                className="p-2.5 rounded-xl hover:bg-gray-800/40 text-gray-400 hover:text-white transition"
              >
                {isDarkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
              </button>
            </div>
          </div>
        )}

        {/* Viewport Screen Content */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* SCREEN: HOME */}
          {currentScreen === 'home' && (
            <div className="flex-1 overflow-y-auto flex flex-col pb-20">
              {/* Home Header */}
              <div className={`px-4 pt-4 pb-3 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md ${isDarkMode ? 'bg-[#0B0C10]/80' : 'bg-[#F8F9FC]/80'}`}>
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow">
                    S
                  </div>
                  <div>
                    <h1 className="text-base font-black tracking-tight leading-none">ShopVerse</h1>
                    <span className="text-[10px] text-indigo-400 font-mono font-semibold">Riverpod 2.5+</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentScreen('cart')}
                    className="relative p-2 rounded-xl border border-[#2E3346]/40 hover:bg-gray-800/20 text-gray-300"
                  >
                    <ShoppingCart size={18} />
                    {totalCartCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">
                        {totalCartCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Hero Banner with Gradient */}
              <div className="px-4 py-2">
                <div className="rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 p-5 text-white shadow-xl relative overflow-hidden">
                  <div className="relative z-10 max-w-[70%]">
                    <span className="rounded-md bg-white/20 px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase">
                      Offre Riverpod State
                    </span>
                    <h2 className="mt-1.5 text-lg font-black leading-tight">
                      Jusqu'à -20% sur la sélection Audio & Tech
                    </h2>
                    <p className="mt-1 text-[11px] text-indigo-100">
                      Code promo : <span className="font-mono font-bold text-amber-300">SAVE20</span>
                    </p>
                    <button
                      onClick={() => {
                        onUpdateFilter({ selectedCategory: 'All' });
                        setCurrentScreen('catalog');
                      }}
                      className="mt-3 rounded-lg bg-white px-3.5 py-1.5 text-xs font-bold text-indigo-900 shadow hover:bg-indigo-50 active:scale-95 transition"
                    >
                      Explorer le catalogue
                    </button>
                  </div>
                  <div className="absolute -right-4 -bottom-4 opacity-30 pointer-events-none">
                    <ShoppingBagIcon size={120} />
                  </div>
                </div>
              </div>

              {/* Flash Sales Horizontal Carousel */}
              <div className="mt-3 px-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-amber-400 font-black text-sm">⚡ Ventes Flash</span>
                    <span className="rounded bg-amber-500/20 text-amber-300 px-1.5 py-0.5 text-[9px] font-mono font-bold">
                      Limité
                    </span>
                  </div>
                  <button
                    onClick={() => setCurrentScreen('catalog')}
                    className="text-xs text-indigo-400 font-semibold hover:underline"
                  >
                    Voir tout
                  </button>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {flashSaleProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        setSelectedProductId(product.id);
                        setCurrentScreen('detail');
                      }}
                      className={`w-36 flex-shrink-0 cursor-pointer rounded-xl border p-2 flex flex-col justify-between transition hover:scale-[1.02] ${cardBgClass}`}
                    >
                      <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-black/40">
                        <img src={product.imageUrl} alt={product.title} className="h-full w-full object-cover" />
                        <span className="absolute top-1 left-1 rounded bg-rose-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
                          -{product.discountPercentage}%
                        </span>
                      </div>
                      <div className="mt-2 space-y-1">
                        <h4 className="text-[11px] font-bold truncate">{product.title}</h4>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-indigo-400">${product.price}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddToCart(product);
                              showToast(`${product.title} ajouté au panier !`);
                            }}
                            className="rounded-md bg-indigo-600 p-1 text-white hover:bg-indigo-500"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Categories Grid */}
              <div className="mt-4 px-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Catégories</h3>
                <div className="grid grid-cols-3 gap-2">
                  {['Audio', 'Electronics', 'Fashion', 'Accessories', 'Home'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        onUpdateFilter({ selectedCategory: cat });
                        setCurrentScreen('catalog');
                      }}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition active:scale-95 ${cardBgClass} hover:border-indigo-500/50`}
                    >
                      <span className="text-xs font-bold">{cat}</span>
                      <span className="text-[10px] text-gray-400">
                        {products.filter((p) => p.category === cat).length} articles
                      </span>
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      onUpdateFilter({ selectedCategory: 'All' });
                      setCurrentScreen('catalog');
                    }}
                    className="p-2.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 flex flex-col items-center justify-center gap-1 text-indigo-400"
                  >
                    <span className="text-xs font-bold">Tout voir</span>
                    <span className="text-[10px]">8 articles</span>
                  </button>
                </div>
              </div>

              {/* Featured Selection */}
              <div className="mt-5 px-4">
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-sm font-bold">Sélection Tendance</h3>
                  <span className="text-[11px] text-gray-400 font-mono">AsyncValue.data</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {featuredProducts.map((product) => (
                    <ProductGridCard
                      key={product.id}
                      product={product}
                      isFavorite={favorites.has(product.id)}
                      onToggleFavorite={() => onToggleFavorite(product.id)}
                      onSelect={() => {
                        setSelectedProductId(product.id);
                        setCurrentScreen('detail');
                      }}
                      onAddToCart={() => {
                        onAddToCart(product);
                        showToast(`${product.title} ajouté au panier !`);
                      }}
                      cardBgClass={cardBgClass}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SCREEN: CATALOG */}
          {currentScreen === 'catalog' && (
            <div className="flex-1 overflow-y-auto flex flex-col pb-20">
              {/* Catalog Top Bar */}
              <div className={`p-4 sticky top-0 z-20 backdrop-blur-md border-b ${isDarkMode ? 'bg-[#0B0C10]/80 border-[#2E3346]' : 'bg-[#F8F9FC]/80 border-gray-200'} space-y-2.5`}>
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-black">Catalogue Produits</h2>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setIsGridView(!isGridView)}
                      className={`p-1.5 rounded-lg border ${cardBgClass} text-gray-300`}
                    >
                      {isGridView ? <List size={16} /> : <LayoutGrid size={16} />}
                    </button>
                    <button
                      onClick={() => setIsFilterModalOpen(true)}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold ${
                        filterState.selectedCategory !== 'All' || filterState.searchQuery || filterState.maxPrice < 2000
                          ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                          : `${cardBgClass} text-gray-300`
                      }`}
                    >
                      <SlidersHorizontal size={14} />
                      <span>Filtres</span>
                    </button>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={filterState.searchQuery}
                    onChange={(e) => onUpdateFilter({ searchQuery: e.target.value })}
                    placeholder="Rechercher par titre, marque, catégorie..."
                    className={`w-full rounded-xl pl-9 pr-8 py-2 text-xs outline-none border focus:border-indigo-500 ${inputBgClass}`}
                  />
                  {filterState.searchQuery && (
                    <button
                      onClick={() => onUpdateFilter({ searchQuery: '' })}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Category Horizontal Pills */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                  {categories.map((cat) => {
                    const isSelected = filterState.selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => onUpdateFilter({ selectedCategory: cat })}
                        className={`rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap transition ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow'
                            : 'bg-gray-800/40 text-gray-400 hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Product Listing with AsyncValue Lifecycle handling */}
              <div className="flex-1 p-4">
                {asyncStatus === 'loading' ? (
                  /* Shimmer Loading Skeleton */
                  <div className="grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map((n) => (
                      <div key={n} className={`rounded-xl p-3 space-y-2.5 animate-pulse ${cardBgClass}`}>
                        <div className="h-28 rounded-lg bg-gray-700/40" />
                        <div className="h-3 w-3/4 rounded bg-gray-700/40" />
                        <div className="h-3 w-1/2 rounded bg-gray-700/40" />
                      </div>
                    ))}
                  </div>
                ) : asyncStatus === 'error' ? (
                  /* Error State with Retry Button */
                  <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-3">
                    <div className="p-3 rounded-full bg-rose-500/20 text-rose-400">
                      <AlertCircle size={36} />
                    </div>
                    <h3 className="text-sm font-bold">Erreur de chargement du catalogue</h3>
                    <p className="text-xs text-gray-400 max-w-xs">
                      Simulation de panne réseau dans `productsFutureProvider`. Cliquez ci-dessous pour réessayer.
                    </p>
                    <button
                      onClick={onRetryAsync}
                      className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-indigo-500"
                    >
                      <RefreshCw size={14} />
                      <span>Réessayer (ref.refresh)</span>
                    </button>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  /* Empty State */
                  <div className="flex flex-col items-center justify-center py-16 text-center space-y-2">
                    <Search size={40} className="text-gray-500" />
                    <h3 className="text-sm font-bold">Aucun produit trouvé</h3>
                    <p className="text-xs text-gray-400">Essayez de modifier vos critères de recherche ou de filtre.</p>
                    <button
                      onClick={onResetFilter}
                      className="mt-2 text-xs font-bold text-indigo-400 hover:underline"
                    >
                      Réinitialiser tous les filtres
                    </button>
                  </div>
                ) : isGridView ? (
                  /* Grid View */
                  <div className="grid grid-cols-2 gap-3">
                    {filteredProducts.map((product) => (
                      <ProductGridCard
                        key={product.id}
                        product={product}
                        isFavorite={favorites.has(product.id)}
                        onToggleFavorite={() => onToggleFavorite(product.id)}
                        onSelect={() => {
                          setSelectedProductId(product.id);
                          setCurrentScreen('detail');
                        }}
                        onAddToCart={() => {
                          onAddToCart(product);
                          showToast(`${product.title} ajouté au panier !`);
                        }}
                        cardBgClass={cardBgClass}
                      />
                    ))}
                  </div>
                ) : (
                  /* List View */
                  <div className="space-y-2.5">
                    {filteredProducts.map((product) => (
                      <ProductListTile
                        key={product.id}
                        product={product}
                        isFavorite={favorites.has(product.id)}
                        onToggleFavorite={() => onToggleFavorite(product.id)}
                        onSelect={() => {
                          setSelectedProductId(product.id);
                          setCurrentScreen('detail');
                        }}
                        onAddToCart={() => {
                          onAddToCart(product);
                          showToast(`${product.title} ajouté au panier !`);
                        }}
                        cardBgClass={cardBgClass}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SCREEN: PRODUCT DETAIL */}
          {currentScreen === 'detail' && selectedProduct && (
            <div className="flex-1 overflow-y-auto flex flex-col pb-24">
              {/* Detail Header Bar */}
              <div className="p-4 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
                <button
                  onClick={() => setCurrentScreen('catalog')}
                  className={`p-2 rounded-xl border ${cardBgClass} text-gray-300 hover:text-white`}
                >
                  <ArrowLeft size={18} />
                </button>

                <button
                  onClick={() => onToggleFavorite(selectedProduct.id)}
                  className={`p-2 rounded-xl border ${cardBgClass} ${
                    favorites.has(selectedProduct.id) ? 'text-rose-500' : 'text-gray-400'
                  }`}
                >
                  <Heart size={18} fill={favorites.has(selectedProduct.id) ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* Product Hero Image */}
              <div className="px-4">
                <div className="aspect-square w-full rounded-2xl overflow-hidden bg-black/40 border border-[#2E3346] shadow-lg">
                  <img
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Info Container */}
              <div className="p-4 space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400 font-mono">
                      {selectedProduct.category}
                    </span>
                    <span className="rounded-md bg-emerald-500/20 text-emerald-400 px-2 py-0.5 text-[10px] font-bold">
                      En stock ({selectedProduct.stock})
                    </span>
                  </div>
                  <h1 className="text-lg font-black leading-tight">{selectedProduct.title}</h1>
                  <p className="text-xs text-gray-400">{selectedProduct.subtitle}</p>
                </div>

                {/* Price & Rating */}
                <div className="flex items-center justify-between border-y border-[#2E3346]/40 py-2.5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black text-indigo-400">${selectedProduct.price.toFixed(2)}</span>
                    {selectedProduct.originalPrice && (
                      <span className="text-xs line-through text-gray-500">
                        ${selectedProduct.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                    <span className="font-bold">{selectedProduct.rating}</span>
                    <span className="text-gray-400">({selectedProduct.reviewCount} avis)</span>
                  </div>
                </div>

                {/* Color Variants */}
                {selectedProduct.colors.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-gray-300">Couleur :</span>
                    <div className="flex gap-2">
                      {selectedProduct.colors.map((c, idx) => (
                        <button
                          key={c.name}
                          onClick={() => setSelectedColorIndex(idx)}
                          className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs transition ${
                            selectedColorIndex === idx
                              ? 'border-indigo-500 bg-indigo-500/20 font-bold text-white'
                              : `${cardBgClass} text-gray-400`
                          }`}
                        >
                          <span className="h-3 w-3 rounded-full border border-white/20" style={{ backgroundColor: c.hex }} />
                          <span>{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="space-y-1.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Description</h3>
                  <p className="text-xs text-gray-300 leading-relaxed">{selectedProduct.description}</p>
                </div>

                {/* Specs */}
                <div className="space-y-1.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Spécifications</h3>
                  <div className={`rounded-xl border p-3 space-y-1.5 text-xs ${cardBgClass}`}>
                    {Object.entries(selectedProduct.specs).map(([key, val]) => (
                      <div key={key} className="flex justify-between text-gray-300">
                        <span className="text-gray-400">{key} :</span>
                        <span className="font-semibold">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sticky Bottom Action Bar */}
              <div className={`fixed bottom-0 left-0 right-0 p-3 border-t backdrop-blur-md flex items-center gap-3 z-30 ${isDarkMode ? 'bg-[#0B0C10]/95 border-[#2E3346]' : 'bg-white/95 border-gray-200'}`}>
                {/* Quantity */}
                <div className="flex items-center rounded-xl border border-[#2E3346] bg-[#12141C] p-1 text-xs">
                  <button
                    onClick={() => setDetailQuantity(Math.max(1, detailQuantity - 1))}
                    className="p-1.5 text-gray-400 hover:text-white"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-2 font-bold">{detailQuantity}</span>
                  <button
                    onClick={() => setDetailQuantity(detailQuantity + 1)}
                    className="p-1.5 text-gray-400 hover:text-white"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => {
                    const color = selectedProduct.colors[selectedColorIndex]?.name;
                    onAddToCart(selectedProduct, detailQuantity, color);
                    showToast(`${detailQuantity}x ${selectedProduct.title} ajouté au panier !`);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 py-2.5 px-4 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:brightness-110 active:scale-98 transition"
                >
                  <ShoppingCart size={16} />
                  <span>Ajouter au panier • ${(selectedProduct.price * detailQuantity).toFixed(2)}</span>
                </button>
              </div>
            </div>
          )}

          {/* SCREEN: CART */}
          {currentScreen === 'cart' && (
            <div className="flex-1 overflow-y-auto flex flex-col pb-24">
              <div className="p-4 flex items-center justify-between border-b border-[#2E3346]/50">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black">Mon Panier</h2>
                  <span className="rounded-full bg-indigo-500/20 text-indigo-400 px-2 py-0.5 text-xs font-mono font-bold">
                    {totalCartCount}
                  </span>
                </div>
                {cartState.items.length > 0 && (
                  <button
                    onClick={onClearCart}
                    className="text-xs text-rose-400 font-semibold hover:underline"
                  >
                    Tout vider
                  </button>
                )}
              </div>

              {cartState.items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
                  <div className="p-4 rounded-full bg-indigo-500/10 text-indigo-400">
                    <ShoppingCart size={48} />
                  </div>
                  <h3 className="text-sm font-bold">Votre panier est vide</h3>
                  <p className="text-xs text-gray-400">Ajoutez des articles depuis le catalogue pour passer commande.</p>
                  <button
                    onClick={() => setCurrentScreen('catalog')}
                    className="mt-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow"
                  >
                    Explorer le catalogue
                  </button>
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {/* Cart Items List */}
                  <div className="space-y-3">
                    {cartState.items.map((item) => (
                      <div
                        key={`${item.product.id}_${item.selectedColor}`}
                        className={`p-3 rounded-xl border flex items-center gap-3 ${cardBgClass}`}
                      >
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.title}
                          className="h-16 w-16 rounded-lg object-cover bg-black/40 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0 space-y-1">
                          <h4 className="text-xs font-bold truncate">{item.product.title}</h4>
                          {item.selectedColor && (
                            <span className="text-[10px] text-gray-400">Couleur: {item.selectedColor}</span>
                          )}
                          <div className="text-xs font-black text-indigo-400">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center rounded-lg border border-[#2E3346] bg-[#12141C] p-0.5 text-xs">
                          <button
                            onClick={() => onUpdateCartQuantity(item.product.id, item.quantity - 1, item.selectedColor)}
                            className="p-1 text-gray-400 hover:text-white"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-1.5 font-bold">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateCartQuantity(item.product.id, item.quantity + 1, item.selectedColor)}
                            className="p-1 text-gray-400 hover:text-white"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => onRemoveFromCart(item.product.id, item.selectedColor)}
                          className="p-1.5 text-gray-400 hover:text-rose-400 transition"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Promo Code Input */}
                  <div className={`p-3 rounded-xl border space-y-2 ${cardBgClass}`}>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Code promo (ex: SAVE20)"
                        className={`flex-1 rounded-lg px-3 py-1.5 text-xs outline-none border ${inputBgClass}`}
                      />
                      <button
                        onClick={handleApplyCouponCode}
                        className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-500"
                      >
                        Appliquer
                      </button>
                    </div>

                    {couponToast && (
                      <p className="text-[11px] text-amber-400 font-semibold">{couponToast}</p>
                    )}

                    {cartState.appliedCoupon && (
                      <div className="flex items-center justify-between text-xs text-emerald-400">
                        <span>Code actif : {cartState.appliedCoupon}</span>
                        <button onClick={onRemoveCoupon} className="text-rose-400 hover:underline">
                          Retirer
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Summary Breakdown */}
                  <div className={`p-3.5 rounded-xl border space-y-2 text-xs font-mono ${cardBgClass}`}>
                    <div className="flex justify-between text-gray-400">
                      <span>Sous-total :</span>
                      <span>${cartState.subtotal.toFixed(2)}</span>
                    </div>
                    {cartState.discount > 0 && (
                      <div className="flex justify-between text-emerald-400">
                        <span>Remise :</span>
                        <span>-${cartState.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-400">
                      <span>Livraison :</span>
                      <span className="text-emerald-400">Gratuite</span>
                    </div>
                    <div className="flex justify-between border-t border-[#2E3346] pt-2 text-sm font-bold text-white">
                      <span>Total TTC :</span>
                      <span className="text-indigo-400 font-black">${cartState.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleSimulateCheckout}
                    disabled={isCheckingOut}
                    className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 py-3 text-xs font-bold text-white shadow-xl hover:brightness-110 active:scale-98 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isCheckingOut ? (
                      <RefreshCw size={16} className="animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck size={16} />
                        <span>Valider la commande (${cartState.total.toFixed(2)})</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* SCREEN: FAVORITES */}
          {currentScreen === 'favorites' && (
            <div className="flex-1 overflow-y-auto flex flex-col pb-20">
              <div className="p-4 flex items-center justify-between border-b border-[#2E3346]/50">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black">Mes Favoris</h2>
                  <span className="rounded-full bg-rose-500/20 text-rose-400 px-2 py-0.5 text-xs font-mono font-bold">
                    {favorites.size}
                  </span>
                </div>
                {favorites.size > 0 && (
                  <button
                    onClick={onClearFavorites}
                    className="text-xs text-rose-400 font-semibold hover:underline"
                  >
                    Tout effacer
                  </button>
                )}
              </div>

              {favoriteProducts.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
                  <div className="p-4 rounded-full bg-rose-500/10 text-rose-400">
                    <Heart size={48} />
                  </div>
                  <h3 className="text-sm font-bold">Aucun favori enregistré</h3>
                  <p className="text-xs text-gray-400">
                    Cliquez sur le cœur sur n'importe quel produit pour le retrouver ici.
                  </p>
                  <button
                    onClick={() => setCurrentScreen('catalog')}
                    className="mt-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow"
                  >
                    Découvrir les produits
                  </button>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{favoriteProducts.length} articles sauvegardés</span>
                    <button
                      onClick={() => {
                        favoriteProducts.forEach((p) => onAddToCart(p));
                        showToast('Tous les favoris ont été ajoutés au panier !');
                      }}
                      className="text-xs text-indigo-400 font-bold hover:underline"
                    >
                      Tout ajouter au panier
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {favoriteProducts.map((product) => (
                      <ProductGridCard
                        key={product.id}
                        product={product}
                        isFavorite={true}
                        onToggleFavorite={() => onToggleFavorite(product.id)}
                        onSelect={() => {
                          setSelectedProductId(product.id);
                          setCurrentScreen('detail');
                        }}
                        onAddToCart={() => {
                          onAddToCart(product);
                          showToast(`${product.title} ajouté au panier !`);
                        }}
                        cardBgClass={cardBgClass}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SCREEN: PROFILE */}
          {currentScreen === 'profile' && (
            <div className="flex-1 overflow-y-auto flex flex-col p-4 pb-20 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black">Mon Profil</h2>
                <button
                  onClick={onToggleTheme}
                  className="flex items-center gap-1.5 rounded-lg border border-[#2E3346] px-2.5 py-1 text-xs text-gray-300"
                >
                  {isDarkMode ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} />}
                  <span>{isDarkMode ? 'Mode Sombre' : 'Mode Clair'}</span>
                </button>
              </div>

              {/* User Identity Card */}
              <div className={`p-4 rounded-2xl border flex items-center gap-3.5 ${cardBgClass}`}>
                <img
                  src={userProfile.avatarUrl}
                  alt={userProfile.name}
                  className="h-14 w-14 rounded-full object-cover border-2 border-indigo-500/40"
                />
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold">{userProfile.name}</h3>
                  <p className="text-xs text-gray-400">{userProfile.email}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="rounded bg-amber-500/20 text-amber-300 px-2 py-0.5 text-[10px] font-bold">
                      👑 {userProfile.memberTier}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {userProfile.rewardPoints} Pts
                    </span>
                  </div>
                </div>
              </div>

              {/* Order History */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Historique des Commandes ({userProfile.orders.length})
                  </h3>
                </div>

                <div className="space-y-2">
                  {userProfile.orders.map((order) => (
                    <div key={order.id} className={`p-3 rounded-xl border space-y-2 ${cardBgClass}`}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold font-mono">{order.id}</span>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-blue-500/20 text-blue-400'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px] text-gray-400">
                        <span>{order.date} • {order.itemsCount} article(s)</span>
                        <span className="font-bold text-white">${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Addresses */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Adresses de Livraison</h3>
                <div className="space-y-1.5">
                  {userProfile.addresses.map((addr) => (
                    <div key={addr.label} className={`p-3 rounded-xl border flex items-center justify-between text-xs ${cardBgClass}`}>
                      <div>
                        <div className="font-bold">{addr.label}</div>
                        <div className="text-gray-400 text-[11px]">{addr.street}, {addr.city}</div>
                      </div>
                      {addr.isDefault && (
                        <span className="rounded bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 text-[9px] font-bold">
                          Par défaut
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SCREEN: CHECKOUT SUCCESS */}
          {currentScreen === 'checkout_success' && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-xl shadow-emerald-500/30">
                <Check size={36} />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-black">Commande Validée !</h2>
                <p className="text-xs text-gray-400 max-w-xs">
                  Votre commande a bien été enregistrée dans `userProfileProvider` et votre panier a été réinitialisé.
                </p>
              </div>
              <div className="flex flex-col gap-2 w-full max-w-xs">
                <button
                  onClick={() => setCurrentScreen('home')}
                  className="rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow hover:bg-indigo-500"
                >
                  Retour à l'accueil
                </button>
                <button
                  onClick={() => setCurrentScreen('profile')}
                  className="rounded-xl border border-[#2E3346] py-2 text-xs font-semibold text-gray-300 hover:text-white"
                >
                  Voir mes commandes
                </button>
              </div>
            </div>
          )}

          {/* Bottom Navigation Bar (Mobile mode only) */}
          {!isTablet && (
            <div className={`absolute bottom-0 left-0 right-0 h-16 border-t backdrop-blur-md flex items-center justify-around z-30 ${isDarkMode ? 'bg-[#0B0C10]/95 border-[#2E3346]' : 'bg-white/95 border-gray-200'}`}>
              <BottomTabButton
                active={currentScreen === 'home'}
                onClick={() => setCurrentScreen('home')}
                icon={<Home size={18} />}
                label="Accueil"
              />
              <BottomTabButton
                active={currentScreen === 'catalog'}
                onClick={() => setCurrentScreen('catalog')}
                icon={<Compass size={18} />}
                label="Catalogue"
              />
              <BottomTabButton
                active={currentScreen === 'cart'}
                onClick={() => setCurrentScreen('cart')}
                icon={<ShoppingCart size={18} />}
                label="Panier"
                badge={totalCartCount > 0 ? totalCartCount : undefined}
              />
              <BottomTabButton
                active={currentScreen === 'favorites'}
                onClick={() => setCurrentScreen('favorites')}
                icon={<Heart size={18} />}
                label="Favoris"
                badge={favorites.size > 0 ? favorites.size : undefined}
              />
              <BottomTabButton
                active={currentScreen === 'profile'}
                onClick={() => setCurrentScreen('profile')}
                icon={<User size={18} />}
                label="Profil"
              />
            </div>
          )}
        </div>
      </div>

      {/* Filter Modal Bottom Sheet */}
      {isFilterModalOpen && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm">
          <div className={`rounded-t-3xl border-t p-5 space-y-4 max-h-[85vh] overflow-y-auto ${cardBgClass}`}>
            <div className="flex items-center justify-between border-b border-[#2E3346] pb-3">
              <h3 className="text-sm font-bold">Filtres & Tri Riverpod</h3>
              <button
                onClick={onResetFilter}
                className="text-xs text-indigo-400 font-semibold hover:underline"
              >
                Réinitialiser
              </button>
            </div>

            {/* Sort Options */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-400">Trier par :</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'popularity', label: 'Popularité' },
                  { id: 'price_asc', label: 'Prix croissant' },
                  { id: 'price_desc', label: 'Prix décroissant' },
                  { id: 'rating', label: 'Meilleures notes' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => onUpdateFilter({ sortBy: s.id as SortOption })}
                    className={`p-2 rounded-lg border text-left font-semibold transition ${
                      filterState.sortBy === s.id
                        ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                        : 'border-[#2E3346] text-gray-400 hover:text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Max Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-gray-400">Prix maximum :</span>
                <span className="font-bold text-indigo-400">${filterState.maxPrice}</span>
              </div>
              <input
                type="range"
                min="100"
                max="2000"
                step="50"
                value={filterState.maxPrice}
                onChange={(e) => onUpdateFilter({ maxPrice: parseFloat(e.target.value) })}
                className="w-full accent-indigo-500"
              />
            </div>

            {/* Close Button */}
            <button
              onClick={() => setIsFilterModalOpen(false)}
              className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow hover:bg-indigo-500"
            >
              Appliquer les filtres
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-component: Product Grid Card
const ProductGridCard: React.FC<{
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onSelect: () => void;
  onAddToCart: () => void;
  cardBgClass: string;
}> = ({ product, isFavorite, onToggleFavorite, onSelect, onAddToCart, cardBgClass }) => {
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded-2xl border p-2.5 flex flex-col justify-between transition hover:border-indigo-500/40 hover:shadow-lg ${cardBgClass}`}
    >
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-black/40">
        <img src={product.imageUrl} alt={product.title} className="h-full w-full object-cover" />
        {product.hasDiscount && (
          <span className="absolute top-1.5 left-1.5 rounded bg-rose-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
            -{product.discountPercentage}%
          </span>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white hover:text-rose-400 transition"
        >
          <Heart size={14} fill={isFavorite ? '#F43F5E' : 'none'} className={isFavorite ? 'text-rose-500' : ''} />
        </button>
      </div>

      <div className="mt-2 space-y-1">
        <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-400 font-mono">
          {product.category}
        </span>
        <h4 className="text-xs font-bold truncate">{product.title}</h4>
        <div className="flex items-center gap-1 text-[10px] text-gray-400">
          <Star size={11} className="fill-amber-400 text-amber-400" />
          <span className="font-bold text-white">{product.rating}</span>
          <span>({product.reviewCount})</span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex flex-col">
            <span className="text-xs font-black text-indigo-400">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-[9px] line-through text-gray-500">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart();
            }}
            className="rounded-lg bg-indigo-600 p-1.5 text-white hover:bg-indigo-500 active:scale-95 transition"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Sub-component: Product List Tile
const ProductListTile: React.FC<{
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onSelect: () => void;
  onAddToCart: () => void;
  cardBgClass: string;
}> = ({ product, isFavorite, onToggleFavorite, onSelect, onAddToCart, cardBgClass }) => {
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded-xl border p-2.5 flex items-center gap-3 transition hover:border-indigo-500/40 ${cardBgClass}`}
    >
      <img
        src={product.imageUrl}
        alt={product.title}
        className="h-16 w-16 rounded-lg object-cover bg-black/40 flex-shrink-0"
      />
      <div className="flex-1 min-w-0 space-y-0.5">
        <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-400 font-mono">
          {product.category}
        </span>
        <h4 className="text-xs font-bold truncate">{product.title}</h4>
        <div className="flex items-center gap-1 text-[10px] text-gray-400">
          <Star size={11} className="fill-amber-400 text-amber-400" />
          <span className="font-bold text-white">{product.rating}</span>
          <span className="font-black text-indigo-400 ml-2">${product.price.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="p-1.5 text-gray-400 hover:text-rose-400"
        >
          <Heart size={16} fill={isFavorite ? '#F43F5E' : 'none'} className={isFavorite ? 'text-rose-500' : ''} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart();
          }}
          className="rounded-lg bg-indigo-600 p-1.5 text-white hover:bg-indigo-500"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
};

// NavButton for Tablet
const NavButton: React.FC<{
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}> = ({ active, onClick, icon, label, badge }) => (
  <button
    onClick={onClick}
    className={`relative flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-semibold transition ${
      active ? 'bg-indigo-600/20 text-indigo-400 font-bold' : 'text-gray-400 hover:text-white'
    }`}
  >
    {icon}
    <span className="text-[10px]">{label}</span>
    {badge !== undefined && (
      <span className="absolute top-0 right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">
        {badge}
      </span>
    )}
  </button>
);

// BottomTabButton for Mobile
const BottomTabButton: React.FC<{
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}> = ({ active, onClick, icon, label, badge }) => (
  <button
    onClick={onClick}
    className={`relative flex flex-col items-center gap-0.5 py-1 px-3 text-xs transition ${
      active ? 'text-indigo-400 font-bold' : 'text-gray-400 hover:text-white'
    }`}
  >
    {icon}
    <span className="text-[10px]">{label}</span>
    {badge !== undefined && (
      <span className="absolute top-0 right-2 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-rose-500 px-0.5 text-[8px] font-bold text-white">
        {badge}
      </span>
    )}
  </button>
);

const ShoppingBagIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);
