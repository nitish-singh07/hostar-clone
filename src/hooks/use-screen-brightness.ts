import * as Brightness from 'expo-brightness';
import { useCallback, useEffect, useRef } from 'react';
import { Platform } from 'react-native';

const isSupported = Platform.OS === 'android' || Platform.OS === 'ios';
const clamp = (v: number) => Math.max(0, Math.min(1, v));

/**
 * App-level screen brightness control for the vertical brightness gesture.
 * Remembers the original brightness and restores it when the player unmounts.
 * `setBrightnessAsync` adjusts the current activity's brightness, so no system
 * write permission is required.
 */
export function useScreenBrightness() {
  const original = useRef<number | null>(null);
  const value = useRef(1);

  useEffect(() => {
    if (!isSupported) return;
    let active = true;
    (async () => {
      try {
        const b = await Brightness.getBrightnessAsync();
        if (active) {
          original.current = b;
          value.current = b;
        }
      } catch {
        // Ignore — fall back to a neutral starting value.
      }
    })();

    return () => {
      active = false;
      if (original.current != null) {
        void Brightness.setBrightnessAsync(original.current).catch(() => {});
      }
    };
  }, []);

  const setBrightness = useCallback((next: number) => {
    if (!isSupported) return;
    const c = clamp(next);
    value.current = c;
    void Brightness.setBrightnessAsync(c).catch(() => {});
  }, []);

  const getBrightness = useCallback(() => value.current, []);

  return { setBrightness, getBrightness };
}
