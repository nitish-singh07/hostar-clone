import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ContentRow } from '@/components/carousel/ContentRow';
import { BottomSheet, type BottomSheetItem } from '@/components/common/BottomSheet';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Screen } from '@/components/common/Screen';
import { SectionHeader } from '@/components/common/SectionHeader';
import { DownloadCard } from '@/components/profile/DownloadCard';
import { EditProfileSheet, type EditProfileValues } from '@/components/profile/EditProfileSheet';
import { MyListsRow, type MyList } from '@/components/profile/MyListsRow';
import { ProfileAvatar } from '@/components/profile/ProfileAvatar';
import { ProfileHeaderCard } from '@/components/profile/ProfileHeaderCard';
import { QuickActionsGrid } from '@/components/profile/QuickActionsGrid';
import { SubscriptionCard } from '@/components/profile/SubscriptionCard';
import { OptionSheet } from '@/components/profile/settings/OptionSheet';
import { SettingsRow } from '@/components/profile/settings/SettingsRow';
import { SettingsSection } from '@/components/profile/settings/SettingsSection';
import { StorageBar } from '@/components/profile/StorageBar';
import { ProfileSkeleton } from '@/components/skeleton/ProfileSkeleton';
import { StateMessage } from '@/components/states/StateMessage';
import { useAsyncResource } from '@/hooks/use-async-resource';
import { usePreferences } from '@/hooks/use-preferences';
import { getContinueWatching, getProfile } from '@/services/api/content';
import { progressStore } from '@/services/progress/continueWatching';
import { palette, radius, spacing, typography } from '@/theme/tokens';
import type { ContentItem, Profile } from '@/types/content';
import type { QuickAction, ThemePref } from '@/types/profile';
import { openCollection } from '@/utils/content';

const MAX_PROFILES = 5;

const QUICK_ACTIONS: QuickAction[] = [
  { id: 'downloads', label: 'Downloads', icon: 'download-outline' },
  { id: 'watchlist', label: 'Watchlist', icon: 'bookmark-outline' },
  { id: 'history', label: 'History', icon: 'time-outline' },
  { id: 'subscription', label: 'Subscription', icon: 'diamond-outline' },
  { id: 'rewards', label: 'Rewards', icon: 'gift-outline' },
  { id: 'invite', label: 'Invite Friends', icon: 'people-outline' },
];

const LANGUAGES = ['English', 'Hindi', 'Tamil', 'Telugu', 'Malayalam', 'Kannada'];
const QUALITY_OPTIONS = ['Auto', 'Low', 'Medium', 'High', 'Best'];
const SPEED_OPTIONS = ['0.5x', '0.75x', '1x', '1.25x', '1.5x', '2x'];
const THEME_OPTIONS = ['System', 'Light', 'Dark'];
const SUBTITLE_OPTIONS = ['Off', ...LANGUAGES];

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

type OptionState = {
  title: string;
  options: string[];
  selected: string;
  apply: (value: string) => void;
};

type ConfirmState = {
  title: string;
  message?: string;
  confirmLabel: string;
  destructive?: boolean;
  onConfirm: () => void;
};

