import AsyncStorage from '@react-native-async-storage/async-storage';

import type { AppPreferences } from '@/types/profile';

const STORAGE_KEY = '@prefs/app/v1';

export const DEFAULT_PREFERENCES: AppPreferences = {
  theme: 'dark',
  appLanguage: 'English',
  autoplayNext: true,
  autoplayPreviews: true,
  dataSaver: false,
  wifiOnly: true,
  pictureInPicture: true,
  backgroundPlayback: false,
  videoQuality: 'Auto',
  audioLanguage: 'Hindi',
  subtitleLanguage: 'English',
  playbackSpeed: '1x',
  notifications: {
    newReleases: true,
    liveSports: true,
    downloadCompleted: true,
    subscriptionAlerts: true,
    promotions: false,
    watchReminders: false,
  },
};

export interface AppPreferencesStore {
  /** Synchronous read from the in-memory cache. */
  get(): AppPreferences;
  /** Shallow-merge a patch (notifications merged one level deeper). */
  set(patch: Partial<AppPreferences>): void;
  reset(): void;
  /** Resolves once the cache has hydrated from disk. */
  ready(): Promise<void>;
}

/**
 * AsyncStorage-backed preferences store with a synchronous in-memory cache,
 * mirroring `PersistentRecentSearches`. Writes are debounced; falls back to a
 * pure in-memory copy if AsyncStorage is unavailable (e.g. web/SSR).
 */
class PersistentAppPreferences implements AppPreferencesStore {
  private cache: AppPreferences = { ...DEFAULT_PREFERENCES };
  private hydrated: Promise<void>;
  private writeTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.hydrated = this.hydrate();
  }

  private async hydrate(): Promise<void> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<AppPreferences>;
        this.cache = {
          ...DEFAULT_PREFERENCES,
          ...parsed,
          notifications: {
            ...DEFAULT_PREFERENCES.notifications,
            ...(parsed.notifications ?? {}),
          },
        };
      }
    } catch {
      // Best-effort: keep defaults.
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

  get(): AppPreferences {
    return this.cache;
  }

  set(patch: Partial<AppPreferences>): void {
    this.cache = {
      ...this.cache,
      ...patch,
      notifications: {
        ...this.cache.notifications,
        ...(patch.notifications ?? {}),
      },
    };
    this.scheduleWrite();
  }

  reset(): void {
    this.cache = { ...DEFAULT_PREFERENCES };
    this.scheduleWrite();
  }
}

export const appPreferencesStore: AppPreferencesStore = new PersistentAppPreferences();
