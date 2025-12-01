import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';
import { wsService } from '../services/websocket';

const SERVER_URL = 'ws://172.20.10.3:3001';

export default function CreateGameScreen({ navigation }) {
  const [pseudo, setPseudo] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleRoomCreated = (data) => {
      setLoading(false);
      navigation.replace('Lobby', {
        roomCode: data.roomCode,
        playerId: data.playerId,
        players: data.players,
        isHost: true,
      });
    };

    const handleError = (data) => {
      setLoading(false);
      Alert.alert('Erreur', data.message);
    };

    wsService.on('ROOM_CREATED', handleRoomCreated);
    wsService.on('ERROR', handleError);

    return () => {
      wsService.off('ROOM_CREATED', handleRoomCreated);
      wsService.off('ERROR', handleError);
    };
  }, [navigation]);

  const handleCreate = async () => {
    if (pseudo.trim().length < 2) {
      Alert.alert('Erreur', 'Le pseudo doit contenir au moins 2 caractères');
      return;
    }

    setLoading(true);
    try {
      await wsService.connect(SERVER_URL);
      wsService.createRoom(pseudo.trim());
    } catch (error) {
      setLoading(false);
      console.log('Erreur connexion:', error);
      Alert.alert('Erreur de connexion', 'Vérifie que le serveur est lancé et que tu es sur le même réseau Wi-Fi');
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
        <Ionicons name="add-circle" size={80} color={colors.accent} />
        <Text style={styles.title}>Créer une partie</Text>
        <Text style={styles.subtitle}>Entrez votre pseudo pour commencer</Text>

        <TextInput
          style={styles.input}
          placeholder="Votre pseudo"
          placeholderTextColor="#999"
          value={pseudo}
          onChangeText={setPseudo}
          maxLength={20}
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleCreate}
          disabled={loading}
        >
          <LinearGradient
            colors={['#ff00c8', '#b300ff']}
            style={styles.buttonGradient}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.buttonText}>Créer la partie</Text>
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
    marginBottom: spacing.lg,
  },
  button: {
    width: '100%',
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
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