export default function ProfileScreen() {
  const { data, error, isLoading, refresh } = useAsyncResource(getProfile);
  const continueWatching = useAsyncResource(getContinueWatching);
  const { prefs, update } = usePreferences();

  const refreshContinue = continueWatching.refresh;
  useFocusEffect(
    useCallback(() => {
      void refreshContinue();
    }, [refreshContinue]),
  );

  const [edits, setEdits] = useState<Partial<Profile>>({});
  const [removedDownloads, setRemovedDownloads] = useState<string[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [overflowOpen, setOverflowOpen] = useState(false);
  const [option, setOption] = useState<OptionState | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const scrollRef = useRef<ScrollView>(null);
  const positions = useRef<Record<string, number>>({});

  const profile = useMemo<Profile | null>(
    () => (data ? { ...data, ...edits } : null),
    [data, edits],
  );

  const openDetails = useCallback((item: ContentItem) => {
    router.push(`/details/${item.id}`);
  }, []);

  const onSectionLayout = useCallback(
    (key: string) => (event: LayoutChangeEvent) => {
      positions.current[key] = event.nativeEvent.layout.y;
    },
    [],
  );

  const scrollToSection = useCallback((key: string) => {
    const y = positions.current[key];
    if (y != null) scrollRef.current?.scrollTo({ y: Math.max(y - 12, 0), animated: true });
  }, []);

  const openOption = useCallback(
    (title: string, options: string[], selected: string, apply: (value: string) => void) => {
      setOption({ title, options, selected, apply });
    },
    [],
  );

  if (isLoading && !data) {
    return <ProfileSkeleton />;
  }

  if (error || !data || !profile) {
    return (
      <StateMessage
        title="Profile unavailable"
        message="The mocked profile could not be loaded."
        action="Retry"
        onAction={refresh}
      />
    );
  }

  const activeId = activeProfileId ?? profile.profiles[0]?.id;
  const continueItems = continueWatching.data ?? [];
  const downloads = profile.downloads.filter((item) => !removedDownloads.includes(item.id));
  const recentlyWatched = profile.recentlyWatched ?? [];

  const myLists: MyList[] = [
    { id: 'favorites', label: 'Favorites', icon: 'heart', count: 12 },
    { id: 'liked', label: 'Liked', icon: 'thumbs-up', count: 28 },
    { id: 'movies', label: 'Saved Movies', icon: 'film', count: 9 },
    { id: 'series', label: 'Saved Series', icon: 'tv', count: 7 },
    { id: 'sports', label: 'Saved Sports', icon: 'football', count: 4 },
  ];

  const onQuickAction = (id: string) => {
    if (id === 'downloads' || id === 'watchlist' || id === 'history' || id === 'subscription') {
      scrollToSection(id === 'history' ? 'recently' : id);
      return;
    }
    setInfo(id === 'rewards' ? 'Rewards' : 'Invite Friends');
  };

  const onSaveProfile = (values: EditProfileValues) => {
    setEdits((prev) => ({
      ...prev,
      name: values.name,
      email: values.email,
      phone: values.phone,
      dob: values.dob,
      gender: values.gender,
    }));
    update({ appLanguage: values.language });
    setEditOpen(false);
  };

  const confirmRemoveContinue = (item: ContentItem) => {
    setConfirm({
      title: 'Remove from Continue Watching?',
      message: `"${item.title}" will be removed from your Continue Watching row.`,
      confirmLabel: 'Remove',
      destructive: true,
      onConfirm: () => {
        progressStore.remove(item.id);
        void refreshContinue();
      },
    });
  };

  const confirmDeleteDownload = (item: ContentItem) => {
    setConfirm({
      title: 'Delete download?',
      message: `"${item.title}" will be removed from your downloads.`,
      confirmLabel: 'Delete',
      destructive: true,
      onConfirm: () => setRemovedDownloads((prev) => [...prev, item.id]),
    });
  };

  const overflowItems: BottomSheetItem[] = [
    { id: 'settings', label: 'Settings', icon: 'settings-outline', onPress: () => scrollToSection('playback') },
    { id: 'help', label: 'Help & Support', icon: 'help-circle-outline', onPress: () => setInfo('Help & Support') },
    { id: 'about', label: 'About JioHotstar', icon: 'information-circle-outline', onPress: () => setInfo('About') },
    {
      id: 'logout',
      label: 'Logout',
      icon: 'log-out-outline',
      destructive: true,
      onPress: () =>
        setConfirm({
          title: 'Logout?',
          message: 'Are you sure you want to logout of your account?',
          confirmLabel: 'Logout',
          destructive: true,
          onConfirm: () => {},
        }),
    },
  ];

  let sectionIndex = 0;
  const fadeIn = () => FadeInDown.duration(360).delay(Math.min(sectionIndex++ * 40, 240));

  return (
    <Screen withTopInset>
      {/* Sticky header */}
      <View style={styles.header}>
        <Text style={styles.screenTitle}>My Space</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Settings"
          hitSlop={8}
          onPress={() => setOverflowOpen(true)}
          style={({ pressed }) => [styles.headerIcon, pressed && styles.pressed]}>
          <Ionicons name="settings-outline" size={22} color={palette.textPrimary} />
        </Pressable>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            tintColor={palette.hotstarBlue}
            refreshing={isLoading}
            onRefresh={refresh}
          />
        }>
        <Animated.View entering={fadeIn()}>
          <ProfileHeaderCard
            profile={profile}
            onEdit={() => setEditOpen(true)}
            onChangeAvatar={() => setEditOpen(true)}
          />
        </Animated.View>

        <Animated.View entering={fadeIn()} onLayout={onSectionLayout('subscription')}>
          <SubscriptionCard profile={profile} onUpgrade={() => setInfo('Upgrade Plan')} />
        </Animated.View>

        {/* Continue Watching */}
        <Animated.View entering={fadeIn()}>
          <SectionHeader
            title="Continue Watching"
            onSeeAll={continueItems.length > 0 ? () => openCollection('Continue Watching', continueItems) : undefined}
          />
          {continueItems.length > 0 ? (
            <ContentRow
              section={{ id: 'continue', title: '', items: continueItems }}
              onPressItem={openDetails}
              onLongPressItem={confirmRemoveContinue}
              variant="wide"
            />
          ) : (
            <InlineEmpty
              icon="play-circle-outline"
              title="Nothing to continue"
              message="Start watching your favorite content."
            />
          )}
        </Animated.View>

        {/* Watchlist */}
        <Animated.View entering={fadeIn()} onLayout={onSectionLayout('watchlist')}>
          <SectionHeader
            title="Watchlist"
            onSeeAll={profile.watchlist.length > 0 ? () => openCollection('Watchlist', profile.watchlist) : undefined}
          />
          {profile.watchlist.length > 0 ? (
            <ContentRow
              section={{ id: 'watchlist', title: '', items: profile.watchlist }}
              onPressItem={openDetails}
            />
          ) : (
            <InlineEmpty
              icon="bookmark-outline"
              title="Your watchlist is empty"
              message="Add movies and shows to watch later."
            />
          )}
        </Animated.View>

        {/* Downloads */}
        <Animated.View entering={fadeIn()} onLayout={onSectionLayout('downloads')}>
          <SectionHeader
            title="Downloads"
            onSeeAll={downloads.length > 0 ? () => openCollection('Downloads', downloads) : undefined}
          />
          {profile.storageUsedGb != null && profile.storageTotalGb != null ? (
            <StorageBar usedGb={profile.storageUsedGb} totalGb={profile.storageTotalGb} />
          ) : null}
          {downloads.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.downloadsRow}>
              {downloads.map((item) => (
                <DownloadCard
                  key={item.id}
                  item={item}
                  onPress={openDetails}
                  onDelete={confirmDeleteDownload}
                />
              ))}
            </ScrollView>
          ) : (
            <InlineEmpty
              icon="download-outline"
              title="No downloads available"
              message="Download content for offline viewing."
            />
          )}
        </Animated.View>

        {/* Recently Watched */}
        <Animated.View entering={fadeIn()} onLayout={onSectionLayout('recently')}>
          <SectionHeader
            title="Recently Watched"
            onSeeAll={recentlyWatched.length > 0 ? () => openCollection('Recently Watched', recentlyWatched) : undefined}
          />
          {recentlyWatched.length > 0 ? (
            <ContentRow
              section={{ id: 'recently', title: '', items: recentlyWatched }}
              onPressItem={openDetails}
            />
          ) : (
            <InlineEmpty
              icon="time-outline"
              title="You haven't watched anything yet"
              message="Your history will show up here."
            />
          )}
        </Animated.View>

        {/* My Lists */}
        <Animated.View entering={fadeIn()}>
          <SectionHeader title="My Lists" />
          <MyListsRow lists={myLists} onPress={(id) => setInfo(myLists.find((l) => l.id === id)?.label ?? 'List')} />
        </Animated.View>

        {/* Profiles */}
        <Animated.View entering={fadeIn()}>
          <SectionHeader title="Who's Watching" action="Manage" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.profiles}>
            {profile.profiles.map((p) => (
              <ProfileAvatar
                key={p.id}
                name={p.name}
                imageUrl={p.avatarUrl}
                isKids={p.isKids}
                active={p.id === activeId}
                onPress={() => setActiveProfileId(p.id)}
              />
            ))}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Add profile"
              onPress={() =>
                setInfo(profile.profiles.length >= MAX_PROFILES ? 'Profile limit reached' : 'Add Profile')
              }
              style={({ pressed }) => [styles.addProfile, pressed && styles.pressed]}>
              <View style={styles.addCircle}>
                <Ionicons name="add" size={28} color={palette.textPrimary} />
              </View>
              <Text style={styles.addText}>Add</Text>
            </Pressable>
          </ScrollView>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={fadeIn()}>
          <SectionHeader title="Quick Actions" />
          <QuickActionsGrid actions={QUICK_ACTIONS} onPress={onQuickAction} />
        </Animated.View>

        {/* Playback Settings */}
        <Animated.View entering={fadeIn()} onLayout={onSectionLayout('playback')} style={styles.settingsBlock}>
          <SettingsSection title="Playback Settings">
            <SettingsRow
              icon="play-forward-outline"
              label="Autoplay Next Episode"
              toggle={{ value: prefs.autoplayNext, onValueChange: (v) => update({ autoplayNext: v }) }}
            />
            <SettingsRow
              icon="eye-outline"
              label="Autoplay Previews"
              toggle={{ value: prefs.autoplayPreviews, onValueChange: (v) => update({ autoplayPreviews: v }) }}
            />
            <SettingsRow
              icon="videocam-outline"
              label="Video Quality"
              value={prefs.videoQuality}
              onPress={() =>
                openOption('Video Quality', QUALITY_OPTIONS, prefs.videoQuality, (v) =>
                  update({ videoQuality: v }),
                )
              }
            />
            <SettingsRow
              icon="volume-high-outline"
              label="Audio Language"
              value={prefs.audioLanguage}
              onPress={() =>
                openOption('Audio Language', LANGUAGES, prefs.audioLanguage, (v) =>
                  update({ audioLanguage: v }),
                )
              }
            />
            <SettingsRow
              icon="text-outline"
              label="Subtitle Language"
              value={prefs.subtitleLanguage}
              onPress={() =>
                openOption('Subtitle Language', SUBTITLE_OPTIONS, prefs.subtitleLanguage, (v) =>
                  update({ subtitleLanguage: v }),
                )
              }
            />
            <SettingsRow
              icon="speedometer-outline"
              label="Default Playback Speed"
              value={prefs.playbackSpeed}
              last
              onPress={() =>
                openOption('Playback Speed', SPEED_OPTIONS, prefs.playbackSpeed, (v) =>
                  update({ playbackSpeed: v }),
                )
              }
            />
          </SettingsSection>
        </Animated.View>

        {/* App Preferences */}
        <Animated.View entering={fadeIn()} style={styles.settingsBlock}>
          <SettingsSection title="App Preferences">
            <SettingsRow
              icon="color-palette-outline"
              label="Theme"
              subtitle="App stays in dark mode in this build"
              value={capitalize(prefs.theme)}
              onPress={() =>
                openOption('Theme', THEME_OPTIONS, capitalize(prefs.theme), (v) =>
                  update({ theme: v.toLowerCase() as ThemePref }),
                )
              }
            />
            <SettingsRow
              icon="language-outline"
              label="App Language"
              value={prefs.appLanguage}
              onPress={() =>
                openOption('App Language', LANGUAGES, prefs.appLanguage, (v) =>
                  update({ appLanguage: v }),
                )
              }
            />
            <SettingsRow
              icon="cellular-outline"
              label="Data Saver"
              toggle={{ value: prefs.dataSaver, onValueChange: (v) => update({ dataSaver: v }) }}
            />
            <SettingsRow
              icon="wifi-outline"
              label="Wi-Fi Only Streaming"
              toggle={{ value: prefs.wifiOnly, onValueChange: (v) => update({ wifiOnly: v }) }}
            />
            <SettingsRow
              icon="tablet-landscape-outline"
              label="Picture in Picture"
              toggle={{ value: prefs.pictureInPicture, onValueChange: (v) => update({ pictureInPicture: v }) }}
            />
            <SettingsRow
              icon="albums-outline"
              label="Background Playback"
              last
              toggle={{ value: prefs.backgroundPlayback, onValueChange: (v) => update({ backgroundPlayback: v }) }}
            />
          </SettingsSection>
        </Animated.View>

        {/* Notifications */}
        <Animated.View entering={fadeIn()} style={styles.settingsBlock}>
          <SettingsSection title="Notifications">
            <SettingsRow
              icon="sparkles-outline"
              label="New Releases"
              toggle={{ value: prefs.notifications.newReleases, onValueChange: (v) => update({ notifications: { ...prefs.notifications, newReleases: v } }) }}
            />
            <SettingsRow
              icon="football-outline"
              label="Live Sports"
              toggle={{ value: prefs.notifications.liveSports, onValueChange: (v) => update({ notifications: { ...prefs.notifications, liveSports: v } }) }}
            />
            <SettingsRow
              icon="cloud-done-outline"
              label="Download Completed"
              toggle={{ value: prefs.notifications.downloadCompleted, onValueChange: (v) => update({ notifications: { ...prefs.notifications, downloadCompleted: v } }) }}
            />
            <SettingsRow
              icon="card-outline"
              label="Subscription Alerts"
              toggle={{ value: prefs.notifications.subscriptionAlerts, onValueChange: (v) => update({ notifications: { ...prefs.notifications, subscriptionAlerts: v } }) }}
            />
            <SettingsRow
              icon="pricetag-outline"
              label="Promotions"
              toggle={{ value: prefs.notifications.promotions, onValueChange: (v) => update({ notifications: { ...prefs.notifications, promotions: v } }) }}
            />
            <SettingsRow
              icon="alarm-outline"
              label="Watch Reminders"
              last
              toggle={{ value: prefs.notifications.watchReminders, onValueChange: (v) => update({ notifications: { ...prefs.notifications, watchReminders: v } }) }}
            />
          </SettingsSection>
        </Animated.View>

        {/* Privacy & Security */}
        <Animated.View entering={fadeIn()} style={styles.settingsBlock}>
          <SettingsSection title="Privacy & Security">
            <SettingsRow icon="key-outline" label="Change Password" onPress={() => setInfo('Change Password')} />
            <SettingsRow icon="phone-portrait-outline" label="Device Management" onPress={() => setInfo('Device Management')} />
            <SettingsRow icon="shield-checkmark-outline" label="Login Activity" onPress={() => setInfo('Login Activity')} />
            <SettingsRow icon="lock-closed-outline" label="Privacy Policy" onPress={() => setInfo('Privacy Policy')} />
            <SettingsRow icon="document-text-outline" label="Terms & Conditions" onPress={() => setInfo('Terms & Conditions')} />
            <SettingsRow
              icon="trash-outline"
              label="Delete Account"
              destructive
              last
              onPress={() =>
                setConfirm({
                  title: 'Delete account?',
                  message: 'This permanently removes your account and all data. This action cannot be undone.',
                  confirmLabel: 'Delete',
                  destructive: true,
                  onConfirm: () => {},
                })
              }
            />
          </SettingsSection>
        </Animated.View>

        {/* Help & Support */}
        <Animated.View entering={fadeIn()} style={styles.settingsBlock}>
          <SettingsSection title="Help & Support">
            <SettingsRow icon="headset-outline" label="Help Center" onPress={() => setInfo('Help Center')} />
            <SettingsRow icon="help-buoy-outline" label="FAQs" onPress={() => setInfo('FAQs')} />
            <SettingsRow icon="chatbubble-ellipses-outline" label="Contact Support" onPress={() => setInfo('Contact Support')} />
            <SettingsRow icon="bug-outline" label="Report a Problem" onPress={() => setInfo('Report a Problem')} />
            <SettingsRow icon="star-outline" label="Rate App" last onPress={() => setInfo('Rate App')} />
          </SettingsSection>
        </Animated.View>

        {/* About */}
        <Animated.View entering={fadeIn()} style={styles.settingsBlock}>
          <SettingsSection title="About">
            <SettingsRow icon="information-circle-outline" label="App Version" value="1.0.0" />
            <SettingsRow icon="build-outline" label="Build Number" value="100" />
            <SettingsRow icon="code-slash-outline" label="Open Source Licenses" last onPress={() => setInfo('Open Source Licenses')} />
          </SettingsSection>
        </Animated.View>

        {/* Logout */}
        <Animated.View entering={fadeIn()} style={styles.settingsBlock}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Logout"
            onPress={() =>
              setConfirm({
                title: 'Logout?',
                message: 'Are you sure you want to logout of your account?',
                confirmLabel: 'Logout',
                destructive: true,
                onConfirm: () => {},
              })
            }
            style={({ pressed }) => [styles.logout, pressed && styles.pressed]}>
            <Ionicons name="log-out-outline" size={20} color={palette.danger} />
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>

      {/* Modals / sheets */}
      <EditProfileSheet
        visible={editOpen}
        profile={profile}
        language={prefs.appLanguage}
        onClose={() => setEditOpen(false)}
        onSave={onSaveProfile}
      />

      <OptionSheet
        visible={option != null}
        title={option?.title ?? ''}
        options={option?.options ?? []}
        selected={option?.selected ?? ''}
        onSelect={(value) => option?.apply(value)}
        onClose={() => setOption(null)}
      />

      <BottomSheet
        visible={overflowOpen}
        title="My Space"
        items={overflowItems}
        onClose={() => setOverflowOpen(false)}
      />

      <BottomSheet
        visible={info != null}
        title={info ?? ''}
        items={[
          {
            id: 'ok',
            label: 'This is a demo screen — action not wired up',
            icon: 'information-circle-outline',
            onPress: () => {},
          },
        ]}
        onClose={() => setInfo(null)}
      />

      <ConfirmDialog
        visible={confirm != null}
        title={confirm?.title ?? ''}
        message={confirm?.message}
        confirmLabel={confirm?.confirmLabel}
        destructive={confirm?.destructive}
        onConfirm={() => {
          confirm?.onConfirm();
          setConfirm(null);
        }}
        onCancel={() => setConfirm(null)}
      />
    </Screen>
  );
}

