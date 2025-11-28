import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../theme';
import Button from '../components/Button';
import Card from '../components/Card';

export default function ModeScreen({ navigation }) {
  const modes = [
    { 
      id: 'solo', 
      title: 'Solo', 
      icon: 'person', 
      description: 'Jouez seul et améliorez votre score',
      available: true 
    },
    { 
      id: 'multi', 
      title: 'Multijoueur', 
      icon: 'people', 
      description: 'Défiez vos amis en ligne',
      available: false 
    },
    { 
      id: 'training', 
      title: 'Entraînement', 
      icon: 'barbell', 
      description: 'Mode libre sans limite de temps',
      available: false 
    },
  ];

  return (
    <LinearGradient colors={colors.gradientPrimary} style={styles.container}>
      <Text style={styles.title}>Choisissez le mode</Text>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {modes.map((mode) => (
          <Card key={mode.id} gradient style={styles.modeCard}>
            <View style={styles.modeContent}>
              <View style={styles.iconContainer}>
                <Ionicons name={mode.icon} size={40} color={colors.accent} />
              </View>
              
              <View style={styles.modeInfo}>
                <Text style={styles.modeTitle}>{mode.title}</Text>
                <Text style={styles.modeDescription}>{mode.description}</Text>
              </View>
              
              {!mode.available && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Bientôt</Text>
                </View>
              )}
            </View>
            
            <Button
              title={mode.available ? 'Jouer' : 'Indisponible'}
              onPress={() => {
                if (mode.available) {
                  navigation.navigate('Difficulty', { mode: mode.id });
                }
              }}
              variant={mode.available ? 'primary' : 'secondary'}
              disabled={!mode.available}
              style={styles.button}
            />
          </Card>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacing.xxl,
  },
  title: {
    ...typography.h2,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.xl,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  modeCard: {
    marginBottom: spacing.lg,
  },
  modeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 60,
    height: 60,
    backgroundColor: colors.glassEffect,
    borderRadius: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  modeInfo: {
    flex: 1,
  },
  modeTitle: {
    ...typography.h3,
    fontSize: typography.fontSize.xl,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  modeDescription: {
    ...typography.body,
    fontSize: typography.fontSize.sm,
    color: colors.white,
    opacity: 0.7,
  },
  badge: {
    backgroundColor: colors.warning,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.sm,
  },
  badgeText: {
    ...typography.body,
    fontSize: typography.fontSize.xs,
    color: colors.primaryDark,
    fontWeight: 'bold',
  },
  button: {
    width: '100%',
  },
});
