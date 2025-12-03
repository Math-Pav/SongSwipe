import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, borderRadius, shadows } from '../theme';

export default function Button({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  icon = null,
  style 
}) {
  const getGradientColors = () => {
    if (disabled) return [colors.disabled, colors.disabled];
    switch (variant) {
      case 'primary':
        return colors.gradientAccent;
      case 'secondary':
        return colors.gradientSecondary;
      case 'success':
        return colors.gradientSuccess;
      case 'danger':
        return colors.gradientDanger;
      case 'white':
        return [colors.white, '#f5f5f5'];
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
        return { paddingVertical: 20, paddingHorizontal: 50 };
      default:
        return { paddingVertical: 16, paddingHorizontal: 40 };
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.button, disabled && styles.buttonDisabled, style]} 
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
    >
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, getSizeStyle()]}
      >
        {icon && (
          <Ionicons name={icon} size={22} color={getTextColor()} style={styles.icon} />
        )}
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
  buttonDisabled: {
    opacity: 0.6,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontSize: typography.button.fontSize,
    fontWeight: typography.button.fontWeight,
    letterSpacing: typography.button.letterSpacing,
  },
});
