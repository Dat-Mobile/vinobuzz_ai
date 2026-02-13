import { useEffect, useMemo, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import { radius, spacing } from "../constants/theme";

export const ProductSkeleton = () => {
  const opacity = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.45,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  const animatedStyles = useMemo(
    () =>
      StyleSheet.create({
        wrapOpacity: { opacity: opacity as unknown as number },
      }),
    [opacity],
  );

  return (
    <Animated.View style={[styles.wrap, animatedStyles.wrapOpacity]}>
      <View style={styles.hero} />
      <View style={styles.row} />
      <View style={[styles.row, styles.short]} />
      <View style={[styles.row, styles.long]} />
      <View style={styles.paragraph} />
      <View style={styles.paragraph} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.md,
    paddingBottom: 120,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  hero: {
    backgroundColor: "#E6DDD4",
    borderRadius: radius.md,
    height: 330,
  },
  row: {
    backgroundColor: "#E9E0D8",
    borderRadius: 8,
    height: 18,
    width: "72%",
  },
  short: {
    width: "46%",
  },
  long: {
    height: 14,
    width: "88%",
  },
  paragraph: {
    backgroundColor: "#E9E0D8",
    borderRadius: 8,
    height: 78,
  },
});
