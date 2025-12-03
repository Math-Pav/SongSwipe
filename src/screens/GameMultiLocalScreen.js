import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTracks } from '../hooks/UseTracks';
import AudioPlayer from '../components/game/AudioPlayer';
import QCM from '../components/game/QCM';
import * as Haptics from 'expo-haptics';
import { colors, spacing, borderRadius } from '../theme';
import { saveDuelScore } from '../services/scoreService';

export default function GameMultiLocalScreen({ navigation, route }) {
  const { player1, player2, difficulty } = route.params;
  const { tracks, loading } = useTracks('2000s', 20);
  
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [player1TrackIndex, setPlayer1TrackIndex] = useState(0);
  const [player2TrackIndex, setPlayer2TrackIndex] = useState(1);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [options, setOptions] = useState([]);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [userAnswer, setUserAnswer] = useState('');
  const [showPassModal, setShowPassModal] = useState(false);
  const [passTimer, setPassTimer] = useState(5);
  const [gameEnded, setGameEnded] = useState(false);
  const [roundsPlayed, setRoundsPlayed] = useState(0);
  const maxRounds = 10;
  
  const timerRef = useRef(null);

  const getCurrentPlayerName = () => currentPlayer === 1 ? player1 : player2;
  const getCurrentTrackIndex = () => currentPlayer === 1 ? player1TrackIndex : player2TrackIndex;

  const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

  const generateQuestion = (trackIndex) => {
    if (tracks.length === 0 || trackIndex >= tracks.length) return;
    const track = tracks[trackIndex];
    setCurrentTrack(track);
    setUserAnswer('');

    if (difficulty === 'easy') {
      const pool = tracks.filter(t => t.trackName !== track.trackName && t.previewUrl);
      const otherTracks = shuffleArray(pool).slice(0, 3);
      setOptions(shuffleArray([track, ...otherTracks]));
    }
  };

  const normalizeString = (str) => {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '')
      .trim();
  };

  const handleAnswer = (answer) => {
    let correct = false;
    
    if (difficulty === 'easy') {
      correct = answer.trackName === currentTrack.trackName;
    } else {
      const normalizedAnswer = normalizeString(userAnswer);
      const normalizedTrack = normalizeString(currentTrack.trackName);
      correct = normalizedTrack.includes(normalizedAnswer) || normalizedAnswer.includes(normalizedTrack);
    }

    if (correct) {
      setScores(prev => ({
        ...prev,
        [currentPlayer === 1 ? 'player1' : 'player2']: prev[currentPlayer === 1 ? 'player1' : 'player2'] + 1
      }));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    Alert.alert(
      correct ? 'Bonne réponse !' : 'Faux !',
      correct ? `+1 point pour ${getCurrentPlayerName()}` : `C'était "${currentTrack.trackName}"`,
      [{ text: 'OK', onPress: () => nextTurn() }]
    );
  };

  const handleSubmitHard = () => {
    if (!userAnswer.trim()) {
      Alert.alert('Erreur', 'Entre une réponse');
      return;
    }
    handleAnswer(null);
  };

  const nextTurn = () => {
    const newRoundsPlayed = roundsPlayed + 1;
    setRoundsPlayed(newRoundsPlayed);

    if (newRoundsPlayed >= maxRounds) {
      endGame();
      return;
    }

    const nextPlayer = currentPlayer === 1 ? 2 : 1;
    setCurrentPlayer(nextPlayer);

    if (nextPlayer === 1) {
      setPlayer1TrackIndex(prev => prev + 2);
    } else {
      setPlayer2TrackIndex(prev => prev + 2);
    }
    
    setShowPassModal(true);
    setPassTimer(5);
  };

  const startPassTimer = () => {
    timerRef.current = setInterval(() => {
      setPassTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setShowPassModal(false);
          const nextIndex = currentPlayer === 1 ? player1TrackIndex + 2 : player2TrackIndex + 2;
          generateQuestion(nextIndex);
          return 5;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (showPassModal) {
      startPassTimer();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [showPassModal]);

  const skipPassModal = () => {
    clearInterval(timerRef.current);
    setShowPassModal(false);
    generateQuestion(getCurrentTrackIndex());
  };

  const endGame = async () => {
    await saveDuelScore(player1, scores.player1, player2, scores.player2);
    setGameEnded(true);
  };

  useEffect(() => {
    if (!loading && tracks.length > 0) {
      generateQuestion(0);
    }
  }, [loading, tracks]);

  if (loading || !currentTrack) {
    return (
      <LinearGradient colors={['#0a014f', '#120078', '#9d00ff']} style={styles.wrapper}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loading}>Chargement...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (gameEnded) {
    const winner = scores.player1 > scores.player2 ? player1 : 
                   scores.player2 > scores.player1 ? player2 : 'Égalité';
    
    return (
      <LinearGradient colors={['#0a014f', '#120078', '#9d00ff']} style={styles.wrapper}>
        <View style={styles.endContainer}>
          <Ionicons name="trophy" size={100} color="#ffd700" />
          <Text style={styles.endTitle}>Fin du duel !</Text>
          
          <View style={styles.finalScores}>
            <View style={[styles.playerScore, scores.player1 >= scores.player2 && styles.winnerScore]}>
              <Text style={styles.playerName}>{player1}</Text>
              <Text style={styles.scoreText}>{scores.player1} pts</Text>
            </View>
            <Text style={styles.vs}>VS</Text>
            <View style={[styles.playerScore, scores.player2 >= scores.player1 && styles.winnerScore]}>
              <Text style={styles.playerName}>{player2}</Text>
              <Text style={styles.scoreText}>{scores.player2} pts</Text>
            </View>
          </View>

          <Text style={styles.winnerText}>
            {winner === 'Égalité' ? 'Match nul !' : `${winner} gagne !`}
          </Text>

          <TouchableOpacity style={styles.classementButton} onPress={() => navigation.navigate('ClassementDuel')}>
            <LinearGradient colors={['#ffd700', '#ffaa00']} style={styles.classementGradient}>
              <Ionicons name="trophy" size={20} color="#0a014f" />
              <Text style={styles.classementText}>Voir le classement</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Home')}>
            <LinearGradient colors={['#ff00c8', '#b300ff']} style={styles.homeGradient}>
              <Text style={styles.homeText}>Retour à l'accueil</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0a014f', '#120078', '#9d00ff']} style={styles.wrapper}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={[styles.playerIndicator, currentPlayer === 1 && styles.activePlayer]}>
              <Text style={styles.playerHeaderName}>{player1}</Text>
              <Text style={styles.playerHeaderScore}>{scores.player1} pts</Text>
            </View>
            <Text style={styles.vsSmall}>VS</Text>
            <View style={[styles.playerIndicator, currentPlayer === 2 && styles.activePlayer]}>
              <Text style={styles.playerHeaderName}>{player2}</Text>
              <Text style={styles.playerHeaderScore}>{scores.player2} pts</Text>
            </View>
          </View>

          <View style={styles.centerContent}>
            <Text style={styles.currentTurn}>Tour de {getCurrentPlayerName()}</Text>
            <Text style={styles.counter}>Manche {roundsPlayed + 1}/{maxRounds}</Text>
            
            <Text style={styles.artist}>Artiste : {currentTrack.artistName}</Text>

            <View style={styles.audioContainer}>
              <AudioPlayer track={currentTrack} onEnd={() => {}} />
            </View>

            {difficulty === 'easy' ? (
              <QCM options={options} onSelect={handleAnswer} />
            ) : (
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Entre le titre de la chanson..."
                  placeholderTextColor="#888"
                  value={userAnswer}
                  onChangeText={setUserAnswer}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                  onSubmitEditing={handleSubmitHard}
                  blurOnSubmit={false}
                />
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmitHard}>
                  <LinearGradient colors={['#00ff88', '#00cc6a']} style={styles.submitGradient}>
                    <Ionicons name="checkmark-circle" size={24} color="#fff" />
                    <Text style={styles.submitText}>Valider</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>

      <Modal visible={showPassModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="swap-horizontal" size={60} color="#f093fb" />
            <Text style={styles.modalTitle}>Passe le téléphone !</Text>
            <Text style={styles.modalSubtitle}>C'est au tour de</Text>
            <Text style={styles.modalPlayer}>{getCurrentPlayerName()}</Text>
            <Text style={styles.timerText}>{passTimer}</Text>
            <TouchableOpacity style={styles.readyButton} onPress={skipPassModal}>
              <Text style={styles.readyText}>Je suis prêt !</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  keyboardView: { flex: 1 },
  container: { flex: 1, padding: 20, paddingTop: 60 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loading: { color: '#fff', fontSize: 18 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, width: '100%', justifyContent: 'space-between' },
  playerIndicator: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 10, borderRadius: 12, alignItems: 'center', flex: 1 },
  activePlayer: { backgroundColor: 'rgba(240,147,251,0.3)', borderWidth: 2, borderColor: '#f093fb' },
  playerHeaderName: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  playerHeaderScore: { color: '#ffd700', fontWeight: 'bold', fontSize: 16 },
  vsSmall: { color: '#fff', fontWeight: 'bold', marginHorizontal: 10 },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  currentTurn: { color: '#f093fb', fontSize: 22, fontWeight: 'bold', marginBottom: 5, textAlign: 'center' },
  counter: { color: '#ccc', marginBottom: 15, textAlign: 'center' },
  artist: { color: '#fff', fontSize: 18, marginBottom: 20, textAlign: 'center' },
  audioContainer: { width: '100%', marginBottom: 30, alignItems: 'center' },
  inputContainer: { width: '100%', alignItems: 'center', marginTop: 20 },
  input: { 
    backgroundColor: '#fff', 
    borderRadius: 20, 
    paddingVertical: 20,
    paddingHorizontal: 25,
    fontSize: 20, 
    width: '95%', 
    textAlign: 'center', 
    marginBottom: 15,
    fontWeight: '600',
    color: '#0a014f',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 3,
    borderColor: '#f093fb',
  },
  submitButton: { width: '95%', borderRadius: 20, overflow: 'hidden' },
  submitGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, gap: 10 },
  submitText: { color: '#fff', fontWeight: 'bold', fontSize: 20 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#1a1a2e', padding: 40, borderRadius: 20, alignItems: 'center', marginHorizontal: 20 },
  modalTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 20, textAlign: 'center' },
  modalSubtitle: { color: '#ccc', fontSize: 16, marginTop: 10 },
  modalPlayer: { color: '#f093fb', fontSize: 28, fontWeight: 'bold', marginTop: 5 },
  timerText: { color: '#ffd700', fontSize: 60, fontWeight: 'bold', marginTop: 20 },
  readyButton: { backgroundColor: '#f093fb', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 30, marginTop: 20 },
  readyText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  endContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  endTitle: { color: '#fff', fontSize: 32, fontWeight: 'bold', marginTop: 20 },
  finalScores: { flexDirection: 'row', alignItems: 'center', marginTop: 30, width: '100%', justifyContent: 'space-around' },
  playerScore: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 20, borderRadius: 16, alignItems: 'center', minWidth: 120 },
  winnerScore: { backgroundColor: 'rgba(255,215,0,0.2)', borderWidth: 2, borderColor: '#ffd700' },
  playerName: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  scoreText: { color: '#ffd700', fontWeight: 'bold', fontSize: 24, marginTop: 5 },
  vs: { color: '#fff', fontWeight: 'bold', fontSize: 20 },
  winnerText: { color: '#ffd700', fontSize: 24, fontWeight: 'bold', marginTop: 30 },
  homeButton: { marginTop: 40, borderRadius: 30, overflow: 'hidden' },
  homeGradient: { paddingVertical: 15, paddingHorizontal: 50 },
  homeText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  classementButton: { marginTop: 30, borderRadius: 30, overflow: 'hidden' },
  classementGradient: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 30, gap: 10 },
  classementText: { color: '#0a014f', fontWeight: 'bold', fontSize: 16 },
});
