export type ContentKind = 'movie' | 'series' | 'sport';

export type ContentItem = {
  id: string;
  title: string;
  kind: ContentKind;
  year: string;
  ageRating: string;
  languages: string;
  genre: string;
  runtime: string;
  description: string;
  posterUrl: string;
  backdropUrl: string;
  logoText: string;
  rating: string;
  videoUrl?: string;
  progress?: number;
  episodeLabel?: string;
  cast: string[];
  tags: string[];
  /** Series-only: populated by `getSeriesDetail`. */
  seasons?: Season[];
};

export type Episode = {
  id: string;
  seriesId: string;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  runtimeLabel: string;
  videoUrl: string;
  /** Mock markers (seconds) used to demo Skip Intro / Skip Credits pills. */
  introStart?: number;
  introEnd?: number;
  creditsStart?: number;
};

export type Season = {
  id: string;
  seriesId: string;
  seasonNumber: number;
  title: string;
  episodes: Episode[];
};

/**
 * Cosmetic, mock-driven selectors. The sample MP4s expose no real alternate
 * renditions/tracks, so these update player UI state only (clearly labeled as a
 * demo in the settings sheet).
 */
export type QualityOption = {
  id: string;
  label: string;
  height: number;
  isCosmetic: true;
};

export type SubtitleTrack = {
  id: string;
  label: string;
  language: string;
  isCosmetic: true;
};

export type AudioTrack = {
  id: string;
  label: string;
  language: string;
  isCosmetic: true;
};

export type PlaybackConfig = {
  contentId: string;
  introStart?: number;
  introEnd?: number;
  creditsStart?: number;
  isLive?: boolean;
  qualityOptions: QualityOption[];
  audioTracks: AudioTrack[];
  subtitleTracks: SubtitleTrack[];
};

export type ProgressRecord = {
  contentId: string;
  episodeId?: string;
  positionSeconds: number;
  durationSeconds: number;
  updatedAt: number;
  completed: boolean;
};

export type ContentSection = {
  id: string;
  title: string;
  items: ContentItem[];
};

export type HomeData = {
  hero: ContentItem[];
  sections: ContentSection[];
};

export type Profile = {
  name: string;
  plan: string;
  phone: string;
  avatarUrl: string;
  /** Premium account fields (optional so existing fixtures stay valid). */
  email?: string;
  memberSince?: string;
  planStatus?: string;
  planValidTill?: string;
  storageUsedGb?: number;
  storageTotalGb?: number;
  dob?: string;
  gender?: string;
  profiles: {
    id: string;
    name: string;
    avatarUrl: string;
    isKids?: boolean;
  }[];
  watchlist: ContentItem[];
  downloads: ContentItem[];
  recentlyWatched?: ContentItem[];
};
