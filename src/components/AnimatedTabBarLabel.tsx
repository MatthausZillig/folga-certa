import React, { useEffect, memo } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

interface AnimatedTabBarLabelProps {
  focused: boolean;
  label: string;
  color: string;
}

const AnimatedTabBarLabelComponent: React.FC<AnimatedTabBarLabelProps> = ({
  focused,
  label,
  color,
}) => {
  const opacity = useSharedValue(focused ? 1 : 0.6);

  useEffect(() => {
    opacity.value = withTiming(focused ? 1 : 0.6, { duration: 200 });
  }, [focused, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.Text
      style={[
        styles.label,
        { color },
        focused && styles.labelFocused,
        animatedStyle,
      ]}
    >
      {label}
    </Animated.Text>
  );
};

export const AnimatedTabBarLabel = memo(AnimatedTabBarLabelComponent);

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    fontWeight: '400',
  },
  labelFocused: {
    fontWeight: '600',
  },
});

