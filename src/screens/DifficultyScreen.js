import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../theme';
import Button from '../components/Button';
import Card from '../components/Card';

export default function DifficultyScreen({ navigation, route }) {
  const { mode } = route.params;

  const handleDifficultySelection = (difficulty) => {
    if (difficulty === 'easy' && mode === 'solo') {
      navigation.navigate('Game', { difficulty, mode });
    } else if (difficulty === 'hard' && mode === 'solo') {
      navigation.navigate('GameHard', { difficulty, mode });
    } else {
      alert(`Mode ${mode === 'solo' ? 'Solo' : 'Multijoueur'} ${difficulty === 'easy' ? 'Facile' : 'Difficile'} - En développement!`);
    }
  };

  return (
    <LinearGradient colors={colors.gradientPrimary} style={styles.container}>
      <Text style={styles.title}>Choisissez la difficulté</Text>
      <Text style={styles.subtitle}>
        Mode : {mode === 'solo' ? 'Solo' : 'Multijoueur'}
      </Text>
      
      <View style={styles.content}>
        <Card gradient style={styles.difficultyCard}>
          <View style={styles.iconRow}>
            <Ionicons name="checkmark-circle" size={50} color={colors.success} />
          </View>
          <Text style={styles.difficultyTitle}>Facile</Text>
          <Text style={styles.difficultyDescription}>
            Choix multiples (QCM){'\n'}
            Plus de temps pour répondre
          </Text>
          <Button
            title="Facile"
            onPress={() => handleDifficultySelection('easy')}
            variant="primary"
            style={styles.button}
          />
        </Card>

        <Card gradient style={styles.difficultyCard}>
          <View style={styles.iconRow}>
            <Ionicons name="flame" size={50} color={colors.error} />
          </View>
          <Text style={styles.difficultyTitle}>Difficile</Text>
          <Text style={styles.difficultyDescription}>
            Réponse libre (input){'\n'}
            Temps limité
          </Text>
          <Button
            title="Difficile"
            onPress={() => handleDifficultySelection('hard')}
            variant="secondary"
            style={styles.button}
          />
        </Card>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.sm,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    ...typography.body,
    color: colors.white,
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: spacing.xl,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  difficultyCard: {
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  iconRow: {
    marginBottom: spacing.md,
  },
  difficultyTitle: {
    ...typography.h3,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  difficultyDescription: {
    ...typography.body,
    fontSize: typography.fontSize.sm,
    color: colors.white,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  button: {
    width: '100%',
  },
});
