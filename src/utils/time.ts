/**
 * Format a number of seconds as a human-readable timestamp.
 * Produces `M:SS` under an hour and `H:MM:SS` once the hour mark is reached.
 */
export function formatTime(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) {
    totalSeconds = 0;
  }

  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = Math.floor(totalSeconds % 60);

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format the remaining time of a clip as a negative countdown, e.g. `-3:20`.
 */
export function formatRemaining(currentSeconds: number, durationSeconds: number): string {
  const remaining = Math.max(0, (durationSeconds || 0) - (currentSeconds || 0));
  return `-${formatTime(remaining)}`;
}
