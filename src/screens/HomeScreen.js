// HomeScreen.js
import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const HomeScreen = ({ navigation }) => {
  return (
    <LinearGradient
      colors={['#0a014f', '#120078', '#9d00ff']}
      style={styles.wrapper}
    >
      <ScrollView contentContainerStyle={{ ...styles.container, flexGrow: 1 }}>
        
        <Text style={styles.title}>SongSwipe</Text>

        <Text style={styles.subtitle}>
          Défie tes amis et ta famille dans ce jeu de blind test musical palpitant !{"\n"}{"\n"}
        </Text>

        <TouchableOpacity onPress={() => navigation.navigate('Game')} activeOpacity={0.8}>
          <LinearGradient
            colors={['#ff00c8', '#b300ff']}
            style={styles.buttonBorder}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>COMMENCER</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>



      </ScrollView>
    </LinearGradient>
  );
};

export default HomeScreen;


const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#ffffff',
    textShadowColor: '#a400ff',
    textShadowRadius: 25,
    marginBottom: 40,
  },

  subtitle: {
    color: '#ddd',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    fontStyle: 'italic',
    width: '80%',
  },
  buttonBorder: {
    borderRadius: 32,    
    padding: 4,            
    marginVertical: 10,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },

  buttonContent: {
    backgroundColor: '#be68b4ffff',
    borderRadius: 28,         
    paddingVertical: 15,
    paddingHorizontal: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
