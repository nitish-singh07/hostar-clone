import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { BackHandler, StatusBar, StyleSheet, View } from 'react-native';

import { FullscreenPlayer } from '@/components/video/FullscreenPlayer';
import { SettingsSheet } from '@/components/video/settings/SettingsSheet';
import { useOrientation } from '@/hooks/use-orientation';
import { usePlayer } from '@/player/usePlayer';

export default function PlayerScreen() {
  const { lockLandscape, lockPortrait } = useOrientation();
  const { minimize } = usePlayer();
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Lock landscape only while this screen is focused; restore portrait on blur.
  useFocusEffect(
    useCallback(() => {
      void lockLandscape();

      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        minimize();
        return true;
      });

      return () => {
        void lockPortrait();
        sub.remove();
      };
    }, [lockLandscape, lockPortrait, minimize]),
  );

  return (
    <View style={styles.root}>
      <StatusBar hidden />
      <FullscreenPlayer onOpenSettings={() => setSettingsOpen(true)} />
      <SettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
});
