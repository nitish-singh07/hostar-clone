import { useCallback, useEffect, useState } from 'react';

import { recentSearchesStore } from '@/services/search/recentSearches';

/**
 * Reactive wrapper around the persistent `recentSearchesStore`. Hydrates on
 * mount and keeps local React state in sync with the store so the UI re-renders
 * after add/remove/clear.
 */
export function useRecentSearches() {
  const [recents, setRecents] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;
    void recentSearchesStore.ready().then(() => {
      if (mounted) setRecents(recentSearchesStore.list());
    });
    return () => {
      mounted = false;
    };
  }, []);

  const addRecent = useCallback((query: string) => {
    recentSearchesStore.add(query);
    setRecents(recentSearchesStore.list());
  }, []);

  const removeRecent = useCallback((query: string) => {
    recentSearchesStore.remove(query);
    setRecents(recentSearchesStore.list());
  }, []);

  const clearRecents = useCallback(() => {
    recentSearchesStore.clear();
    setRecents(recentSearchesStore.list());
  }, []);

  return { recents, addRecent, removeRecent, clearRecents };
}
