import { DarkTheme, ThemeProvider, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TamaguiProvider } from 'tamagui';

import { PlayerProvider } from '@/player/PlayerProvider';
import { tamaguiConfig } from '@/theme/tamagui.config';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TamaguiProvider config={tamaguiConfig} defaultTheme="dark">
        <ThemeProvider value={DarkTheme}>
          <StatusBar style="light" />
          <PlayerProvider>
            <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="details/[id]" />
              <Stack.Screen name="collection" />
              <Stack.Screen
                name="player"
                options={{ animation: 'fade', gestureEnabled: false }}
              />
            </Stack>
          </PlayerProvider>
        </ThemeProvider>
      </TamaguiProvider>
    </GestureHandlerRootView>
  );
}
