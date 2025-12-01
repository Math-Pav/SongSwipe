import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';
import { wsService } from '../services/websocket';

const SERVER_URL = 'ws://172.20.10.3:3001';

export default function JoinGameScreen({ navigation }) {
  const [pseudo, setPseudo] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleJoined = (data) => {
      setLoading(false);
      navigation.replace('Lobby', {
        roomCode: data.roomCode,
        playerId: data.playerId,
        players: data.players,
        isHost: false,
      });
    };

    const handleError = (data) => {
      setLoading(false);
      Alert.alert('Erreur', data.message);
    };

    wsService.on('JOINED_ROOM', handleJoined);
    wsService.on('ERROR', handleError);

    return () => {
      wsService.off('JOINED_ROOM', handleJoined);
      wsService.off('ERROR', handleError);
    };
  }, [navigation]);

  const handleJoin = async () => {
    if (pseudo.trim().length < 2) {
      Alert.alert('Erreur', 'Le pseudo doit contenir au moins 2 caractères');
      return;
    }

    if (roomCode.trim().length !== 6) {
      Alert.alert('Erreur', 'Le code doit contenir 6 caractères');
      return;
    }

    setLoading(true);
    try {
      await wsService.connect(SERVER_URL);
      wsService.joinRoom(roomCode.toUpperCase().trim(), pseudo.trim());
    } catch (error) {
      setLoading(false);
      Alert.alert('Erreur', 'Impossible de se connecter au serveur');
    }
  };

  return (
    <LinearGradient colors={colors.gradientPrimary} style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={28} color={colors.white} />
      </TouchableOpacity>

      <View style={styles.content}>
        <Ionicons name="enter" size={80} color={colors.secondary} />
        <Text style={styles.title}>Rejoindre une partie</Text>
        <Text style={styles.subtitle}>Entrez le code de la partie</Text>

        <TextInput
          style={styles.input}
          placeholder="Votre pseudo"
          placeholderTextColor="#999"
          value={pseudo}
          onChangeText={setPseudo}
          maxLength={20}
          autoCapitalize="none"
        />

        <TextInput
          style={[styles.input, styles.codeInput]}
          placeholder="CODE"
          placeholderTextColor="#999"
          value={roomCode}
          onChangeText={(text) => setRoomCode(text.toUpperCase())}
          maxLength={6}
          autoCapitalize="characters"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleJoin}
          disabled={loading}
        >
          <LinearGradient
            colors={['#4facfe', '#00f2fe']}
            style={styles.buttonGradient}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.buttonText}>Rejoindre</Text>
            )}
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
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.white,
    opacity: 0.8,
    marginBottom: spacing.xl,
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
    marginBottom: spacing.md,
  },
  codeInput: {
    fontSize: 28,
    letterSpacing: 8,
    fontWeight: 'bold',
  },
  button: {
    width: '100%',
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginTop: spacing.md,
  },
  buttonGradient: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
  },
});
