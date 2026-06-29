import { config } from '@tamagui/config/v3';
import { createTamagui } from 'tamagui';

export const tamaguiConfig = createTamagui(config);

export type AppTamaguiConfig = typeof tamaguiConfig;

declare module 'tamagui' {
  // Tamagui expects declaration merging for the app config type.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TamaguiCustomConfig extends AppTamaguiConfig {}
}
