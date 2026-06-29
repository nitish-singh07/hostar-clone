import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { palette, radius, spacing, typography } from '@/theme/tokens';

type OptionSheetProps = {
  visible: boolean;
  title: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  onClose: () => void;
};

export function OptionSheet({
  onClose,
  onSelect,
  options,
  selected,
  title,
  visible,
}: OptionSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.container} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />
          <Text style={styles.title}>{title}</Text>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.list}>
            {options.map((option) => {
              const active = option === selected;
              return (
                <Pressable
                  key={option}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  onPress={() => {
                    onSelect(option);
                    onClose();
                  }}
                  style={({ pressed }) => [styles.option, pressed && styles.pressed]}>
                  <Text style={[styles.optionLabel, active && styles.optionLabelActive]}>
                    {option}
                  </Text>
                  <Ionicons
                    name={active ? 'checkmark-circle' : 'ellipse-outline'}
                    size={22}
                    color={active ? palette.hotstarBlue : palette.textMuted}
                  />
                </Pressable>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  container: {
    maxHeight: '70%',
    backgroundColor: palette.backgroundSecondary,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: palette.borderDefault,
    marginBottom: spacing.sm,
  },
  title: {
    color: palette.textPrimary,
    fontSize: typography.heading,
    fontWeight: '900',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xs,
  },
  list: {
    paddingHorizontal: spacing.lg,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.borderDefault,
  },
  pressed: {
    opacity: 0.7,
  },
  optionLabel: {
    color: palette.textSecondary,
    fontSize: typography.body,
    fontWeight: '600',
  },
  optionLabelActive: {
    color: palette.textPrimary,
    fontWeight: '800',
  },
});
