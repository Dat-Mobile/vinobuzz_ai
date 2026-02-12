import { Animated, Easing, StyleSheet, View } from 'react-native';
import { colors } from '../constants/theme';
import { useEffect, useRef } from 'react';

export const TypingIndicator = () => {
  const first = useRef(new Animated.Value(0.3)).current;
  const second = useRef(new Animated.Value(0.3)).current;
  const third = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const sequence = (value: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(value, {
            toValue: 1,
            duration: 400,
            easing: Easing.ease,
            useNativeDriver: true
          }),
          Animated.timing(value, {
            toValue: 0.3,
            duration: 400,
            easing: Easing.ease,
            useNativeDriver: true
          })
        ])
      );

    const animations = [sequence(first, 0), sequence(second, 120), sequence(third, 240)];
    animations.forEach((item) => item.start());

    return () => animations.forEach((item) => item.stop());
  }, [first, second, third]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.dot, { opacity: first }]} />
      <Animated.View style={[styles.dot, { opacity: second }]} />
      <Animated.View style={[styles.dot, { opacity: third }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center'
  },
  dot: {
    backgroundColor: colors.textSecondary,
    borderRadius: 999,
    height: 7,
    width: 7
  }
});
