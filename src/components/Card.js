import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius, shadows, spacing } from '../theme';

export default function Card({ children, style, gradient = false }) {
  if (gradient) {
    return (
      <LinearGradient
        colors={['rgba(157, 0, 255, 0.2)', 'rgba(18, 0, 120, 0.2)']}
        style={[styles.card, style]}
      >
        {children}
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.card, styles.solid, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.medium,
  },
  solid: {
    backgroundColor: colors.darkCard,
  },
});
