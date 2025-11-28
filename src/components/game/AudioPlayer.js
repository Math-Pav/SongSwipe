import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import * as Progress from 'react-native-progress';

const AudioPlayer = ({ track, onEnd }) => {
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef(null);
  const currentTrackRef = useRef(null);

  useEffect(() => {
    const playSound = async () => {
      if (!track) return;

      if (currentTrackRef.current?.trackName === track.trackName) return;
      currentTrackRef.current = track;

      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: track.previewUrl },
        { shouldPlay: true }
      );

      soundRef.current = sound;
      setIsPlaying(true);
      setProgress(0);

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setProgress(status.positionMillis / status.durationMillis);
          if (status.didJustFinish) {
            setIsPlaying(false);
            onEnd();
          }
        }
      });

      await sound.playAsync();
    };

    playSound();

    return () => {
      if (soundRef.current) {
        soundRef.current.stopAsync();
        soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    };
  }, [track]);

  return (
    <View style={styles.container}>
      <Progress.Bar progress={progress} width={250} height={10} color="#1DB954" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default AudioPlayer;