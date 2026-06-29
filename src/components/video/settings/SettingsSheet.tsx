import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInRight, SlideOutRight } from 'react-native-reanimated';

import {
  SettingsOptionList,
  type SettingsOption,
} from '@/components/video/settings/SettingsOptionList';
import { PLAYBACK_RATES } from '@/player/PlayerProvider';
import { usePlayer } from '@/player/usePlayer';
import type { AspectMode } from '@/player/playerTypes';
import { palette, spacing } from '@/theme/tokens';

interface SettingsSheetProps {
  open: boolean;
  onClose: () => void;
}

type Section = {
  key: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  currentLabel: string;
  cosmetic: boolean;
  options: SettingsOption[];
};

const ASPECT_LABELS: Record<AspectMode, string> = {
  contain: 'Fit',
  cover: 'Zoom',
  fill: 'Stretch',
};

const COSMETIC_NOTE = 'Demo only — the sample clip is a single-rendition file, so this is cosmetic.';

export function SettingsSheet({ open, onClose }: SettingsSheetProps) {
  const {
    session,
    playbackRate,
    aspect,
    cosmetic,
    setPlaybackRate,
    setAspect,
    setQuality,
    setSubtitle,
    setAudio,
  } = usePlayer();

  const [activeKey, setActiveKey] = useState<string | null>(null);

  // Reset the drill-in level on close so the next open starts at the top menu.
  const handleClose = () => {
    setActiveKey(null);
    onClose();
  };

  if (!open || !session) return null;

  const config = session.config;

  const sections: Section[] = [
    {
      key: 'quality',
      title: 'Video Quality',
      icon: 'tv-outline',
      cosmetic: true,
      currentLabel: cosmetic.quality?.label ?? 'Auto',
      options: (config?.qualityOptions ?? []).map((q) => ({
        id: q.id,
        label: q.label,
        selected: cosmetic.quality?.id === q.id,
        onSelect: () => setQuality(q),
      })),
    },
    {
      key: 'speed',
      title: 'Playback Speed',
      icon: 'speedometer-outline',
      cosmetic: false,
      currentLabel: playbackRate === 1 ? 'Normal' : `${playbackRate}x`,
      options: PLAYBACK_RATES.map((r) => ({
        id: String(r),
        label: r === 1 ? 'Normal (1x)' : `${r}x`,
        selected: playbackRate === r,
        onSelect: () => setPlaybackRate(r),
      })),
    },
    {
      key: 'audio',
      title: 'Audio',
      icon: 'volume-high-outline',
      cosmetic: true,
      currentLabel: cosmetic.audio?.label ?? '—',
      options: (config?.audioTracks ?? []).map((a) => ({
        id: a.id,
        label: a.label,
        selected: cosmetic.audio?.id === a.id,
        onSelect: () => setAudio(a),
      })),
    },
    {
      key: 'subtitles',
      title: 'Subtitles',
      icon: 'chatbox-ellipses-outline',
      cosmetic: true,
      currentLabel: cosmetic.subtitle?.label ?? 'Off',
      options: (config?.subtitleTracks ?? []).map((s) => ({
        id: s.id,
        label: s.label,
        selected: cosmetic.subtitle?.id === s.id,
        onSelect: () => setSubtitle(s),
      })),
    },
    {
      key: 'aspect',
      title: 'Aspect Ratio',
      icon: 'scan-outline',
      cosmetic: false,
      currentLabel: ASPECT_LABELS[aspect],
      options: (Object.keys(ASPECT_LABELS) as AspectMode[]).map((mode) => ({
        id: mode,
        label: ASPECT_LABELS[mode],
        selected: aspect === mode,
        onSelect: () => setAspect(mode),
      })),
    },
  ];

  const active = sections.find((s) => s.key === activeKey) ?? null;

  return (
    <View style={styles.root}>
      <Animated.View
        entering={FadeIn.duration(180)}
        exiting={FadeOut.duration(160)}
        style={styles.backdropFill}
      >
        <Pressable style={styles.backdropFill} onPress={handleClose} />
      </Animated.View>

      <Animated.View
        entering={SlideInRight.duration(220)}
        exiting={SlideOutRight.duration(180)}
        style={styles.panel}
      >
        <View style={styles.header}>
          {active ? (
            <Pressable onPress={() => setActiveKey(null)} hitSlop={10} style={styles.headerBtn}>
              <Ionicons name="chevron-back" size={22} color={palette.textPrimary} />
            </Pressable>
          ) : null}
          <Text style={styles.headerTitle}>{active ? active.title : 'Settings'}</Text>
          <Pressable onPress={handleClose} hitSlop={10} style={styles.headerBtn}>
            <Ionicons name="close" size={22} color={palette.textPrimary} />
          </Pressable>
        </View>

        {active ? (
          <SettingsOptionList
            options={active.options}
            note={active.cosmetic ? COSMETIC_NOTE : undefined}
          />
        ) : (
          <View>
            {sections.map((section) => (
              <Pressable
                key={section.key}
                style={styles.menuRow}
                onPress={() => setActiveKey(section.key)}
              >
                <Ionicons name={section.icon} size={20} color={palette.textSecondary} />
                <View style={styles.menuText}>
                  <View style={styles.menuTitleRow}>
                    <Text style={styles.menuTitle}>{section.title}</Text>
                    {section.cosmetic ? <Text style={styles.demoTag}>DEMO</Text> : null}
                  </View>
                  <Text style={styles.menuValue}>{section.currentLabel}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={palette.textMuted} />
              </Pressable>
            ))}
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, flexDirection: 'row' },
  backdropFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  panel: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 360,
    maxWidth: '78%',
    backgroundColor: palette.backgroundSecondary,
    paddingTop: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.borderDefault,
  },
  headerBtn: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { flex: 1, color: palette.textPrimary, fontSize: 17, fontWeight: '800' },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.borderDefault,
  },
  menuText: { flex: 1 },
  menuTitleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  menuTitle: { color: palette.textPrimary, fontSize: 15, fontWeight: '700' },
  demoTag: {
    color: palette.hotstarBlue,
    fontSize: 9,
    fontWeight: '900',
    borderWidth: 1,
    borderColor: palette.hotstarBlue,
    borderRadius: 3,
    paddingHorizontal: 3,
    paddingVertical: 1,
  },
  menuValue: { color: palette.textMuted, fontSize: 12, fontWeight: '600', marginTop: 2 },
});
