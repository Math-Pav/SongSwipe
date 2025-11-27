// GameScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';

const GameScreen = ({ navigation, route }) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Exemple de morceau (en attendant l'API)
  const sampleTrack = {
    trackName: 'One More Time',
    artistName: 'Daft Punk',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/18/8b/5d/188b5d61-5d45-bbfa-ff58-d4c1f15f3ed8/mzaf_8996501927000123115.plus.aac.p.m4a'
  };

  const playSound = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }

    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: sampleTrack.previewUrl },
      { shouldPlay: true }
    );
    setSound(newSound);
    setIsPlaying(true);

    newSound.setOnPlaybackStatusUpdate(status => {
      if (status.didJustFinish) {
        setIsPlaying(false);
      }
    });
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎵 Devine le titre !</Text>
      <Text style={styles.track}>Artiste : {sampleTrack.artistName}</Text>
      {/* Bouton Play / Stop */}
      <TouchableOpacity
        style={styles.playButton}
        onPress={isPlaying ? stopSound : playSound}
      >
        <Text style={styles.playButtonText}>{isPlaying ? 'Stop' : 'Jouer le son'}</Text>
      </TouchableOpacity>

      {/* Exemple de réponse */}
      <View style={styles.answers}>
        <Button title="One More Time" onPress={() => alert('Bonne réponse !')} />
        <Button title="Around the World" onPress={() => alert('Faux !')} />
        <Button title="Harder, Better, Faster, Stronger" onPress={() => alert('Faux !')} />
        <Button title="Digital Love" onPress={() => alert('Faux !')} />
      </View>

      {/* Retour Home */}
      <Button title="Retour Home" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  track: { fontSize: 18, marginBottom: 20 },
  playButton: { backgroundColor: '#1DB954', padding: 15, borderRadius: 30, marginBottom: 20 },
  playButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  answers: { width: '100%', marginBottom: 20 },
});

export default GameScreen;
