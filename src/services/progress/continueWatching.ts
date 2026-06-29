import AsyncStorage from '@react-native-async-storage/async-storage';

import type { ProgressRecord } from '@/types/content';

const STORAGE_KEY = '@cw/progress/v1';

function keyFor(contentId: string, episodeId?: string): string {
  return episodeId ? `${contentId}::${episodeId}` : contentId;
}

export interface ProgressStore {
  /** Synchronous read from the in-memory cache. */
  get(contentId: string, episodeId?: string): ProgressRecord | null;
  upsert(record: ProgressRecord): void;
  /** All records, most-recently-updated first, excluding completed ones. */
  list(): ProgressRecord[];
  remove(contentId: string, episodeId?: string): void;
  /** Resolves once the cache has hydrated from disk. */
  ready(): Promise<void>;
}

/**
 * AsyncStorage-backed store with a synchronous in-memory cache so the player can
 * read a resume position without awaiting. Writes are debounced. Falls back to a
 * pure in-memory implementation if AsyncStorage is unavailable (e.g. web/SSR).
 */
class PersistentProgressStore implements ProgressStore {
  private cache = new Map<string, ProgressRecord>();
  private hydrated: Promise<void>;
  private writeTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.hydrated = this.hydrate();
  }

  private async hydrate(): Promise<void> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, ProgressRecord>;
        for (const [k, v] of Object.entries(parsed)) {
          this.cache.set(k, v);
        }
      }
    } catch {
      // Best-effort: start with an empty cache.
    }
  }

  private scheduleWrite(): void {
    if (this.writeTimer) clearTimeout(this.writeTimer);
    this.writeTimer = setTimeout(() => {
      const obj: Record<string, ProgressRecord> = {};
      for (const [k, v] of this.cache.entries()) obj[k] = v;
      void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(obj)).catch(() => {});
    }, 800);
  }

  ready(): Promise<void> {
    return this.hydrated;
  }

  get(contentId: string, episodeId?: string): ProgressRecord | null {
    return this.cache.get(keyFor(contentId, episodeId)) ?? null;
  }

  upsert(record: ProgressRecord): void {
    this.cache.set(keyFor(record.contentId, record.episodeId), record);
    this.scheduleWrite();
  }

  list(): ProgressRecord[] {
    return Array.from(this.cache.values())
      .filter((r) => !r.completed)
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }

  remove(contentId: string, episodeId?: string): void {
    this.cache.delete(keyFor(contentId, episodeId));
    this.scheduleWrite();
  }
}

export const progressStore: ProgressStore = new PersistentProgressStore();
