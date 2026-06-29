import { useContext } from 'react';

import { PlayerContext, type PlayerContextValue } from '@/player/PlayerProvider';

export function usePlayer(): PlayerContextValue {
  const ctx = useContext(PlayerContext);
  if (!ctx) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return ctx;
}