function InlineEmpty({ icon, message, title }: { icon: string; title: string; message: string }) {
  return (
    <View style={styles.inlineEmpty}>
      <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={26} color={palette.textMuted} />
      <Text style={styles.inlineEmptyTitle}>{title}</Text>
      <Text style={styles.inlineEmptyMessage}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    backgroundColor: palette.backgroundPrimary,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.borderDefault,
  },
  screenTitle: {
    color: palette.textPrimary,
    fontSize: typography.title,
    fontWeight: '900',
  },
  headerIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingTop: spacing.md,
    paddingBottom: 120,
    gap: spacing.xl,
  },
  downloadsRow: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    gap: spacing.sm,
  },
  profiles: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  addProfile: {
    width: 72,
    alignItems: 'center',
    gap: spacing.xs,
  },
  addCircle: {
    width: 58,
    height: 58,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surfaceCard,
    borderWidth: 1,
    borderColor: palette.borderDefault,
  },
  addText: {
    color: palette.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  settingsBlock: {
    marginTop: -spacing.sm,
  },
  logout: {
    marginHorizontal: spacing.md,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: palette.backgroundSecondary,
    borderWidth: 1,
    borderColor: 'rgba(255,107,107,0.35)',
  },
  logoutText: {
    color: palette.danger,
    fontSize: typography.body,
    fontWeight: '900',
  },
  pressed: {
    opacity: 0.8,
  },
  inlineEmpty: {
    marginHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    gap: spacing.xxs,
    borderRadius: radius.lg,
    backgroundColor: palette.backgroundSecondary,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.borderDefault,
  },
  inlineEmptyTitle: {
    color: palette.textSecondary,
    fontSize: typography.body,
    fontWeight: '800',
    marginTop: spacing.xxs,
  },
  inlineEmptyMessage: {
    color: palette.textMuted,
    fontSize: typography.caption,
    fontWeight: '500',
    textAlign: 'center',
  },
});
