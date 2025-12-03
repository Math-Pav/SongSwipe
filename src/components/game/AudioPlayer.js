import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Audio } from 'expo-av';
import * as Progress from 'react-native-progress';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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
      <LinearGradient
        colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
        style={styles.playerCard}
      >
        <View style={styles.iconContainer}>
          <Ionicons 
            name={isPlaying ? "volume-high" : "volume-mute"} 
            size={28} 
            color="#00ff88" 
          />
        </View>
        
        <View style={styles.progressWrapper}>
          <Progress.Bar 
            progress={progress} 
            width={null}
            height={8} 
            color="#00ff88"
            unfilledColor="rgba(255,255,255,0.2)"
            borderWidth={0}
            borderRadius={4}
            style={styles.progressBar}
          />
          <View style={styles.waveContainer}>
            {[...Array(12)].map((_, i) => (
              <View 
                key={i} 
                style={[
                  styles.waveLine,
                  { 
                    height: isPlaying ? 8 + Math.random() * 20 : 8,
                    backgroundColor: i < progress * 12 ? '#00ff88' : 'rgba(255,255,255,0.3)',
                  }
                ]} 
              />
            ))}
          </View>
        </View>

        <Text style={styles.statusText}>
          {isPlaying ? 'En lecture...' : 'Terminé'}
        </Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  iconContainer: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(0,255,136,0.15)',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  progressWrapper: {
    flex: 1,
  },
  progressBar: {
    width: '100%',
  },
  waveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    height: 30,
  },
  waveLine: {
    width: 4,
    borderRadius: 2,
  },
  statusText: {
    color: '#aaa',
    fontSize: 12,
    marginLeft: 10,
  },
});

export default AudioPlayer;