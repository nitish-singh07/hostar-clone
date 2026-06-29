import { useEvent } from 'expo';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { usePlayer } from '@/player/usePlayer';
import { palette } from '@/theme/tokens';

/** Centered spinner shown while the player is loading/buffering. */
export function BufferingSpinner() {
  const { player } = usePlayer();
  const statusEvent = useEvent(player, 'statusChange');
  const status = statusEvent?.status ?? player.status;

  if (status !== 'loading') return null;

  return (
    <View style={styles.overlay} pointerEvents="none">
      <ActivityIndicator size="large" color={palette.hotstarBlue} />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
