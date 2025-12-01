import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';

export default function MultiplayerScreen({ navigation }) {
  return (
    <LinearGradient colors={colors.gradientPrimary} style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={28} color={colors.white} />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Multijoueur</Text>
        <Text style={styles.subtitle}>Jouez avec vos amis en temps réel</Text>

        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => navigation.navigate('CreateGame')}
        >
          <LinearGradient
            colors={['#ff00c8', '#b300ff']}
            style={styles.cardGradient}
          >
            <Ionicons name="add-circle" size={50} color={colors.white} />
            <Text style={styles.cardTitle}>Créer une partie</Text>
            <Text style={styles.cardDescription}>Invitez vos amis avec un code</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => navigation.navigate('JoinGame')}
        >
          <LinearGradient
            colors={['#4facfe', '#00f2fe']}
            style={styles.cardGradient}
          >
            <Ionicons name="enter" size={50} color={colors.white} />
            <Text style={styles.cardTitle}>Rejoindre une partie</Text>
            <Text style={styles.cardDescription}>Entrez un code pour jouer</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacing.xxl,
  },
  backButton: {
    position: 'absolute',
    top: spacing.xxl + spacing.md,
    left: spacing.lg,
    zIndex: 10,
    padding: spacing.sm,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.white,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.white,
    opacity: 0.8,
    marginBottom: spacing.xxl,
    textAlign: 'center',
  },
  optionCard: {
    width: '100%',
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  cardTitle: {
    ...typography.h3,
    color: colors.white,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  cardDescription: {
    ...typography.body,
    color: colors.white,
    opacity: 0.8,
  },
});
