import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { GradientButton } from '@/components/common/GradientButton';
import { palette, radius, spacing, typography } from '@/theme/tokens';
import type { Profile } from '@/types/content';

type SubscriptionCardProps = {
  profile: Profile;
  onUpgrade: () => void;
};

export function SubscriptionCard({ onUpgrade, profile }: SubscriptionCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.planLabelRow}>
          <Ionicons name="diamond" size={14} color={palette.hotstarBlue} />
          <Text style={styles.planLabel}>{profile.plan}</Text>
        </View>
        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>{profile.planStatus ?? 'Active'}</Text>
        </View>
      </View>

      {profile.planValidTill ? (
        <Text style={styles.validTill}>Valid till {profile.planValidTill}</Text>
      ) : null}
      <Text style={styles.meta}>4K streaming • Downloads • Premium originals • 4 screens</Text>

      <GradientButton icon="✦" onPress={onUpgrade} style={styles.cta}>
        Upgrade Plan
      </GradientButton>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: palette.surfaceCard,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.borderDefault,
    gap: spacing.xs,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  planLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  planLabel: {
    color: palette.textPrimary,
    fontSize: typography.section,
    fontWeight: '900',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    paddingHorizontal: spacing.xs,
    paddingVertical: 3,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(54,211,153,0.16)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: palette.success,
  },
  statusText: {
    color: palette.success,
    fontSize: typography.micro,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  validTill: {
    color: palette.textSecondary,
    fontSize: typography.caption,
    fontWeight: '700',
  },
  meta: {
    color: palette.textMuted,
    fontSize: typography.caption,
    fontWeight: '600',
  },
  cta: {
    marginTop: spacing.sm,
  },
});
