import React, { useEffect, memo } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface AnimatedTabBarIndicatorProps {
  focused: boolean;
}

const AnimatedTabBarIndicatorComponent: React.FC<AnimatedTabBarIndicatorProps> = ({
  focused,
}) => {
  const width = useSharedValue(focused ? 24 : 0);
  const opacity = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    if (focused) {
      width.value = withSpring(24, {
        damping: 15,
        stiffness: 150,
      });
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      width.value = withTiming(0, { duration: 200 });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [focused, width, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: width.value,
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.indicator, animatedStyle]} />;
};

export const AnimatedTabBarIndicator = memo(AnimatedTabBarIndicatorComponent);

const styles = StyleSheet.create({
  indicator: {
    height: 2,
    backgroundColor: '#3960FB',
    borderRadius: 1,
    marginTop: 4,
  },
});

