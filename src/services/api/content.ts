import {
  contentItems,
  homeData,
  playbackConfigs,
  profileData,
  seasonsBySeries,
  sportsData,
} from '@/services/mock/content';
import { progressStore } from '@/services/progress/continueWatching';
import type {
  ContentItem,
  HomeData,
  PlaybackConfig,
  Profile,
  Season,
} from '@/types/content';

const delay = (ms = 650) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getHomeData(): Promise<HomeData> {
  await delay();
  return homeData;
}

export async function getSportsData(): Promise<HomeData> {
  await delay(520);
  return sportsData;
}

export async function getMovieDetails(id: string): Promise<ContentItem> {
  await delay(420);
  const item = contentItems.find((content) => content.id === id);

  if (!item) {
    throw new Error('Content not found');
  }

  return item;
}

export async function getContentByIds(ids: string[]): Promise<ContentItem[]> {
  await delay(420);
  return ids
    .map((id) => contentItems.find((content) => content.id === id))
    .filter((item): item is ContentItem => item != null);
}

export async function getRelatedContent(id: string): Promise<ContentItem[]> {
  await delay(300);
  const current = contentItems.find((content) => content.id === id);

  if (!current) {
    return contentItems.slice(0, 5);
  }

  return contentItems
    .filter((content) => content.id !== id && content.kind === current.kind)
    .concat(contentItems.filter((content) => content.id !== id && content.kind !== current.kind))
    .slice(0, 6);
}

export async function getProfile(): Promise<Profile> {
  await delay(500);
  return profileData;
}

const FALLBACK_CONFIG: PlaybackConfig = {
  contentId: '',
  qualityOptions: [],
  audioTracks: [],
  subtitleTracks: [],
};

export async function getPlaybackConfig(id: string): Promise<PlaybackConfig> {
  await delay(120);
  return playbackConfigs[id] ?? { ...FALLBACK_CONFIG, contentId: id };
}

export async function getSeriesDetail(id: string): Promise<Season[]> {
  await delay(280);
  return seasonsBySeries[id] ?? [];
}

/**
 * Continue Watching feed: live progress records joined with their content,
 * most-recently-watched first. Falls back to the curated mock row when the
 * store is empty (e.g. a fresh install) so the home screen is never bare.
 */
export async function getContinueWatching(): Promise<ContentItem[]> {
  await delay(260);
  await progressStore.ready();
  const records = progressStore.list();

  if (records.length === 0) {
    return contentItems.filter((item) => typeof item.progress === 'number');
  }

  const seed = homeData.sections.find((s) => s.id === 'continue-watching')?.items ?? [];

  const mapped = records
    .map((record): ContentItem | null => {
      const item = contentItems.find((content) => content.id === record.contentId);
      if (!item) return null;
      const seasons = seasonsBySeries[item.id];
      let episodeLabel = item.episodeLabel;
      if (record.episodeId && seasons) {
        for (const season of seasons) {
          const ep = season.episodes.find((e) => e.id === record.episodeId);
          if (ep) {
            episodeLabel = `S${ep.seasonNumber} E${ep.episodeNumber}`;
            break;
          }
        }
      }
      return {
        ...item,
        progress:
          record.durationSeconds > 0 ? record.positionSeconds / record.durationSeconds : 0,
        episodeLabel,
      };
    })
    .filter((item): item is ContentItem => item !== null);

  const extra = seed.filter((s) => !records.some((r) => r.contentId === s.id));
  return mapped.concat(extra).slice(0, 12);
}
