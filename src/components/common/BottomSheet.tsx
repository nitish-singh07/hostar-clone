import { useCallback } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { palette, spacing, typography } from '@/theme/tokens';

export interface BottomSheetItem {
  id: string;
  label: string;
  icon: string;
  onPress: () => void;
  color?: string;
  destructive?: boolean;
}

interface BottomSheetProps {
  visible: boolean;
  title?: string;
  items: BottomSheetItem[];
  onClose: () => void;
  style?: ViewStyle;
}

export function BottomSheet({
  visible,
  title,
  items,
  onClose,
  style,
}: BottomSheetProps) {
  const handleItemPress = useCallback((item: BottomSheetItem) => {
    item.onPress();
    onClose();
  }, [onClose]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <Pressable
        style={styles.overlay}
        onPress={onClose}
      >
        <Pressable
          style={[styles.container, style]}
          onPress={(e) => e.stopPropagation()}>
          {title && <Text style={styles.title}>{title}</Text>}

          <View style={styles.itemsContainer}>
            {items.map((item, index) => (
              <View key={item.id}>
                <Pressable
                  style={({ pressed }) => [
                    styles.item,
                    pressed && styles.itemPressed,
                  ]}
                  onPress={() => handleItemPress(item)}>
                  <Ionicons
                    name={item.icon as any}
                    size={24}
                    color={item.destructive ? '#FF3B30' : palette.textPrimary}
                  />
                  <Text
                    style={[
                      styles.itemLabel,
                      item.destructive && styles.itemLabelDestructive,
                      item.color && { color: item.color },
                    ]}>
                    {item.label}
                  </Text>
                </Pressable>
                {index < items.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.closeButton,
              pressed && styles.closeButtonPressed,
            ]}
            onPress={onClose}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: palette.backgroundSecondary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: spacing.xl,
    paddingTop: spacing.lg,
  },
  title: {
    color: palette.textPrimary,
    fontSize: typography.section,
    fontWeight: '900',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  itemsContainer: {
    marginHorizontal: spacing.lg,
    borderRadius: 12,
    backgroundColor: palette.backgroundPrimary,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  itemPressed: {
    backgroundColor: 'rgba(31, 128, 224, 0.1)',
  },
  itemLabel: {
    flex: 1,
    color: palette.textPrimary,
    fontSize: typography.body,
    fontWeight: '700',
  },
  itemLabelDestructive: {
    color: '#FF3B30',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: palette.borderDefault,
    marginHorizontal: spacing.md,
  },
  closeButton: {
    marginHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 12,
    backgroundColor: palette.backgroundPrimary,
    alignItems: 'center',
  },
  closeButtonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  closeButtonText: {
    color: palette.textSecondary,
    fontSize: typography.body,
    fontWeight: '700',
  },
});
