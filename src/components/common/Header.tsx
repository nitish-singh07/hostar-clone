import { memo } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from 'tamagui';
import { palette, spacing } from '@/theme/tokens';

interface HeaderProps {
  title?: string;
  onMenuPress?: () => void;
}

function HeaderBase({
  title = 'Hotstar',
  onMenuPress,
}: HeaderProps) {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.left}>
          <Text style={styles.logo}>𝖍𝖔𝖙𝖘𝖙𝖆𝖘</Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.iconButton,
            pressed && styles.iconButtonPressed,
          ]}
          onPress={onMenuPress}>
          <Ionicons name="ellipsis-vertical" size={24} color={palette.textPrimary} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export const Header = memo(HeaderBase);

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: palette.backgroundPrimary,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logo: {
    color: palette.hotstarBlue,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  iconButtonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});
