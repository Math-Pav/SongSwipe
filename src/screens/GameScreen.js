import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTracks } from '../hooks/UseTracks';
import AudioPlayer from '../components/game/AudioPlayer';
import QCM from '../components/game/QCM';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { saveScore } from '../services/scoreService';
import * as Haptics from 'expo-haptics';

const GameScreen = ({ navigation }) => {
  const { tracks, loading } = useTracks('2000s', 10);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [score, setScore] = useState(0);
  const [options, setOptions] = useState([]);
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

  const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

  const generateQuestion = (index) => {
    if (tracks.length === 0) return;

    const track = tracks[index];
    setCurrentTrack(track);

    // On filtre tous les autres morceaux valides (avec preview)
    const pool = tracks.filter(t => t.trackName !== track.trackName && t.previewUrl);

    // On choisit 3 morceaux aléatoires uniques pour le QCM
    let otherTracks = [];
    const poolCopy = [...pool]; // pour ne pas modifier l'original
    while (otherTracks.length < 3 && poolCopy.length > 0) {
      const randomIndex = Math.floor(Math.random() * poolCopy.length);
      otherTracks.push(poolCopy.splice(randomIndex, 1)[0]);
    }

    // Mélanger la bonne réponse avec les autres morceaux
    setOptions(shuffleArray([track, ...otherTracks]));
  };

  const handleAnswer = (answer) => {
    if (answer.trackName === currentTrack.trackName) {
      setScore(prev => prev + 1);
      Alert.alert('Bonne réponse !');
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(`Faux ! C'était ${currentTrack.trackName}`);
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
      const finalScore = score;
      endGame(finalScore);
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
      <ScrollView contentContainerStyle={{ ...styles.container, flexGrow: 1 }}>
        <Text style={styles.playerInfo}>Joueur : {playerName}</Text>
        <Text style={styles.title}>Devine le titre !</Text>
        <Text style={styles.artist}>Artiste : {currentTrack.artistName}</Text>
        <Text style={styles.counter}>Morceau {currentIndex + 1}/{tracks.length}</Text>

        <View style={styles.progressContainer}>
          <AudioPlayer track={currentTrack} onEnd={nextTrack} />
          <TouchableOpacity onPress={nextTrack} style={styles.skipIcon}>
            <Ionicons name="arrow-forward-outline" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        <QCM options={options} onSelect={handleAnswer} />

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
  container: { padding: 20, alignItems: 'center', justifyContent: 'center' },
  artistImage: { width: 120, height: 120, borderRadius: 60, marginBottom: 15 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#fff', textShadowColor: '#a400ff', textShadowRadius: 10 },
  artist: { fontSize: 18, marginBottom: 10, color: '#fff' },
  counter: { fontSize: 16, marginBottom: 15, color: '#ccc' },
  score: { fontSize: 18, marginTop: 10, color: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loading: { fontSize: 18, color: '#fff' },
  button: { marginVertical: 10, width: '80%', borderRadius: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 8 },
  buttonGradient: { paddingVertical: 15, borderRadius: 28, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  progressContainer: { width: '80%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 15 },
  skipIcon: { marginLeft: 10 },
  playerInfo: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 10,
  },
});

export default GameScreen;
