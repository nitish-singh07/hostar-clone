import { useCallback, useEffect, useRef, useState } from 'react';
import { useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated';

const AUTO_HIDE_MS = 3000;

/**
 * Manages player-control visibility with a 3s auto-hide. Opacity is derived
 * from the `shown` state via a reanimated derived value (no manual shared-value
 * mutation), and auto-hide can be paused via `setLocked` while scrubbing or a
 * sheet is open.
 */
export function useControlsVisibility(initiallyVisible = true) {
  const [shown, setShown] = useState(initiallyVisible);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const locked = useRef(false);

  const clear = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const hide = useCallback(() => {
    clear();
    setShown(false);
  }, [clear]);

  const scheduleHide = useCallback(() => {
    clear();
    if (locked.current) return;
    timer.current = setTimeout(() => setShown(false), AUTO_HIDE_MS);
  }, [clear]);

  const reveal = useCallback(() => {
    clear();
    setShown(true);
    scheduleHide();
  }, [clear, scheduleHide]);

  const toggle = useCallback(() => {
    if (shown) hide();
    else reveal();
  }, [shown, hide, reveal]);

  const setLocked = useCallback(
    (value: boolean) => {
      locked.current = value;
      if (value) clear();
      else scheduleHide();
    },
    [clear, scheduleHide],
  );

  useEffect(() => () => clear(), [clear]);

  const progress = useDerivedValue(
    () => withTiming(shown ? 1 : 0, { duration: shown ? 160 : 220 }),
    [shown],
  );
  const style = useAnimatedStyle(() => ({ opacity: progress.value }));

  return { shown, reveal, hide, toggle, setLocked, style };
}
