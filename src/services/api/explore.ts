import { contentItems } from '@/services/mock/content';
import { exploreData } from '@/services/mock/explore';
import type { ContentItem } from '@/types/content';
import type { ExploreData, SearchResults } from '@/types/explore';

const delay = (ms = 550) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getExploreData(): Promise<ExploreData> {
  await delay();
  return exploreData;
}

/** Fields a query is matched against, lowest-effort relevance first. */
function matches(item: ContentItem, query: string): boolean {
  const haystack = [
    item.title,
    item.genre,
    item.languages,
    ...item.tags,
    ...item.cast,
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(query);
}

export async function searchContent(rawQuery: string): Promise<SearchResults> {
  await delay(250);
  const query = rawQuery.trim().toLowerCase();
  const hits = query.length === 0 ? [] : contentItems.filter((item) => matches(item, query));

  const movies = hits.filter((item) => item.kind === 'movie');
  const series = hits.filter((item) => item.kind === 'series');
  const sports = hits.filter((item) => item.kind === 'sport');

  return {
    query: rawQuery,
    movies,
    series,
    sports,
    total: hits.length,
  };
}

export async function getSearchSuggestions(rawQuery: string): Promise<ContentItem[]> {
  await delay(120);
  const query = rawQuery.trim().toLowerCase();
  if (query.length === 0) return [];

  // Title matches rank above genre/tag matches.
  const titleHits = contentItems.filter((item) => item.title.toLowerCase().includes(query));
  const otherHits = contentItems.filter(
    (item) => !item.title.toLowerCase().includes(query) && matches(item, query),
  );

  return [...titleHits, ...otherHits].slice(0, 6);
}
