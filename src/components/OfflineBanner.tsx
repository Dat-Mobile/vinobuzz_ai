import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, radius, spacing } from "../constants/theme";

type OfflineBannerProps = {
  offline: boolean;
  mockOffline: boolean;
  onToggleMockOffline: () => void;
};

export const OfflineBanner = ({
  offline,
  mockOffline,
  onToggleMockOffline
}: OfflineBannerProps) => {
  return (
    <View style={styles.wrapper}>
      {offline ? (
        <View style={styles.banner}>
          <MaterialCommunityIcons color={colors.white} name="wifi-strength-alert-outline" size={16} />
          <Text style={styles.bannerText}>No connection. Some actions are unavailable.</Text>
        </View>
      ) : null}

      <TouchableOpacity onPress={onToggleMockOffline} style={styles.toggleButton}>
        <MaterialCommunityIcons
          color={mockOffline ? colors.danger : colors.textSecondary}
          name={mockOffline ? "toggle-switch" : "toggle-switch-off-outline"}
          size={22}
        />
        <Text style={styles.toggleText}>
          {mockOffline ? "Mock Offline: ON" : "Mock Offline: OFF"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.sm,
  },
  banner: {
    alignItems: "center",
    backgroundColor: colors.offline,
    borderRadius: radius.md,
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  bannerText: {
    color: colors.white,
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
  },
  toggleButton: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "flex-end",
  },
  toggleText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
});
