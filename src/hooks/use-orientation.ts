import * as ScreenOrientation from 'expo-screen-orientation';
import { useCallback, useEffect, useRef } from 'react';
import { Platform } from 'react-native';

const isSupported = Platform.OS === 'android' || Platform.OS === 'ios';

/**
 * Thin wrapper around expo-screen-orientation that serializes lock calls.
 *
 * `lockAsync` is async, so rapid focus/blur (navigate into and straight back
 * out of the player) can race and leave the app stuck in landscape. We chain
 * every call onto a single promise so they always apply in order.
 */
export function useOrientation() {
  const queueRef = useRef<Promise<unknown>>(Promise.resolve());

  const run = useCallback((fn: () => Promise<unknown>) => {
    if (!isSupported) return Promise.resolve();
    queueRef.current = queueRef.current.then(fn, fn);
    return queueRef.current;
  }, []);

  const lockLandscape = useCallback(
    () => run(() => ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)),
    [run],
  );

  const lockPortrait = useCallback(
    () => run(() => ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)),
    [run],
  );

  const unlock = useCallback(() => run(() => ScreenOrientation.unlockAsync()), [run]);

  return { lockLandscape, lockPortrait, unlock };
}

/**
 * Locks landscape while the calling screen is mounted and restores portrait on
 * unmount. Used by the fullscreen player route.
 */
export function useLandscapeWhileMounted() {
  const { lockLandscape, lockPortrait } = useOrientation();

  useEffect(() => {
    void lockLandscape();
    return () => {
      void lockPortrait();
    };
  }, [lockLandscape, lockPortrait]);
}
