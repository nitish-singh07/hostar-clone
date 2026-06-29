import { StyleSheet, Text, View } from 'react-native';

import { GradientButton } from '@/components/common/GradientButton';
import { palette, spacing, typography } from '@/theme/tokens';

type StateMessageProps = {
  title: string;
  message: string;
  action?: string;
  onAction?: () => void;
};

export function StateMessage({ action, message, onAction, title }: StateMessageProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {action && onAction ? (
        <GradientButton onPress={onAction} style={styles.action}>
          {action}
        </GradientButton>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.sm,
    backgroundColor: palette.backgroundPrimary,
  },
  title: {
    color: palette.textPrimary,
    fontSize: typography.heading,
    fontWeight: '900',
    textAlign: 'center',
  },
  message: {
    color: palette.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
    textAlign: 'center',
  },
  action: {
    marginTop: spacing.md,
    alignSelf: 'stretch',
  },
});
