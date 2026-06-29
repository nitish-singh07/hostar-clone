import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { HeroBanner } from "@/components/cards/HeroBanner";
import { ContentRow } from "@/components/carousel/ContentRow";
import { type BottomSheetItem } from "@/components/common/BottomSheet";
import { Screen } from "@/components/common/Screen";
import { ScreenSkeleton } from "@/components/skeleton/ScreenSkeleton";
import { StateMessage } from "@/components/states/StateMessage";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { getContinueWatching, getHomeData } from "@/services/api/content";
import { palette, spacing } from "@/theme/tokens";
import type { ContentItem } from "@/types/content";
import { openCollection } from "@/utils/content";

const screenWidth = Dimensions.get("window").width;

export default function HomeScreen() {
  const { data, error, isLoading, refresh } = useAsyncResource(getHomeData);
  const continueWatching = useAsyncResource(getContinueWatching);
  const [activeHero, setActiveHero] = useState(0);
  const [menuVisible, setMenuVisible] = useState(false);

  // Keep Continue Watching fresh after returning from the player.
  const refreshContinue = continueWatching.refresh;
  useFocusEffect(
    useCallback(() => {
      void refreshContinue();
    }, [refreshContinue]),
  );

  const openDetails = useCallback((item: ContentItem) => {
    router.push(`/details/${item.id}`);
  }, []);

  const menuItems: BottomSheetItem[] = [
    {
      id: "browse",
      label: "Browse Categories",
      icon: "apps",
      onPress: () => {},
    },
    {
      id: "watchlist",
      label: "My Watchlist",
      icon: "heart",
      onPress: () => {},
    },
    { id: "settings", label: "Settings", icon: "settings", onPress: () => {} },
    {
      id: "help",
      label: "Help & Support",
      icon: "help-circle",
      onPress: () => {},
    },
  ];

  const heroSections = useMemo(() => data?.hero ?? [], [data]);

  const sections = useMemo(() => {
    if (!data) return [];
    const cw = continueWatching.data;
    if (!cw?.length) return data.sections;
    return data.sections.map((section) =>
      section.id === "continue-watching" ? { ...section, items: cw } : section,
    );
  }, [data, continueWatching.data]);

  if (isLoading && !data) {
    return <ScreenSkeleton />;
  }

  if (error || !data) {
    return (
      <StateMessage
        title="Something went wrong"
        message="We could not load the home feed. Check the mock service and try again."
        action="Retry"
        onAction={refresh}
      />
    );
  }

  if (!data.sections.length) {
    return (
      <StateMessage
        title="Nothing to watch yet"
        message="The home feed is empty. Add mock content to populate the JioHotstar clone."
      />
    );
  }

  return (
    <>
      <Screen withTopInset={false}>
        <ScrollView
          style={styles.scroll}
          refreshControl={
            <RefreshControl
              tintColor={palette.hotstarBlue}
              refreshing={isLoading}
              onRefresh={refresh}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              setActiveHero(
                Math.round(event.nativeEvent.contentOffset.x / screenWidth),
              );
            }}
          >
            {heroSections.map((item, index) => (
              <HeroBanner
                key={item.id}
                item={item}
                active={activeHero === index}
                onPress={openDetails}
              />
            ))}
          </ScrollView>
          <View style={styles.dots}>
            {heroSections.map((item, index) => (
              <View
                key={item.id}
                style={[styles.dot, activeHero === index && styles.activeDot]}
              />
            ))}
          </View>
          <View style={styles.sections}>
            {sections.map((section, index) => (
              <ContentRow
                key={section.id}
                section={section}
                onPressItem={openDetails}
                onSeeAll={() => openCollection(section.title, section.items)}
                variant={index === 0 ? "wide" : "poster"}
              />
            ))}
          </View>
        </ScrollView>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: palette.backgroundPrimary,
  },
  content: {
    paddingBottom: 108,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.xs,
    marginTop: -spacing.sm,
    marginBottom: spacing.lg,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  activeDot: {
    width: 18,
    backgroundColor: palette.textPrimary,
  },
  sections: {
    gap: spacing.xl,
  },
});
