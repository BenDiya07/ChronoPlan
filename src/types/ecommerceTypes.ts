export interface Product {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  category: 'Electronics' | 'Fashion' | 'Audio' | 'Home' | 'Accessories' | string;
  imageUrl: string;
  additionalImages: string[];
  isFeatured?: boolean;
  isFlashSale?: boolean;
  stock: number;
  colors: { name: string; hex: string }[];
  tags: string[];
  specs: { [key: string]: string };
  hasDiscount?: boolean;
  discountPercentage?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface CartState {
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  appliedCoupon?: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'Delivered' | 'In Transit' | 'Processing';
  total: number;
  itemsCount: number;
  items?: { title: string; quantity: number; price: number; imageUrl: string }[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  memberTier: 'Gold Member' | 'Platinum Member' | 'VIP';
  rewardPoints: number;
  addresses: { label: string; street: string; city: string; isDefault: boolean }[];
  orders: Order[];
}

export type SortOption = 'popularity' | 'price_asc' | 'price_desc' | 'rating' | 'newest';

export interface FilterState {
  searchQuery: string;
  selectedCategory: string; // 'All' or specific category
  minPrice?: number;
  maxPrice: number;
  minRating?: number;
  sortBy: SortOption;
  inStockOnly?: boolean;
  onlyInStock?: boolean;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
  isLoggedIn: boolean;
}

export interface NetworkLog {
  id: string;
  timestamp: string;
  method: 'GET' | 'POST';
  endpoint: string;
  status: number;
  bearerInjected: boolean;
  cachedInHive: boolean;
  durationMs: number;
}

export type MainView = 'simulator' | 'inspector' | 'code' | 'rubric';
export type DeviceMode = 'mobile' | 'tablet' | 'desktop';
export type ActiveScreen = 'home' | 'catalog' | 'detail' | 'cart' | 'favorites' | 'profile' | 'login' | 'checkout_success';

