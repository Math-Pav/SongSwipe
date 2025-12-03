import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius } from '../theme';

export default function IconButton({ icon, onPress, size = 26, style, color = colors.white }) {
  return (
    <TouchableOpacity 
      style={[styles.button, style]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
        style={styles.gradient}
      >
        <Ionicons name={icon} size={size} color={color} />
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  gradient: {
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.md,
  },
});
