import { byId, contentItems } from '@/services/mock/content';
import { palette } from '@/theme/tokens';
import type { ContentSection } from '@/types/content';
import type {
  ExploreData,
  FeaturedCollection,
  GenreTile,
  QuickCategory,
  StudioTile,
} from '@/types/explore';

const image = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;

const trendingSearches: string[] = [
  '#IPL',
  '#Marvel',
  '#Horror',
  '#Anime',
  '#KDrama',
  '#Comedy',
  '#SciFi',
  '#Fantasy',
];

const quickCategories: QuickCategory[] = [
  { id: 'all', label: 'All' },
  { id: 'movies', label: 'Movies', kind: 'movie' },
  { id: 'series', label: 'Series', kind: 'series' },
  { id: 'sports', label: 'Sports', kind: 'sport' },
  { id: 'trending', label: 'Trending' },
];

const featuredCollections: FeaturedCollection[] = [
  {
    id: 'epic-universe',
    title: 'The Epic Universe',
    subtitle: 'Mythology, dragons & dynasties',
    backdropUrl: image('photo-1518709268805-4e9042af2176'),
    items: byId(['mahabharat-ai', 'crown-of-ash', 'kingdom-rush']),
  },
  {
    id: 'hotstar-specials',
    title: 'Hotstar Specials',
    subtitle: 'Originals you can only watch here',
    backdropUrl: image('photo-1489599849927-2ee91cede3ba'),
    items: byId(['night-manager', 'space-gen', 'city-of-shadows']),
  },
  {
    id: 'weekend-binge',
    title: 'Weekend Binge',
    subtitle: 'Press play and lose the weekend',
    backdropUrl: image('photo-1505686994434-e3cc5abf1330'),
    items: byId(['family-table', 'river-hearts', 'laugh-riot']),
  },
];

const sections: ContentSection[] = [
  {
    id: 'trending-now',
    title: 'Trending Now',
    items: byId(['mahabharat-ai', 'phantom-protocol', 'night-manager', 'goal-machine', 'crown-of-ash']),
  },
  {
    id: 'popular-movies',
    title: 'Popular Movies',
    items: byId(['kingdom-rush', 'phantom-protocol', 'wild-blue', 'laugh-riot', 'code-breakers', 'the-haunting-hour']),
  },
  {
    id: 'popular-series',
    title: 'Popular Series',
    items: byId(['night-manager', 'space-gen', 'city-of-shadows', 'crown-of-ash', 'ninja-academy', 'family-table']),
  },
  {
    id: 'new-releases',
    title: 'New Releases',
    items: byId(['phantom-protocol', 'code-breakers', 'tiny-explorers', 'mahabharat-ai']),
  },
  {
    id: 'because-you-watched',
    title: 'Because You Watched City of Shadows',
    items: byId(['night-manager', 'code-breakers', 'the-haunting-hour', 'phantom-protocol']),
  },
];

const genres: GenreTile[] = [
  { id: 'action', name: 'Action', gradient: ['#149BFF', '#1F3A93'], imageUrl: image('photo-1500534314209-a25ddb2bd429') },
  { id: 'comedy', name: 'Comedy', gradient: ['#F7971E', '#FFD200'], imageUrl: image('photo-1543584756-8f40a802e14f') },
  { id: 'drama', name: 'Drama', gradient: ['#8E2DE2', '#4A00E0'], imageUrl: image('photo-1489599849927-2ee91cede3ba') },
  { id: 'sci-fi', name: 'Sci-Fi', gradient: ['#0F2027', '#2C5364'], imageUrl: image('photo-1451187580459-43490279c0fa') },
  { id: 'thriller', name: 'Thriller', gradient: ['#232526', '#414345'], imageUrl: image('photo-1519608487953-e999c86e7455') },
  { id: 'horror', name: 'Horror', gradient: ['#42050B', '#8E0E00'], imageUrl: image('photo-1509248961158-e54f6934749c') },
  { id: 'fantasy', name: 'Fantasy', gradient: [palette.ctaEnd, '#6A0572'], imageUrl: image('photo-1518709268805-4e9042af2176') },
  { id: 'romance', name: 'Romance', gradient: ['#FF512F', '#DD2476'], imageUrl: image('photo-1516589178581-6cd7833ae3b2') },
  { id: 'anime', name: 'Anime', gradient: ['#1FA2FF', '#12D8FA'], imageUrl: image('photo-1578632767115-351597cf2477') },
  { id: 'crime', name: 'Crime', gradient: ['#16222A', '#3A6073'], imageUrl: image('photo-1526374965328-7f61d4dc18c5') },
];

const languages: string[] = [
  'Hindi',
  'English',
  'Tamil',
  'Telugu',
  'Malayalam',
  'Kannada',
  'Punjabi',
  'Marathi',
  'Korean',
  'Japanese',
];

const studios: StudioTile[] = [
  { id: 'marvel', name: 'Marvel', logoText: 'MARVEL', imageUrl: image('photo-1635805737707-575885ab0820') },
  { id: 'pixar', name: 'Pixar', logoText: 'PIXAR', imageUrl: image('photo-1503454537195-1dcabb73ffb9') },
  { id: 'warner', name: 'Warner Bros', logoText: 'WB', imageUrl: image('photo-1485846234645-a62644f84728') },
  { id: 'hbo', name: 'HBO', logoText: 'HBO', imageUrl: image('photo-1505686994434-e3cc5abf1330') },
  { id: 'disney', name: 'Disney', logoText: 'DISNEY', imageUrl: image('photo-1574375927938-d5a98e8ffe85') },
  { id: 'originals', name: 'Hotstar Originals', logoText: 'ORIGINALS', imageUrl: image('photo-1489599849927-2ee91cede3ba') },
];

export const exploreData: ExploreData = {
  trendingSearches,
  quickCategories,
  featuredCollections,
  sections,
  genres,
  languages,
  studios,
  sports: contentItems.filter((item) => item.kind === 'sport'),
};
