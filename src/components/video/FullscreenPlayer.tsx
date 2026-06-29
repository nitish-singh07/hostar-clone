import { VideoView } from 'expo-video';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { EndOfVideoOverlay } from '@/components/video/EndOfVideoOverlay';
import { PlayerGestureLayer } from '@/components/video/PlayerGestureLayer';
import { BufferingSpinner } from '@/components/video/controls/BufferingSpinner';
import { PlayerControlsOverlay } from '@/components/video/controls/PlayerControlsOverlay';
import { SkipPill } from '@/components/video/controls/SkipPill';
import { useControlsVisibility } from '@/hooks/use-controls-visibility';
import { usePlayer } from '@/player/usePlayer';

interface FullscreenPlayerProps {
  onOpenSettings: () => void;
}

/**
 * Landscape immersive player shell: video surface + gesture layer +
 * auto-hiding controls. The controls overlay is `box-none` so empty-area
 * touches fall through to the gesture layer beneath it.
 */
export function FullscreenPlayer({ onOpenSettings }: FullscreenPlayerProps) {
  const { player, aspect } = usePlayer();
  const visibility = useControlsVisibility(true);

  return (
    <View style={styles.container}>
      <VideoView
        style={styles.video}
        player={player}
        contentFit={aspect}
        nativeControls={false}
        allowsPictureInPicture
      />

      <PlayerGestureLayer
        onToggleControls={visibility.toggle}
        setControlsLocked={visibility.setLocked}
      />

      <Animated.View
        style={[styles.fill, visibility.style]}
        pointerEvents={visibility.shown ? 'box-none' : 'none'}
      >
        <PlayerControlsOverlay
          onInteract={visibility.reveal}
          onScrubLock={visibility.setLocked}
          onOpenSettings={onOpenSettings}
        />
      </Animated.View>

      <SkipPill />

      <EndOfVideoOverlay />

      <BufferingSpinner />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  video: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  fill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
});
