import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Modal, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, typography, spacing, borderRadius } from '../theme';
import Button from '../components/Button';
import Card from '../components/Card';

export default function DifficultyScreen({ navigation, route }) {
  const { mode } = route.params;
  const [showPseudoModal, setShowPseudoModal] = useState(false);
  const [pseudo, setPseudo] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);

  const handleDifficultySelection = async (difficulty) => {
    if (difficulty === 'easy' && mode === 'solo') {
      const savedPseudo = await AsyncStorage.getItem('userPseudo');
      if (savedPseudo) {
        setPseudo(savedPseudo);
      }
      setSelectedDifficulty(difficulty);
      setShowPseudoModal(true);
    } else if (difficulty === 'hard' && mode === 'solo') {
      const savedPseudo = await AsyncStorage.getItem('userPseudo');
      if (savedPseudo) {
        setPseudo(savedPseudo);
      }
      setSelectedDifficulty(difficulty);
      setShowPseudoModal(true);
    } else {
      Alert.alert(
        'Bientôt disponible',
        `Mode ${mode === 'solo' ? 'Solo' : 'Multijoueur'} ${difficulty === 'easy' ? 'Facile' : 'Difficile'} - En développement!`
      );
    }
  };


  const handleStartGame = async () => {
    if (pseudo.trim().length < 2) {
      Alert.alert('Erreur', 'Le pseudo doit contenir au moins 2 caractères');
      return;
    }
    await AsyncStorage.setItem('userPseudo', pseudo.trim());
    setShowPseudoModal(false);

    if (selectedDifficulty === 'easy') {
      navigation.navigate('Game', { difficulty: selectedDifficulty, mode });
    } else if (selectedDifficulty === 'hard') {
      navigation.navigate('GameHard', { difficulty: selectedDifficulty, mode });
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

      <Modal
        visible={showPseudoModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPseudoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Entrez votre pseudo</Text>
            <TextInput
              style={styles.input}
              placeholder="Votre pseudo"
              placeholderTextColor="#999"
              value={pseudo}
              onChangeText={setPseudo}
              maxLength={20}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowPseudoModal(false)}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={handleStartGame}
              >
                <LinearGradient
                  colors={['#ff00c8', '#b300ff']}
                  style={styles.confirmGradient}
                >
                  <Text style={styles.confirmButtonText}>Jouer</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.darkCard,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
  },
  modalTitle: {
    ...typography.h3,
    color: colors.white,
    marginBottom: spacing.lg,
    textAlign: 'center',
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
    width: '100%',
    marginBottom: spacing.lg,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: spacing.md,
    marginRight: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.white,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.base,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    marginLeft: spacing.sm,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  confirmGradient: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.base,
    fontWeight: 'bold',
  },
});
