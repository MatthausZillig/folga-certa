import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface AnimatedTabBarButtonProps {
  onPress: () => void;
  children: React.ReactNode;
}

const AnimatedTabBarButtonComponent: React.FC<AnimatedTabBarButtonProps> = ({
  onPress,
  children,
}) => {
  const rippleOpacity = useSharedValue(0);
  const rippleScale = useSharedValue(0);

  const handlePress = () => {
    rippleOpacity.value = 0.3;
    rippleScale.value = 0;

    rippleScale.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });

    rippleOpacity.value = withTiming(0, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });

    onPress();
  };

  const rippleStyle = useAnimatedStyle(() => ({
    opacity: rippleOpacity.value,
    transform: [{ scale: rippleScale.value }],
  }));

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      <View style={styles.content}>
        <Animated.View style={[styles.ripple, rippleStyle]} />
        {children}
      </View>
    </Pressable>
  );
};

export const AnimatedTabBarButton = memo(AnimatedTabBarButtonComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  ripple: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3960FB',
  },
});

