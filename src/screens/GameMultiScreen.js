import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';
import { wsService } from '../services/websocket';
import AudioPlayer from '../components/game/AudioPlayer';
import QCM from '../components/game/QCM';

export default function GameMultiScreen({ navigation, route }) {
  const { roomCode, playerId, isHost, tracks } = route.params;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTrack, setCurrentTrack] = useState(tracks[0]);
  const [options, setOptions] = useState([]);
  const [scores, setScores] = useState([]);
  const [hasAnswered, setHasAnswered] = useState(false);

  const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

  const generateOptions = (index) => {
    const track = tracks[index];
    setCurrentTrack(track);
    setHasAnswered(false);

    const pool = tracks.filter(t => t.trackName !== track.trackName);
    const otherTracks = shuffleArray(pool).slice(0, 3);
    setOptions(shuffleArray([track, ...otherTracks]));
  };

  useEffect(() => {
    generateOptions(0);

    const handlePlayerAnswered = (data) => {
      setScores(data.scores);
    };

    const handleNextTrack = (data) => {
      setCurrentIndex(data.currentTrackIndex);
      generateOptions(data.currentTrackIndex);
    };

    const handleGameFinished = (data) => {
      navigation.replace('GameMultiResults', {
        finalScores: data.finalScores,
        roomCode,
      });
    };

    wsService.on('PLAYER_ANSWERED', handlePlayerAnswered);
    wsService.on('NEXT_TRACK', handleNextTrack);
    wsService.on('GAME_FINISHED', handleGameFinished);

    return () => {
      wsService.off('PLAYER_ANSWERED', handlePlayerAnswered);
      wsService.off('NEXT_TRACK', handleNextTrack);
      wsService.off('GAME_FINISHED', handleGameFinished);
    };
  }, []);

  const handleAnswer = (answer) => {
    if (hasAnswered) return;
    
    setHasAnswered(true);
    const correct = answer.trackName === currentTrack.trackName;
    wsService.submitAnswer(roomCode, correct, correct ? 1 : 0);

    if (correct) {
      Alert.alert('Bonne réponse !');
    } else {
      Alert.alert('Faux !', `C'était ${currentTrack.trackName}`);
    }
  };

  const handleNextTrack = () => {
    if (isHost) {
      wsService.nextTrack(roomCode);
    }
  };

  return (
    <LinearGradient colors={colors.gradientPrimary} style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.counter}>Morceau {currentIndex + 1}/{tracks.length}</Text>
        <Text style={styles.title}>Devine le titre !</Text>
        <Text style={styles.artist}>Artiste : {currentTrack?.artistName}</Text>

        <View style={styles.progressContainer}>
          <AudioPlayer track={currentTrack} onEnd={handleNextTrack} />
        </View>

        <QCM options={options} onSelect={handleAnswer} />

        <View style={styles.scoresContainer}>
          <Text style={styles.scoresTitle}>Scores</Text>
          {scores.map((player, index) => (
            <View key={player.id} style={styles.scoreRow}>
              <Text style={styles.scorePseudo}>{player.pseudo}</Text>
              <Text style={styles.scorePoints}>{player.score} pts</Text>
            </View>
          ))}
        </View>

        {isHost && hasAnswered && (
          <TouchableOpacity style={styles.nextButton} onPress={handleNextTrack}>
            <LinearGradient colors={['#ff00c8', '#b300ff']} style={styles.nextGradient}>
              <Text style={styles.nextText}>Suivant</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  container: { padding: spacing.lg, alignItems: 'center' },
  counter: { color: '#ccc', marginBottom: spacing.sm },
  title: { ...typography.h2, color: colors.white, marginBottom: spacing.md },
  artist: { color: colors.white, marginBottom: spacing.md },
  progressContainer: { width: '100%', marginVertical: spacing.md },
  scoresContainer: {
    width: '100%',
    backgroundColor: colors.glassEffect,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  scoresTitle: {
    ...typography.h3,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  scorePseudo: { color: colors.white },
  scorePoints: { color: colors.accent, fontWeight: 'bold' },
  nextButton: {
    marginTop: spacing.lg,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    width: '100%',
  },
  nextGradient: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  nextText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: typography.fontSize.lg,
  },
});
