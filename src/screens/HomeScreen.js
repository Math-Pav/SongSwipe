// HomeScreen.js
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';
import IconButton from '../components/IconButton';

export default function HomeScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

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
          toValue: -10,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <LinearGradient colors={colors.gradientPrimary} style={styles.container}>
      <View style={styles.header}>
        <IconButton 
          icon="trophy" 
          onPress={() => alert('Classement - Bientôt disponible')}
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
          <Image 
            source={require('../../assets/images/mascotte.png')}
            style={styles.mascotte}
            resizeMode="contain"
          />
        </Animated.View>
        
        <Text style={styles.title}>SongSwipe</Text>
        <Text style={styles.slogan}>Devinez la musique, battez vos records !</Text>
        
        <TouchableOpacity 
          style={styles.button}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Mode')}
        >
          <Text style={styles.buttonText}>Commencer</Text>
        </TouchableOpacity>
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
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotte: {
    width: '100%',
    height: '100%',
  },
  title: {
    ...typography.h1,
    color: colors.white,
    marginBottom: spacing.md,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  slogan: {
    ...typography.body,
    fontSize: typography.fontSize.lg,
    color: colors.white,
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  button: {
    backgroundColor: colors.white,
    paddingVertical: 20,
    paddingHorizontal: 80,
    borderRadius: borderRadius.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: colors.primaryDark,
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
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