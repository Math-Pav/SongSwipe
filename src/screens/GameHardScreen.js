import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTracks } from '../hooks/UseTracks';
import AudioPlayer from '../components/game/AudioPlayer';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { saveScore } from '../services/scoreService';
import * as Haptics from 'expo-haptics';

const GameHardScreen = ({ navigation }) => {
  const { tracks, loading } = useTracks('2000s', 10);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [playerName, setPlayerName] = useState('Joueur');

  useEffect(() => {
    const loadPlayerName = async () => {
      const pseudo = await AsyncStorage.getItem('userPseudo');
      if (pseudo) {
        setPlayerName(pseudo);
      }
    };
    loadPlayerName();
  }, []);

  const generateQuestion = (index) => {
    if (tracks.length === 0) return;
    const track = tracks[index];
    setCurrentTrack(track);
    setUserAnswer('');
  };

  const normalizeString = (str) => {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '')
      .trim();
  };

  const handleSubmit = () => {
    if (!userAnswer.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer une réponse');
      return;
    }

    const normalizedAnswer = normalizeString(userAnswer);
    const normalizedTrack = normalizeString(currentTrack.trackName);

    if (normalizedTrack.includes(normalizedAnswer) || normalizedAnswer.includes(normalizedTrack)) {
      setScore(prev => prev + 1);
      Alert.alert('Bonne réponse !');
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Faux !', `C'était ${currentTrack.trackName}`);
    }
    nextTrack();
  };

  const endGame = async (finalScore) => {
    await saveScore(playerName, finalScore);
    Alert.alert(
      'Fin du jeu',
      `Score final : ${finalScore}`,
      [
        {
          text: 'Voir classement',
          onPress: () => navigation.navigate('Classement'),
        },
        {
          text: 'Retour',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const nextTrack = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= tracks.length) {
      endGame(score);
      return;
    }
    setCurrentIndex(nextIndex);
    generateQuestion(nextIndex);
  };

  useEffect(() => {
    if (!loading && tracks.length > 0) {
      generateQuestion(currentIndex);
    }
  }, [loading, tracks]);

  if (loading || !currentTrack) {
    return (
      <LinearGradient colors={['#0a014f', '#120078', '#9d00ff']} style={styles.wrapper}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loading}>Chargement des morceaux...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0a014f', '#120078', '#9d00ff']} style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.playerInfo}>Joueur : {playerName}</Text>
        <Text style={styles.title}>Mode Difficile</Text>
        <Text style={styles.artist}>Artiste : {currentTrack.artistName}</Text>
        <Text style={styles.counter}>Morceau {currentIndex + 1}/{tracks.length}</Text>

        <View style={styles.progressContainer}>
          <AudioPlayer track={currentTrack} onEnd={nextTrack} />
          <TouchableOpacity onPress={nextTrack} style={styles.skipIcon}>
            <Ionicons name="arrow-forward-outline" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Entrez le titre..."
          placeholderTextColor="#999"
          value={userAnswer}
          onChangeText={setUserAnswer}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <LinearGradient colors={['#00ff88', '#00cc6a']} style={styles.buttonGradient}>
            <Text style={styles.buttonText}>Valider</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.score}>Score: {score}</Text>

        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <LinearGradient colors={['#ff00c8', '#b300ff']} style={styles.buttonGradient}>
            <Text style={styles.buttonText}>Retour Home</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  container: { padding: 20, alignItems: 'center', justifyContent: 'center', flexGrow: 1 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#fff', textShadowColor: '#a400ff', textShadowRadius: 10 },
  artist: { fontSize: 18, marginBottom: 10, color: '#fff' },
  counter: { fontSize: 16, marginBottom: 15, color: '#ccc' },
  score: { fontSize: 18, marginTop: 10, color: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loading: { fontSize: 18, color: '#fff' },
  button: { marginVertical: 10, width: '80%', borderRadius: 32 },
  submitButton: { marginVertical: 10, width: '80%', borderRadius: 32 },
  buttonGradient: { paddingVertical: 15, borderRadius: 28, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  progressContainer: { width: '80%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 15 },
  skipIcon: { marginLeft: 10 },
  playerInfo: { fontSize: 14, color: '#ccc', marginBottom: 10 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 15,
    paddingHorizontal: 20,
    fontSize: 18,
    color: '#0a014f',
    width: '80%',
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default GameHardScreen;
