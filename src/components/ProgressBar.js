import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius } from '../theme';

export default function ProgressBar({ progress = 0, height = 8 }) {
  return (
    <View style={[styles.container, { height }]}>
      <LinearGradient
        colors={colors.gradientAccent}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.progress, { width: `${progress * 100}%` }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.glassEffect,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
});
