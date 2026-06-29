import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@search/recent/v1';
const MAX_RECENTS = 10;

export interface RecentSearchesStore {
  /** Synchronous read from the in-memory cache, most-recent-first. */
  list(): string[];
  /** Add a query to the top (de-duped, capped). No-op for blank queries. */
  add(query: string): void;
  remove(query: string): void;
  clear(): void;
  /** Resolves once the cache has hydrated from disk. */
  ready(): Promise<void>;
}

/**
 * AsyncStorage-backed recent-searches store with a synchronous in-memory cache,
 * mirroring `PersistentProgressStore`. Writes are debounced; falls back to a
 * pure in-memory list if AsyncStorage is unavailable (e.g. web/SSR).
 */
class PersistentRecentSearches implements RecentSearchesStore {
  private cache: string[] = [];
  private hydrated: Promise<void>;
  private writeTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.hydrated = this.hydrate();
  }

  private async hydrate(): Promise<void> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as string[];
        if (Array.isArray(parsed)) {
          this.cache = parsed.filter((q) => typeof q === 'string').slice(0, MAX_RECENTS);
        }
      }
    } catch {
      // Best-effort: start with an empty list.
    }
  }

  private scheduleWrite(): void {
    if (this.writeTimer) clearTimeout(this.writeTimer);
    this.writeTimer = setTimeout(() => {
      void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.cache)).catch(() => {});
    }, 600);
  }

  ready(): Promise<void> {
    return this.hydrated;
  }

  list(): string[] {
    return [...this.cache];
  }

  add(query: string): void {
    const trimmed = query.trim();
    if (trimmed.length === 0) return;
    const lower = trimmed.toLowerCase();
    this.cache = [trimmed, ...this.cache.filter((q) => q.toLowerCase() !== lower)].slice(
      0,
      MAX_RECENTS,
    );
    this.scheduleWrite();
  }

  remove(query: string): void {
    const lower = query.toLowerCase();
    this.cache = this.cache.filter((q) => q.toLowerCase() !== lower);
    this.scheduleWrite();
  }

  clear(): void {
    this.cache = [];
    this.scheduleWrite();
  }
}

export const recentSearchesStore: RecentSearchesStore = new PersistentRecentSearches();
