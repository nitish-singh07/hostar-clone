export type ThemePref = 'system' | 'light' | 'dark';

export type NotificationPrefs = {
  newReleases: boolean;
  liveSports: boolean;
  downloadCompleted: boolean;
  subscriptionAlerts: boolean;
  promotions: boolean;
  watchReminders: boolean;
};

export type AppPreferences = {
  theme: ThemePref;
  appLanguage: string;
  autoplayNext: boolean;
  autoplayPreviews: boolean;
  dataSaver: boolean;
  wifiOnly: boolean;
  pictureInPicture: boolean;
  backgroundPlayback: boolean;
  videoQuality: string;
  audioLanguage: string;
  subtitleLanguage: string;
  playbackSpeed: string;
  notifications: NotificationPrefs;
};

export type QuickAction = {
  id: string;
  label: string;
  /** Ionicons name. */
  icon: string;
};
