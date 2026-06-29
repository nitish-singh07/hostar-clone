import type { ContentItem, ContentKind, ContentSection } from '@/types/content';

/** Large featured banner that groups a curated set of titles. */
export type FeaturedCollection = {
  id: string;
  title: string;
  subtitle: string;
  backdropUrl: string;
  items: ContentItem[];
};

/** Genre browser tile rendered with a gradient + background image. */
export type GenreTile = {
  id: string;
  name: string;
  /** [start, end] colors for the LinearGradient overlay. */
  gradient: [string, string];
  imageUrl: string;
};

/** Studio / banner collection card. */
export type StudioTile = {
  id: string;
  name: string;
  logoText: string;
  imageUrl: string;
};

/**
 * Horizontal pill above the browse feed. `kind` filters the browse content by
 * content type; `undefined` (e.g. "All", "Trending") shows everything.
 */
export type QuickCategory = {
  id: string;
  label: string;
  kind?: ContentKind;
};

/** Search results grouped by content kind for the grouped result layout. */
export type SearchResults = {
  query: string;
  movies: ContentItem[];
  series: ContentItem[];
  sports: ContentItem[];
  total: number;
};

/** Everything the Explore browse experience renders. */
export type ExploreData = {
  trendingSearches: string[];
  quickCategories: QuickCategory[];
  featuredCollections: FeaturedCollection[];
  sections: ContentSection[];
  genres: GenreTile[];
  languages: string[];
  studios: StudioTile[];
  sports: ContentItem[];
};

/** Active selections in the filter bottom sheet. */
export type ExploreFilters = {
  kinds: ContentKind[];
  genres: string[];
  languages: string[];
  years: string[];
  ageRatings: string[];
  sort: SortOption;
};

export type SortOption = 'trending' | 'popular' | 'rating' | 'newest' | 'az';
