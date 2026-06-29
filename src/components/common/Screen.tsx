import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { palette } from '@/theme/tokens';

type ScreenProps = PropsWithChildren<{
  withTopInset?: boolean;
}>;

export function Screen({ children, withTopInset = true }: ScreenProps) {
  return (
    <View style={styles.root}>
      <SafeAreaView edges={withTopInset ? ['top'] : []} style={styles.safeArea}>
        {children}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.backgroundPrimary,
  },
  safeArea: {
    flex: 1,
  },
});
