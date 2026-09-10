export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Movie {
  id: string;
  title: string;
  originalTitle: string;
  releaseYear: number;
  duration: string;
  rating: number;
  reviewCount: number;
  genres: string[];
  director: string;
  cast: string[];
  synopsis: string;
  posterUrl: string;
  backdropUrl: string;
  ageRating: string;
  isFeatured?: boolean;
  reviews: Review[];
  isWatchlisted: boolean;
}

export type DeviceMode = 'mobile' | 'tablet' | 'desktop';
export type AppTab = 'home' | 'explore' | 'add-review' | 'watchlist' | 'detail';
export type MainView = 'simulator' | 'code' | 'rubric';
