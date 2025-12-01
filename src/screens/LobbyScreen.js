import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';
import { wsService } from '../services/websocket';
import { fetchPopularTracks } from '../services/API';

export default function LobbyScreen({ navigation, route }) {
  const { roomCode, playerId, isHost } = route.params;
  const [players, setPlayers] = useState(route.params.players || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handlePlayerJoined = (data) => {
      setPlayers(data.players);
    };

    const handlePlayerLeft = (data) => {
      setPlayers(data.players);
    };

    const handleGameStarted = (data) => {
      navigation.replace('GameMulti', {
        roomCode,
        playerId,
        isHost,
        tracks: data.tracks,
      });
    };

    const handleError = (data) => {
      Alert.alert('Erreur', data.message);
    };

    const handleDisconnected = () => {
      Alert.alert('Déconnecté', 'Connexion perdue avec le serveur');
      navigation.navigate('Home');
    };

    wsService.on('PLAYER_JOINED', handlePlayerJoined);
    wsService.on('PLAYER_LEFT', handlePlayerLeft);
    wsService.on('GAME_STARTED', handleGameStarted);
    wsService.on('ERROR', handleError);
    wsService.on('disconnected', handleDisconnected);

    return () => {
      wsService.off('PLAYER_JOINED', handlePlayerJoined);
      wsService.off('PLAYER_LEFT', handlePlayerLeft);
      wsService.off('GAME_STARTED', handleGameStarted);
      wsService.off('ERROR', handleError);
      wsService.off('disconnected', handleDisconnected);
    };
  }, [navigation, roomCode, playerId, isHost]);

  const handleStartGame = async () => {
    if (players.length < 2) {
      Alert.alert('Erreur', 'Minimum 2 joueurs requis');
      return;
    }

    setLoading(true);
    try {
      const tracks = await fetchPopularTracks(10);
      wsService.startGame(roomCode, tracks);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les musiques');
    }
    setLoading(false);
  };

  const handleLeave = () => {
    wsService.leaveRoom(roomCode);
    wsService.disconnect();
    navigation.navigate('Home');
  };

  const renderPlayer = ({ item }) => (
    <View style={styles.playerCard}>
      <Ionicons 
        name={item.isHost ? 'star' : 'person'} 
        size={24} 
        color={item.isHost ? colors.warning : colors.white} 
      />
      <Text style={styles.playerName}>{item.pseudo}</Text>
      {item.isHost && <Text style={styles.hostBadge}>Hôte</Text>}
    </View>
  );

  return (
    <LinearGradient colors={colors.gradientPrimary} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleLeave}>
          <Ionicons name="close" size={28} color={colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.codeContainer}>
        <Text style={styles.codeLabel}>Code de la partie</Text>
        <Text style={styles.codeText}>{roomCode}</Text>
        <Text style={styles.codeHint}>Partagez ce code avec vos amis</Text>
      </View>

      <View style={styles.playersContainer}>
        <Text style={styles.playersTitle}>Joueurs ({players.length}/8)</Text>
        <FlatList
          data={players}
          renderItem={renderPlayer}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.playersList}
        />
      </View>

      {isHost && (
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartGame}
          disabled={loading || players.length < 2}
        >
          <LinearGradient
            colors={players.length >= 2 ? ['#00ff88', '#00cc6a'] : ['#666', '#444']}
            style={styles.startGradient}
          >
            <Text style={styles.startText}>
              {loading ? 'Chargement...' : 'Lancer la partie'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      )}

      {!isHost && (
        <View style={styles.waitingContainer}>
          <Text style={styles.waitingText}>En attente du lancement...</Text>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  codeContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  codeLabel: {
    ...typography.body,
    color: colors.white,
    opacity: 0.8,
  },
  codeText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.white,
    letterSpacing: 8,
    marginVertical: spacing.md,
  },
  codeHint: {
    ...typography.body,
    fontSize: typography.fontSize.sm,
    color: colors.white,
    opacity: 0.6,
  },
  playersContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  playersTitle: {
    ...typography.h3,
    color: colors.white,
    marginBottom: spacing.md,
  },
  playersList: {
    paddingBottom: spacing.lg,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.glassEffect,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  playerName: {
    ...typography.body,
    color: colors.white,
    marginLeft: spacing.md,
    flex: 1,
  },
  hostBadge: {
    backgroundColor: colors.warning,
    color: colors.primaryDark,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    fontSize: typography.fontSize.xs,
    fontWeight: 'bold',
  },
  startButton: {
    margin: spacing.lg,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  startGradient: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  startText: {
    color: colors.white,
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
  },
  waitingContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  waitingText: {
    ...typography.body,
    color: colors.white,
    opacity: 0.8,
  },
});
