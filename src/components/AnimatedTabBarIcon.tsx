import React, { useEffect, memo } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import type { LucideIcon } from '@tamagui/lucide-icons';

interface AnimatedTabBarIconProps {
  focused: boolean;
  color: string;
  size: number;
  icon: LucideIcon;
}

const AnimatedTabBarIconComponent: React.FC<AnimatedTabBarIconProps> = ({
  focused,
  color,
  size,
  icon: Icon,
}) => {
  const scale = useSharedValue(focused ? 1.2 : 1);

  useEffect(() => {
    scale.value = withSpring(focused ? 1.2 : 1, {
      damping: 15,
      stiffness: 150,
      mass: 1,
    });
  }, [focused, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Icon size={size} color={color} />
    </Animated.View>
  );
};

export const AnimatedTabBarIcon = memo(AnimatedTabBarIconComponent);

