import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { palette, radius, spacing, typography } from '@/theme/tokens';
import type { Profile } from '@/types/content';

type ProfileHeaderCardProps = {
  profile: Profile;
  onEdit: () => void;
  onChangeAvatar: () => void;
};

export function ProfileHeaderCard({ onChangeAvatar, onEdit, profile }: ProfileHeaderCardProps) {
  return (
    <LinearGradient
      colors={['rgba(31,128,224,0.28)', 'rgba(224,0,122,0.18)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Change avatar"
        onPress={onChangeAvatar}
        style={({ pressed }) => [styles.avatarWrap, pressed && styles.avatarPressed]}>
        <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} contentFit="cover" />
        <View style={styles.cameraBadge}>
          <Ionicons name="camera" size={12} color={palette.textPrimary} />
        </View>
      </Pressable>

      <View style={styles.info}>
        <Text numberOfLines={1} style={styles.name}>
          {profile.name}
        </Text>
        <Text numberOfLines={1} style={styles.contact}>
          {profile.email ?? profile.phone}
        </Text>
        <View style={styles.badges}>
          <View style={styles.planBadge}>
            <Ionicons name="diamond" size={11} color={palette.textPrimary} />
            <Text style={styles.planText}>Premium</Text>
          </View>
          {profile.memberSince ? (
            <Text style={styles.memberSince}>{profile.memberSince}</Text>
          ) : null}
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Edit profile"
        onPress={onEdit}
        style={({ pressed }) => [styles.editButton, pressed && styles.editPressed]}>
        <Text style={styles.editText}>Edit</Text>
        <Ionicons name="chevron-forward" size={14} color={palette.hotstarBlue} />
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    padding: spacing.md,
    borderRadius: radius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.borderDefault,
  },
  avatarWrap: {
    width: 64,
    height: 64,
  },
  avatarPressed: {
    opacity: 0.85,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    backgroundColor: palette.surfaceCard,
    borderWidth: 2,
    borderColor: palette.hotstarBlue,
  },
  cameraBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    backgroundColor: palette.hotstarBlue,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: palette.backgroundPrimary,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  name: {
    color: palette.textPrimary,
    fontSize: typography.heading,
    fontWeight: '900',
  },
  contact: {
    color: palette.textSecondary,
    fontSize: typography.caption,
    fontWeight: '600',
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: 4,
  },
  planBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: spacing.xs,
    paddingVertical: 3,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  planText: {
    color: palette.textPrimary,
    fontSize: typography.micro,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  memberSince: {
    color: palette.textMuted,
    fontSize: typography.micro,
    fontWeight: '600',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: palette.backgroundPrimary,
    borderWidth: 1,
    borderColor: palette.borderDefault,
  },
  editPressed: {
    opacity: 0.8,
  },
  editText: {
    color: palette.hotstarBlue,
    fontSize: typography.caption,
    fontWeight: '800',
  },
});
