import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Chip } from '@/components/common/Chip';
import { GradientButton } from '@/components/common/GradientButton';
import { palette, radius, spacing, typography } from '@/theme/tokens';
import type { Profile } from '@/types/content';

export type EditProfileValues = {
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  language: string;
};

type EditProfileSheetProps = {
  visible: boolean;
  profile: Profile;
  language: string;
  onClose: () => void;
  onSave: (values: EditProfileValues) => void;
};

const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'];
const LANGUAGES = ['English', 'Hindi', 'Tamil', 'Telugu', 'Malayalam'];

export function EditProfileSheet({
  language,
  onClose,
  onSave,
  profile,
  visible,
}: EditProfileSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={styles.overlay} onPress={onClose}>
          <Pressable style={styles.container} onPress={(e) => e.stopPropagation()}>
            {visible ? (
              <EditProfileForm
                profile={profile}
                language={language}
                onClose={onClose}
                onSave={onSave}
              />
            ) : null}
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function EditProfileForm({
  language,
  onClose,
  onSave,
  profile,
}: Omit<EditProfileSheetProps, 'visible'>) {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email ?? '');
  const [phone, setPhone] = useState(profile.phone);
  const [dob, setDob] = useState(profile.dob ?? '');
  const [gender, setGender] = useState(profile.gender ?? '');
  const [lang, setLang] = useState(language);
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({});

  const validate = () => {
    const next: typeof errors = {};
    if (name.trim().length === 0) next.name = 'Name is required';
    if (email.trim().length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = 'Enter a valid email';
    }
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 7) next.phone = 'Enter a valid phone number';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      dob: dob.trim(),
      gender,
      language: lang,
    });
  };

  return (
    <>
      <View style={styles.handle} />
      <View style={styles.header}>
        <Text style={styles.heading}>Edit Profile</Text>
        <Pressable accessibilityRole="button" hitSlop={8} onPress={onClose}>
          <Ionicons name="close" size={22} color={palette.textSecondary} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.form}>
        <View style={styles.photoRow}>
          <Image source={{ uri: profile.avatarUrl }} style={styles.photo} contentFit="cover" />
          <Pressable accessibilityRole="button" style={styles.changePhoto}>
            <Ionicons name="camera-outline" size={16} color={palette.hotstarBlue} />
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </Pressable>
        </View>

        <Field label="Full Name" error={errors.name}>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor={palette.textMuted}
            selectionColor={palette.hotstarBlue}
          />
        </Field>

        <Field label="Email" error={errors.email}>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor={palette.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            selectionColor={palette.hotstarBlue}
          />
        </Field>

        <Field label="Phone Number" error={errors.phone}>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="+91 XXXXX XXXXX"
            placeholderTextColor={palette.textMuted}
            keyboardType="phone-pad"
            selectionColor={palette.hotstarBlue}
          />
        </Field>

        <Field label="Date of Birth">
          <TextInput
            style={styles.input}
            value={dob}
            onChangeText={setDob}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={palette.textMuted}
            selectionColor={palette.hotstarBlue}
          />
        </Field>

        <Field label="Gender">
          <View style={styles.chips}>
            {GENDERS.map((g) => (
              <Chip key={g} label={g} active={gender === g} onPress={() => setGender(g)} />
            ))}
          </View>
        </Field>

        <Field label="Preferred Language">
          <View style={styles.chips}>
            {LANGUAGES.map((l) => (
              <Chip key={l} label={l} active={lang === l} onPress={() => setLang(l)} />
            ))}
          </View>
        </Field>
      </ScrollView>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          onPress={onClose}
          style={({ pressed }) => [styles.cancelButton, pressed && styles.pressed]}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
        <GradientButton icon="✓" onPress={handleSave} style={styles.saveButton}>
          Save
        </GradientButton>
      </View>
    </>
  );
}

function Field({
  children,
  error,
  label,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  container: {
    maxHeight: '90%',
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  heading: {
    color: palette.textPrimary,
    fontSize: typography.heading,
    fontWeight: '900',
  },
  form: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.md,
  },
  photoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  photo: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    backgroundColor: palette.surfaceCard,
    borderWidth: 2,
    borderColor: palette.hotstarBlue,
  },
  changePhoto: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: palette.borderDefault,
  },
  changePhotoText: {
    color: palette.hotstarBlue,
    fontSize: typography.caption,
    fontWeight: '800',
  },
  field: {
    gap: spacing.xs,
  },
  fieldLabel: {
    color: palette.textSecondary,
    fontSize: typography.caption,
    fontWeight: '800',
  },
  input: {
    height: 46,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: palette.backgroundPrimary,
    borderWidth: 1,
    borderColor: palette.borderDefault,
    color: palette.textPrimary,
    fontSize: typography.body,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  error: {
    color: palette.danger,
    fontSize: typography.caption,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.borderDefault,
    backgroundColor: palette.backgroundPrimary,
  },
  cancelText: {
    color: palette.textSecondary,
    fontSize: typography.body,
    fontWeight: '800',
  },
  saveButton: {
    flex: 2,
  },
  pressed: {
    opacity: 0.85,
  },
});
