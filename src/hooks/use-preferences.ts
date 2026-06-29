import { useCallback, useEffect, useState } from 'react';

import { appPreferencesStore } from '@/services/preferences/appPreferences';
import type { AppPreferences } from '@/types/profile';

/**
 * Reactive wrapper around the persistent `appPreferencesStore`. Hydrates on
 * mount and keeps local React state in sync with the store so toggles/selects
 * re-render after an update.
 */
export function usePreferences() {
  const [prefs, setPrefs] = useState<AppPreferences>(appPreferencesStore.get());

  useEffect(() => {
    let mounted = true;
    void appPreferencesStore.ready().then(() => {
      if (mounted) setPrefs(appPreferencesStore.get());
    });
    return () => {
      mounted = false;
    };
  }, []);

  const update = useCallback((patch: Partial<AppPreferences>) => {
    appPreferencesStore.set(patch);
    setPrefs(appPreferencesStore.get());
  }, []);

  const reset = useCallback(() => {
    appPreferencesStore.reset();
    setPrefs(appPreferencesStore.get());
  }, []);

  return { prefs, update, reset };
}
