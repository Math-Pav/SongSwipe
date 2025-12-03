import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius, shadows, spacing } from '../theme';

export default function Card({ children, style, gradient = false }) {
  if (gradient) {
    return (
      <LinearGradient
        colors={['rgba(157, 0, 255, 0.25)', 'rgba(18, 0, 120, 0.25)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, style]}
      >
        <View style={styles.innerGlow} />
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
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  solid: {
    backgroundColor: colors.cardOverlay,
  },
  innerGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});
