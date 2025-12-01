import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';
import { wsService } from '../services/websocket';

export default function GameMultiResultsScreen({ navigation, route }) {
  const { finalScores } = route.params;

  const handleGoHome = () => {
    wsService.disconnect();
    navigation.navigate('Home');
  };

  const renderPlayer = ({ item, index }) => {
    const isWinner = index === 0;
    return (
      <View style={[styles.playerCard, isWinner && styles.winnerCard]}>
        <Text style={styles.rank}>{index + 1}</Text>
        {isWinner && <Ionicons name="trophy" size={24} color={colors.warning} />}
        <Text style={[styles.pseudo, isWinner && styles.winnerText]}>{item.pseudo}</Text>
        <Text style={[styles.score, isWinner && styles.winnerText]}>{item.score} pts</Text>
      </View>
    );
  };

  return (
    <LinearGradient colors={colors.gradientPrimary} style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="trophy" size={80} color={colors.warning} />
        <Text style={styles.title}>Fin de la partie</Text>

        <FlatList
          data={finalScores}
          renderItem={renderPlayer}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />

        <TouchableOpacity style={styles.button} onPress={handleGoHome}>
          <LinearGradient colors={['#ff00c8', '#b300ff']} style={styles.buttonGradient}>
            <Text style={styles.buttonText}>Retour à l'accueil</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: spacing.xxl * 2,
    paddingHorizontal: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.white,
    marginVertical: spacing.lg,
  },
  list: {
    width: '100%',
    paddingVertical: spacing.lg,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.glassEffect,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  winnerCard: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderWidth: 2,
    borderColor: colors.warning,
  },
  rank: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 20,
    width: 30,
  },
  pseudo: {
    color: colors.white,
    flex: 1,
    marginLeft: spacing.sm,
  },
  winnerText: {
    color: colors.warning,
    fontWeight: 'bold',
  },
  score: {
    color: colors.accent,
    fontWeight: 'bold',
  },
  button: {
    width: '100%',
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginTop: spacing.lg,
  },
  buttonGradient: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: typography.fontSize.lg,
  },
});
