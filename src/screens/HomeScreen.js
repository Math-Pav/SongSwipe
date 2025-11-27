// HomeScreen.js
import React from 'react';
import { ScrollView, View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <Text style={styles.title}>🎵 Blind Test Party</Text>
      <Text style={styles.subtitle}>Devine le son en 30jyhgyugyufufuy secondes !</Text>

      {/* Bouton principal */}
      <TouchableOpacity
        style={styles.playButton}
        onPress={() => navigation.navigate('Game')} // navigation vers GameScreen
      >
        <Text style={styles.playButtonText}>Jouer Maintenant</Text>
      </TouchableOpacity>

      {/* Modes de jeu */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Modes de jeu</Text>
        <Button title="Mode Classique" onPress={() => navigation.navigate('Game')} />
        <Button title="QCM" onPress={() => navigation.navigate('Game')} />
        <Button title="Speed Run" onPress={() => navigation.navigate('Game')} />
      </View>

      {/* Catégories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Catégories</Text>
        <Button title="Années 2000" onPress={() => navigation.navigate('Game')} />
        <Button title="Pop" onPress={() => navigation.navigate('Game')} />
        <Button title="Rock" onPress={() => navigation.navigate('Game')} />
        <Button title="Rap" onPress={() => navigation.navigate('Game')} />
      </View>

      {/* Paramètres / autres */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Paramètres</Text>
        <Button title="Règles du jeu" onPress={() => alert('Règles du jeu : devine le titre ou l’artiste !')} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#555',
    textAlign: 'center',
  },
  playButton: {
    backgroundColor: '#1DB954',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 30,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    width: '100%',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
});

export default HomeScreen;
