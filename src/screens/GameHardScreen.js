import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal 
} from 'react-native';
import { useTracks } from '../hooks/UseTracks';
import AudioPlayer from '../components/game/AudioPlayer';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const GameHardScreen = ({ navigation }) => {
  const { tracks, loading } = useTracks('2000s', 10);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const generateTrack = (index) => {
    if (tracks.length === 0) return;
    setCurrentTrack(tracks[index]);
    setUserAnswer('');
    setFeedback('');
    setModalVisible(false);
  };

  const nextTrack = (timeout = false) => {
    // Si timeout et réponse pas correcte -> montrer modal
    if (timeout && userAnswer.trim().toLowerCase() !== currentTrack.trackName.trim().toLowerCase()) {
      setModalVisible(true);
      return;
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex >= tracks.length) {
      Alert.alert('Fin du jeu', `Score final : ${score}`);
      navigation.goBack();
      return;
    }
    setCurrentIndex(nextIndex);
    generateTrack(nextIndex);
  };

  const normalize = (str) =>
    str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\s]/g, '').trim();

  const isCorrect = () => {
    if (!currentTrack) return false;
    const trackWords = normalize(currentTrack.trackName).split(' ');
    const answerWords = normalize(userAnswer).split(' ');
    return trackWords.every(word => answerWords.includes(word));
  };

  const handleAnswerSubmit = () => {
    if (isCorrect()) {
      setFeedback('✅ Correct !');
      setScore(prev => prev + 1);
      setUserAnswer('');
      setTimeout(() => nextTrack(false), 800);
    } else {
      setFeedback('❌ Faux, essaie encore !');
    }
  };

  // Génère le premier track
  useEffect(() => {
    if (!loading && tracks.length > 0) {
      generateTrack(currentIndex);
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
        <Text style={styles.title}>🎵 Devine le titre !</Text>
        <Text style={styles.counter}>Morceau {currentIndex + 1}/{tracks.length}</Text>

        <View style={styles.progressContainer}>
          <AudioPlayer track={currentTrack} onEnd={() => nextTrack(true)} />
          <TouchableOpacity onPress={() => nextTrack(false)} style={styles.skipIcon}>
            <Ionicons name="arrow-forward-outline" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.answerContainer}>
          <TextInput
            style={styles.input}
            placeholder="Tape le titre ici"
            placeholderTextColor="#ccc"
            value={userAnswer}
            onChangeText={setUserAnswer}
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleAnswerSubmit}>
            <Text style={styles.submitButtonText}>Valider</Text>
          </TouchableOpacity>

          {feedback !== '' && <Text style={styles.feedback}>{feedback}</Text>}
        </View>

        <Text style={styles.score}>Score: {score}</Text>

        {/* Modal si réponse pas trouvée */}
        <Modal visible={modalVisible} transparent animationType="fade">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Temps écoulé !</Text>
              <Text style={styles.modalText}>La bonne réponse était :</Text>
              <Text style={styles.modalAnswer}>{currentTrack.trackName}</Text>
              <TouchableOpacity onPress={() => nextTrack(false)} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Suivant</Text>
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
  progressContainer: { width: '80%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 15 },
  skipIcon: { marginLeft: 10 },
  answerContainer: { width: '80%', marginTop: 20, alignItems: 'center' },
  input: { width: '100%', padding: 10, borderRadius: 8, backgroundColor: '#222', color: '#fff', marginBottom: 10 },
  submitButton: { backgroundColor: '#ff00c8', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 20, marginBottom: 10 },
  submitButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  feedback: { color: '#fff', fontSize: 16, marginTop: 5 },
  score: { fontSize: 18, marginTop: 10, color: '#fff' },
  counter: { fontSize: 16, marginBottom: 15, color: '#ccc' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loading: { fontSize: 18, color: '#fff' },
  button: { marginVertical: 10, width: '80%', borderRadius: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 8 },
  buttonGradient: { paddingVertical: 15, borderRadius: 28, alignItems: 'center' },

  // Modal
  modalContainer: { flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(0,0,0,0.6)' },
  modalContent: { backgroundColor:'#222', padding:20, borderRadius:12, alignItems:'center', width:'80%' },
  modalTitle: { fontSize:24, color:'#fff', fontWeight:'bold', marginBottom:10 },
  modalText: { fontSize:18, color:'#fff', marginBottom:10 },
  modalAnswer: { fontSize:20, color:'#ff00c8', fontWeight:'bold', marginBottom:15 },
  modalButton: { backgroundColor:'#ff00c8', paddingVertical:10, paddingHorizontal:25, borderRadius:20 },
  modalButtonText: { color:'#fff', fontWeight:'bold', fontSize:16 },
});

export default GameHardScreen;
