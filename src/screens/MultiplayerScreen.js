import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';

export default function MultiplayerScreen({ navigation }) {
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');

  const handleStart = (difficulty) => {
    if (player1.trim().length < 2 || player2.trim().length < 2) {
      Alert.alert('Erreur', 'Les pseudos doivent contenir au moins 2 caractères');
      return;
    }

    if (player1.trim().toLowerCase() === player2.trim().toLowerCase()) {
      Alert.alert('Erreur', 'Les pseudos doivent être différents');
      return;
    }

    navigation.navigate('GameMultiLocal', {
      player1: player1.trim(),
      player2: player2.trim(),
      difficulty,
    });
  };

  return (
    <LinearGradient colors={colors.gradientPrimary} style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={28} color={colors.white} />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.classementButton}
        onPress={() => navigation.navigate('ClassementDuel')}
      >
        <Ionicons name="trophy" size={28} color="#ffd700" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Ionicons name="people" size={80} color={colors.accent} />
        <Text style={styles.title}>Duel Local</Text>
        <Text style={styles.subtitle}>2 joueurs, 1 téléphone, tour par tour</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Joueur 1</Text>
          <TextInput
            style={styles.input}
            placeholder="Pseudo joueur 1"
            placeholderTextColor="#999"
            value={player1}
            onChangeText={setPlayer1}
            maxLength={15}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Joueur 2</Text>
          <TextInput
            style={styles.input}
            placeholder="Pseudo joueur 2"
            placeholderTextColor="#999"
            value={player2}
            onChangeText={setPlayer2}
            maxLength={15}
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => handleStart('easy')}
        >
          <LinearGradient
            colors={['#00ff88', '#00cc6a']}
            style={styles.buttonGradient}
          >
            <Ionicons name="checkmark-circle" size={24} color={colors.white} />
            <Text style={styles.buttonText}>Mode Facile (QCM)</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => handleStart('hard')}
        >
          <LinearGradient
            colors={['#ff6b6b', '#ee5a5a']}
            style={styles.buttonGradient}
          >
            <Ionicons name="flame" size={24} color={colors.white} />
            <Text style={styles.buttonText}>Mode Difficile (Input)</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: spacing.xxl + spacing.md,
    left: spacing.lg,
    zIndex: 10,
    padding: spacing.sm,
  },
  classementButton: {
    position: 'absolute',
    top: spacing.xxl + spacing.md,
    right: spacing.lg,
    zIndex: 10,
    padding: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  title: {
    ...typography.h2,
    color: colors.white,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.white,
    opacity: 0.8,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: spacing.md,
  },
  label: {
    color: colors.white,
    fontSize: typography.fontSize.base,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    fontSize: typography.fontSize.lg,
    color: colors.primaryDark,
    textAlign: 'center',
    fontWeight: '600',
  },
  button: {
    width: '100%',
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginTop: spacing.md,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
  },
});
