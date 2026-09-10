import React from 'react';
import { 
  Boxes, 
  Activity, 
  Layers, 
  Database, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  ShoppingCart, 
  Heart, 
  Filter, 
  User, 
  Sun, 
  Moon,
  Sparkles,
  ArrowRight,
  Eye
} from 'lucide-react';
import { CartState, FilterState, Product, UserProfile } from '../types/ecommerceTypes';

interface RiverpodStateInspectorProps {
  cartState: CartState;
  favorites: Set<string>;
  filterState: FilterState;
  userProfile: UserProfile;
  isDarkMode: boolean;
  asyncStatus: 'data' | 'loading' | 'error';
  onSimulateStatusChange: (status: 'data' | 'loading' | 'error') => void;
  products: Product[];
}

export const RiverpodStateInspector: React.FC<RiverpodStateInspectorProps> = ({
  cartState,
  favorites,
  filterState,
  userProfile,
  isDarkMode,
  asyncStatus,
  onSimulateStatusChange,
  products,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#0B0C10] text-gray-200">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Summary */}
        <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-[#12141C] to-indigo-950/40 p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40">
              <Boxes size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">Inspecteur d'État Riverpod (Live State)</h2>
                <span className="rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-xs font-mono font-bold text-indigo-400 border border-indigo-500/30">
                  ProviderScope Actif
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Surveillance en temps réel des Providers Riverpod, des états <code className="text-indigo-300">AsyncValue</code> et de la persistance.
              </p>
            </div>
          </div>

          {/* Async State Simulator Controls */}
          <div className="flex items-center gap-2 bg-[#181A24] p-1.5 rounded-xl border border-[#2E3346]">
            <span className="text-[11px] font-mono text-gray-400 px-2">Simuler AsyncValue:</span>
            <button
              onClick={() => onSimulateStatusChange('data')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
                asyncStatus === 'data'
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Data (Ready)
            </button>
            <button
              onClick={() => onSimulateStatusChange('loading')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
                asyncStatus === 'loading'
                  ? 'bg-amber-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Loading
            </button>
            <button
              onClick={() => onSimulateStatusChange('error')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
                asyncStatus === 'error'
                  ? 'bg-rose-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Error (Retry)
            </button>
          </div>
        </div>

        {/* Riverpod Provider Graph & Architecture */}
        <div className="rounded-xl border border-[#2E3346] bg-[#12141C] p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-indigo-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Graphe des Dépendances Riverpod (Computed & Reactive)
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-[#181A24] border border-[#2E3346] space-y-1">
              <span className="text-indigo-400 font-bold">1. Source Async</span>
              <p className="text-gray-300">productsFutureProvider</p>
              <span className="text-[10px] text-gray-500">FutureProvider&lt;List&lt;Product&gt;&gt;</span>
            </div>
            <div className="p-3 rounded-lg bg-[#181A24] border border-[#2E3346] space-y-1">
              <span className="text-amber-400 font-bold">2. State Notifier</span>
              <p className="text-gray-300">filterStateProvider</p>
              <span className="text-[10px] text-gray-500">StateNotifierProvider&lt;FilterState&gt;</span>
            </div>
            <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/40 space-y-1">
              <span className="text-emerald-400 font-bold">3. Computed Provider</span>
              <p className="text-white font-bold">filteredProductsProvider</p>
              <span className="text-[10px] text-gray-400">Provider&lt;AsyncValue&lt;List&lt;Product&gt;&gt;&gt;</span>
            </div>
          </div>
        </div>

        {/* Active Providers Real-time Inspector Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Provider 1: Cart Provider */}
          <div className="rounded-xl border border-[#2E3346] bg-[#12141C] p-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#2E3346] pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
                    <ShoppingCart size={15} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white font-mono">cartProvider</h4>
                    <span className="text-[10px] text-gray-400">StateNotifierProvider</span>
                  </div>
                </div>
                <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-indigo-300">
                  {cartState.items.reduce((s, i) => s + i.quantity, 0)} articles
                </span>
              </div>

              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-gray-400">
                  <span>Sous-total :</span>
                  <span className="text-white font-bold">${cartState.subtotal.toFixed(2)}</span>
                </div>
                {cartState.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Remise ({cartState.appliedCoupon}) :</span>
                    <span>-${cartState.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-400">
                  <span>Livraison :</span>
                  <span className="text-emerald-400">Gratuite ($0.00)</span>
                </div>
                <div className="flex justify-between border-t border-[#2E3346] pt-1 text-white font-bold">
                  <span>Total :</span>
                  <span className="text-indigo-400 font-black">${cartState.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-[#2E3346]/60 text-[10px] text-gray-500 font-mono flex items-center justify-between">
              <span>Methods: addItem, removeItem, updateQty</span>
            </div>
          </div>

          {/* Provider 2: Favorites Provider */}
          <div className="rounded-xl border border-[#2E3346] bg-[#12141C] p-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#2E3346] pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400">
                    <Heart size={15} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white font-mono">favoritesProvider</h4>
                    <span className="text-[10px] text-gray-400">StateNotifierProvider (Persisted)</span>
                  </div>
                </div>
                <span className="rounded bg-rose-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-rose-300">
                  {favorites.size} favoris
                </span>
              </div>

              <div className="space-y-1 text-xs font-mono">
                <div className="text-gray-400 text-[11px]">Storage Repository :</div>
                <div className="rounded bg-[#181A24] p-2 text-[11px] text-gray-300 break-all border border-[#2E3346]">
                  {favorites.size > 0
                    ? JSON.stringify(Array.from(favorites))
                    : '<Aucun favori enregistré (Set vide)>'}
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-[#2E3346]/60 text-[10px] text-gray-500 font-mono flex items-center justify-between">
              <span>Persistance: SharedPreferences</span>
              <span className="text-emerald-400">✓ Sync</span>
            </div>
          </div>

          {/* Provider 3: Filter State Provider */}
          <div className="rounded-xl border border-[#2E3346] bg-[#12141C] p-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#2E3346] pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                    <Filter size={15} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white font-mono">filterStateProvider</h4>
                    <span className="text-[10px] text-gray-400">StateNotifierProvider</span>
                  </div>
                </div>
                <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-amber-300">
                  {filterState.selectedCategory}
                </span>
              </div>

              <div className="space-y-1 text-xs font-mono text-gray-300">
                <div className="flex justify-between">
                  <span className="text-gray-400">Recherche :</span>
                  <span>{filterState.searchQuery || '<Vide>'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Prix max :</span>
                  <span>${filterState.maxPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tri :</span>
                  <span className="text-amber-400">{filterState.sortBy}</span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-[#2E3346]/60 text-[10px] text-gray-500 font-mono flex items-center justify-between">
              <span>Connecté à filteredProductsProvider</span>
            </div>
          </div>

          {/* Provider 4: User Profile Provider */}
          <div className="rounded-xl border border-[#2E3346] bg-[#12141C] p-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#2E3346] pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                    <User size={15} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white font-mono">userProfileProvider</h4>
                    <span className="text-[10px] text-gray-400">StateNotifierProvider</span>
                  </div>
                </div>
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-300">
                  {userProfile.memberTier}
                </span>
              </div>

              <div className="space-y-1 text-xs font-mono text-gray-300">
                <div className="flex justify-between">
                  <span className="text-gray-400">Nom :</span>
                  <span>{userProfile.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Points récompenses :</span>
                  <span className="text-amber-400">{userProfile.rewardPoints} pts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Commandes :</span>
                  <span className="text-white font-bold">{userProfile.orders.length} commandes</span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-[#2E3346]/60 text-[10px] text-gray-500 font-mono flex items-center justify-between">
              <span>Action: addOrderFromCart</span>
            </div>
          </div>

          {/* Provider 5: Products FutureProvider */}
          <div className="rounded-xl border border-[#2E3346] bg-[#12141C] p-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#2E3346] pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
                    <Database size={15} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white font-mono">productsFutureProvider</h4>
                    <span className="text-[10px] text-gray-400">FutureProvider &lt;List&lt;Product&gt;&gt;</span>
                  </div>
                </div>
                <span className="rounded bg-purple-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-purple-300">
                  {asyncStatus.toUpperCase()}
                </span>
              </div>

              <div className="space-y-1.5 text-xs font-mono text-gray-300">
                <div className="flex justify-between">
                  <span className="text-gray-400">AsyncValue state :</span>
                  <span className={asyncStatus === 'data' ? 'text-emerald-400' : asyncStatus === 'loading' ? 'text-amber-400' : 'text-rose-400'}>
                    AsyncValue.{asyncStatus}()
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Catalogue brut :</span>
                  <span>{products.length} produits</span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-[#2E3346]/60 text-[10px] text-gray-500 font-mono flex items-center justify-between">
              <span>AsyncValue.when(data, loading, error)</span>
            </div>
          </div>

          {/* Provider 6: Theme Mode Provider */}
          <div className="rounded-xl border border-[#2E3346] bg-[#12141C] p-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#2E3346] pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                    {isDarkMode ? <Moon size={15} /> : <Sun size={15} />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white font-mono">themeModeProvider</h4>
                    <span className="text-[10px] text-gray-400">StateNotifierProvider</span>
                  </div>
                </div>
                <span className="rounded bg-blue-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-blue-300">
                  {isDarkMode ? 'ThemeMode.dark' : 'ThemeMode.light'}
                </span>
              </div>

              <div className="space-y-1 text-xs font-mono text-gray-300">
                <div className="flex justify-between">
                  <span className="text-gray-400">Palette actuelle :</span>
                  <span>{isDarkMode ? 'Obsidian & Indigo' : 'Clean Soft White'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Material Design :</span>
                  <span className="text-emerald-400">Material 3</span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-[#2E3346]/60 text-[10px] text-gray-500 font-mono flex items-center justify-between">
              <span>Method: toggleTheme()</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
