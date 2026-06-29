import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { palette, spacing } from '@/theme/tokens';

export interface SettingsOption {
  id: string;
  label: string;
  selected: boolean;
  onSelect: () => void;
}

interface SettingsOptionListProps {
  options: SettingsOption[];
  /** Note shown under the title for cosmetic (mock) sections. */
  note?: string;
}

/** Radio-style option list with a leading check on the selected row. */
export function SettingsOptionList({ options, note }: SettingsOptionListProps) {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {note ? <Text style={styles.note}>{note}</Text> : null}
      {options.map((option) => (
        <Pressable key={option.id} style={styles.row} onPress={option.onSelect}>
          <Ionicons
            name={option.selected ? 'checkmark-circle' : 'ellipse-outline'}
            size={20}
            color={option.selected ? palette.hotstarBlue : palette.textMuted}
          />
          <Text style={[styles.label, option.selected && styles.labelSelected]}>
            {option.label}
          </Text>
        </Pressable>
      ))}
      <View style={{ height: spacing.lg }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  note: {
    color: palette.textMuted,
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    fontStyle: 'italic',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  label: { color: palette.textSecondary, fontSize: 15, fontWeight: '600' },
  labelSelected: { color: palette.textPrimary, fontWeight: '800' },
});
