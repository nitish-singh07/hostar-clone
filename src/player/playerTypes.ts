import type {
  AudioTrack,
  ContentItem,
  Episode,
  PlaybackConfig,
  QualityOption,
  SubtitleTrack,
} from '@/types/content';

/** Which surface is currently presenting the shared player instance. */
export type SurfaceMode = 'hidden' | 'mini' | 'fullscreen';

/** Real aspect-ratio modes mapped to `VideoView.contentFit`. */
export type AspectMode = 'contain' | 'cover' | 'fill';

export type PlayerSession = {
  item: ContentItem;
  /** Current episode for series; null for movies/sports. */
  episode: Episode | null;
  /** Ordered episode queue used for prev/next + autoplay. */
  queue: Episode[];
  isLive: boolean;
  config: PlaybackConfig | null;
};

export type CosmeticSelection = {
  quality: QualityOption | null;
  subtitle: SubtitleTrack | null;
  audio: AudioTrack | null;
};

export type OpenTitleOptions = {
  episode?: Episode;
  queue?: Episode[];
  /** Resume position in seconds. */
  startAt?: number;
  autoPlay?: boolean;
  config?: PlaybackConfig | null;
};
