import { useEffect, useState } from 'react';

/**
 * Returns `value` delayed by `delayMs`. Each change resets the timer, so the
 * debounced value only settles once input has been idle for the delay window.
 */
export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
