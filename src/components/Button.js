import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, borderRadius, shadows } from '../theme';

export default function Button({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  style 
}) {
  const getGradientColors = () => {
    switch (variant) {
      case 'primary':
        return colors.gradientAccent;
      case 'secondary':
        return colors.gradientSecondary;
      case 'white':
        return [colors.white, colors.white];
      default:
        return colors.gradientPrimary;
    }
  };

  const getTextColor = () => {
    return variant === 'white' ? colors.primaryDark : colors.white;
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: 12, paddingHorizontal: 24 };
      case 'large':
        return { paddingVertical: 20, paddingHorizontal: 80 };
      default:
        return { paddingVertical: 16, paddingHorizontal: 48 };
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.button, style]} 
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={disabled ? [colors.disabled, colors.disabled] : getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.gradient, getSizeStyle()]}
      >
        <Text style={[styles.text, { color: getTextColor() }]}>
          {title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.medium,
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: typography.button.fontSize,
    fontWeight: typography.button.fontWeight,
  },
});
