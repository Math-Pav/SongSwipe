// HomeScreen.js
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import IconButton from '../components/IconButton';

export default function HomeScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -15,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <LinearGradient colors={colors.gradientPrimary} style={styles.container}>
      <View style={styles.backgroundDecoration}>
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
      </View>

      <View style={styles.header}>
        <IconButton 
          icon="trophy" 
          onPress={() => navigation.navigate('Classement')}
        />
        <IconButton 
          icon="settings-outline" 
          onPress={() => alert('Paramètres - Bientôt disponible')}
        />
      </View>

      <Animated.View 
        style={[
          styles.centerContent,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Animated.View 
          style={[
            styles.mascotteContainer,
            {
              transform: [{ translateY: bounceAnim }],
            },
          ]}
        >
          <View style={styles.mascotteGlow} />
          <Image 
            source={require('../../assets/images/mascotte.png')}
            style={styles.mascotte}
            resizeMode="contain"
          />
        </Animated.View>
        
        <Text style={styles.title}>SongSwipe</Text>
        <Text style={styles.slogan}>Devinez la musique, battez vos records !</Text>
        
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity 
            style={styles.button}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Mode')}
          >
            <LinearGradient
              colors={[colors.white, '#f0f0f0']}
              style={styles.buttonGradient}
            >
              <Ionicons name="play" size={28} color={colors.primaryDark} />
              <Text style={styles.buttonText}>Commencer</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="musical-notes" size={20} color={colors.accent} />
            <Text style={styles.statText}>1000+ chansons</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="people" size={20} color={colors.neonGreen} />
            <Text style={styles.statText}>Mode Duel</Text>
          </View>
        </View>
      </Animated.View>

      <View style={styles.footer}>
        <View style={styles.waveContainer}>
          <Ionicons name="pulse" size={200} color={colors.glassEffect} />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundDecoration: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  circle: {
    position: 'absolute',
    borderRadius: 9999,
    backgroundColor: 'rgba(240, 147, 251, 0.1)',
  },
  circle1: {
    width: 300,
    height: 300,
    top: -100,
    right: -100,
  },
  circle2: {
    width: 200,
    height: 200,
    bottom: 100,
    left: -50,
    backgroundColor: 'rgba(0, 255, 136, 0.08)',
  },
  circle3: {
    width: 150,
    height: 150,
    top: '40%',
    right: -30,
    backgroundColor: 'rgba(79, 172, 254, 0.1)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl + spacing.md,
    paddingBottom: spacing.md,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  mascotteContainer: {
    marginBottom: spacing.lg,
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotteGlow: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(240, 147, 251, 0.2)',
    ...shadows.glow,
  },
  mascotte: {
    width: '100%',
    height: '100%',
  },
  title: {
    ...typography.h1,
    fontSize: typography.fontSize.hero,
    color: colors.white,
    marginBottom: spacing.sm,
    textShadowColor: 'rgba(240, 147, 251, 0.5)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 15,
  },
  slogan: {
    ...typography.body,
    fontSize: typography.fontSize.lg,
    color: colors.white,
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  button: {
    borderRadius: borderRadius.xxl,
    overflow: 'hidden',
    ...shadows.large,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 22,
    paddingHorizontal: 60,
    gap: 12,
  },
  buttonText: {
    color: colors.primaryDark,
    fontSize: 24,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: spacing.xl,
    gap: spacing.xl,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.glassEffect,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.xs,
  },
  statText: {
    color: colors.white,
    fontSize: typography.fontSize.sm,
    opacity: 0.9,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    opacity: 0.3,
    zIndex: -1,
  },
  waveContainer: {
    transform: [{ rotate: '90deg' }],
  },
});