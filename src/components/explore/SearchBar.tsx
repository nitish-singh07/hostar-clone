import { Ionicons } from '@expo/vector-icons';
import { forwardRef } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { palette, radius, spacing, typography } from '@/theme/tokens';

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
  onFocus?: () => void;
  onClear?: () => void;
  onFilterPress?: () => void;
  filterActive?: boolean;
  placeholder?: string;
};

export const SearchBar = forwardRef<TextInput, SearchBarProps>(function SearchBar(
  {
    value,
    onChangeText,
    onSubmit,
    onFocus,
    onClear,
    onFilterPress,
    filterActive = false,
    placeholder = 'Search movies, shows, sports...',
  },
  ref,
) {
  return (
    <View style={styles.row}>
      <View style={styles.field}>
        <Ionicons name="search" size={18} color={palette.textMuted} />
        <TextInput
          ref={ref}
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={palette.textMuted}
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onSubmitEditing={onSubmit}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
          selectionColor={palette.hotstarBlue}
        />
        {value.length > 0 ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            hitSlop={8}
            onPress={onClear}>
            <Ionicons name="close-circle" size={18} color={palette.textMuted} />
          </Pressable>
        ) : null}
      </View>

      {onFilterPress ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Filters"
          onPress={onFilterPress}
          style={({ pressed }) => [
            styles.filterButton,
            filterActive && styles.filterButtonActive,
            pressed && styles.pressed,
          ]}>
          <Ionicons
            name="options-outline"
            size={20}
            color={filterActive ? palette.textPrimary : palette.textSecondary}
          />
        </Pressable>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  field: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    height: 44,
    backgroundColor: palette.backgroundSecondary,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.borderDefault,
  },
  input: {
    flex: 1,
    color: palette.textPrimary,
    fontSize: typography.body,
    paddingVertical: 0,
  },
  filterButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.backgroundSecondary,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.borderDefault,
  },
  filterButtonActive: {
    backgroundColor: palette.hotstarBlue,
    borderColor: palette.hotstarBlue,
  },
  pressed: {
    opacity: 0.7,
  },
});
