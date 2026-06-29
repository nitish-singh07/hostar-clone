import { router } from 'expo-router';

import type { ContentItem } from '@/types/content';

export function findContentById(items: ContentItem[], id: string) {
  return items.find((item) => item.id === id);
}

export function getMetaLine(item: ContentItem) {
  return `${item.year} • ${item.ageRating} • ${item.languages} • ${item.genre}`;
}

/** Navigate to the collection screen showing every item in a section. */
export function openCollection(title: string, items: ContentItem[]) {
  router.push({
    pathname: '/collection',
    params: { title, ids: items.map((item) => item.id).join(',') },
  });
}
