import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, ScrollView, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTracks } from '../hooks/UseTracks';
import AudioPlayer from '../components/game/AudioPlayer';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { saveScore } from '../services/scoreService';

// Fonction pour comparer les chaînes insensible à la casse et aux accents
const normalizeString = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
};

const GameHardScreen = ({ navigation }) => {
  const { tracks, loading } = useTracks('2000s', 10);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [score, setScore] = useState(0);
  const [playerName, setPlayerName] = useState('Joueur');
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');


  useEffect(() => {
    const loadPlayerName = async () => {
      const pseudo = await AsyncStorage.getItem('userPseudo');
      if (pseudo) setPlayerName(pseudo);
    };
    loadPlayerName();
  }, []);

  const generateQuestion = (index) => {
    if (tracks.length === 0) return;
    setCurrentTrack(tracks[index]);
    setUserAnswer('');
    setShowAnswerModal(false);
  };

  const checkAnswer = () => {
    if (!currentTrack) return;

    const correct = normalizeString(userAnswer) === normalizeString(currentTrack.trackName);

    if (correct) {
        setScore(prev => prev + 1);
        setUserAnswer('');
        setErrorMessage(''); // supprime le message d’erreur
        nextTrack();
        Keyboard.dismiss();
    } else {
        // Au lieu d'un alert, on met un message
        setErrorMessage('Mauvaise réponse, essayez encore !');
        setUserAnswer('');
    }
    };


  const handleEndOfMusic = () => {
    // La musique est finie, on montre la modal avec la bonne réponse
    setShowAnswerModal(true);
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

  const endGame = async (finalScore) => {
    await saveScore(playerName, finalScore);
    Alert.alert(
      'Fin du jeu',
      `Score final : ${finalScore}`,
      [
        { text: 'Voir classement', onPress: () => navigation.navigate('Classement') },
        { text: 'Retour', onPress: () => navigation.goBack() },
      ]
    );
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
          <AudioPlayer track={currentTrack} onEnd={handleEndOfMusic} />
        </View>

        <TextInput
            style={styles.input}
            placeholder="Tape le titre ici"
            placeholderTextColor="#ccc"
            value={userAnswer}
            onChangeText={(text) => {
                setUserAnswer(text);
                setErrorMessage('');
            }}
            onSubmitEditing={checkAnswer}
            returnKeyType="done"
        />

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}


        <TouchableOpacity style={styles.button} onPress={checkAnswer}>
          <LinearGradient colors={['#ff00c8', '#b300ff']} style={styles.buttonGradient}>
            <Text style={styles.buttonText}>Valider</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.score}>Score: {score}</Text>

        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <LinearGradient colors={['#ff00c8', '#b300ff']} style={styles.buttonGradient}>
            <Text style={styles.buttonText}>Retour Home</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Modal qui s'affiche si la musique est finie sans bonne réponse */}
        <Modal
          visible={showAnswerModal}
          transparent
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Fin de la musique !</Text>
              <Text style={styles.modalText}>Le titre correct était :</Text>
              <Text style={styles.correctTitle}>{currentTrack.trackName}</Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => nextTrack()}
              >
                <LinearGradient colors={['#ff00c8', '#b300ff']} style={styles.buttonGradient}>
                  <Text style={styles.buttonText}>Question suivante</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  container: { padding: 20, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#fff', textShadowColor: '#a400ff', textShadowRadius: 10 },
  artist: { fontSize: 18, marginBottom: 10, color: '#fff' },
  counter: { fontSize: 16, marginBottom: 15, color: '#ccc' },
  score: { fontSize: 18, marginTop: 10, color: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loading: { fontSize: 18, color: '#fff' },
  progressContainer: { width: '80%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 15 },
  playerInfo: { fontSize: 14, color: '#ccc', marginBottom: 10 },
  input: { 
    width: '80%', 
    height: 50, 
    borderColor: '#fff', 
    borderWidth: 1, 
    borderRadius: 25, 
    paddingHorizontal: 15, 
    marginBottom: 15, 
    color: '#fff', 
    fontSize: 16 
  },
  button: { marginVertical: 10, width: '80%', borderRadius: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 8 },
  buttonGradient: { paddingVertical: 15, borderRadius: 28, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#1a1a1a', borderRadius: 20, padding: 20, width: '100%', maxWidth: 350, alignItems: 'center' },
  modalTitle: { fontSize: 24, color: '#fff', fontWeight: 'bold', marginBottom: 10 },
  modalText: { fontSize: 16, color: '#ccc', marginBottom: 10 },
  correctTitle: { fontSize: 20, color: '#ff00c8', fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  modalButton: { width: '80%' },
  errorText: {
  color: '#ff4d4d',
  marginTop: 5,
  marginBottom: 10,
  fontSize: 16,
  textAlign: 'center',
},

});

export default GameHardScreen;
