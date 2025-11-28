// ClassementScreen.js
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const CLASSMENT_DATA = [
  { id: '1', rank: 1, name: 'Alice', score: 1500, games: 25 },
  { id: '2', rank: 2, name: 'Bob', score: 1200, games: 22 },
  { id: '3', rank: 3, name: 'Charlie', score: 1100, games: 20 },
  { id: '4', rank: 4, name: 'Diana', score: 950, games: 18 },
  { id: '5', rank: 5, name: 'Eve', score: 800, games: 15 },
  { id: '6', rank: 6, name: 'Frank', score: 750, games: 14 },
  { id: '7', rank: 7, name: 'Grace', score: 600, games: 12 },
  { id: '8', rank: 8, name: 'Henry', score: 550, games: 10 },
];

const ClassementScreen = ({ navigation }) => {
  const renderItem = ({ item, index }) => {
    const isTop3 = item.rank <= 3;

    return (
      <LinearGradient
        colors={[
          isTop3 ? 'rgba(182, 104, 180, 0.3)' : 'rgba(0, 0, 0, 0.2)',
          isTop3 ? 'rgba(141, 45, 141, 0.3)' : 'rgba(0, 0, 0, 0.1)'
        ]}
        style={[
          styles.rankItem,
          index % 2 === 0 && !isTop3 && styles.rankItemEven
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.rankContainer}>
          {isTop3 && (
            <Text style={styles.medal}>
              {item.rank === 1 ? '👑' : item.rank === 2 ? '🥈' : '🥉'}
            </Text>
          )}
          <Text style={[
            styles.rankNumber,
            isTop3 && styles.top3RankNumber
          ]}>
            {item.rank}
          </Text>
        </View>

        <View style={styles.playerInfo}>
          <Text style={[
            styles.playerName,
            isTop3 && styles.top3PlayerName
          ]}>
            {item.name}
          </Text>
          <Text style={styles.playerStats}>
            {item.games} parties
          </Text>
        </View>

        <Text style={[
          styles.playerScore,
          isTop3 && styles.top3PlayerScore
        ]}>
          {item.score} pts
        </Text>
      </LinearGradient>
    );
  };

  return (
    <LinearGradient
      colors={['#0a014f', '#120078', '#9d00ff']}
      style={styles.wrapper}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Classement</Text>

        <Text style={styles.subtitle}>
          Les meilleurs joueurs de SongSwipe{"\n"}
          Tentez de les dépasser !
        </Text>

        <View style={styles.rankingContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.headerText}>Rang</Text>
            <Text style={styles.headerText}>Joueur</Text>
            <Text style={styles.headerText}>Score</Text>
          </View>

          <FlatList
            data={CLASSMENT_DATA}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
          />
        </View>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
          style={styles.backButton}
        >
          <LinearGradient
            colors={['#ff00c8', '#b300ff']}
            style={styles.buttonBorder}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>RETOUR</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    fontStyle: 'italic',
    color: '#ffffff',
    textShadowColor: '#a400ff',
    textShadowRadius: 25,
    marginBottom: 10,
  },
  subtitle: {
    color: '#ddd',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  rankingContainer: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 15,
    padding: 10,
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(182, 104, 180, 0.5)',
    marginBottom: 5,
  },
  headerText: {
    color: '#be68b4',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 10,
  },
  rankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 4,
    borderRadius: 10,
  },
  rankItemEven: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 60,
  },
  medal: {
    fontSize: 18,
    marginRight: 5,
  },
  rankNumber: {
    color: '#be68b4',
    fontWeight: 'bold',
    fontSize: 16,
    width: 20,
    textAlign: 'center',
  },
  top3RankNumber: {
    color: '#ffd700',
    fontSize: 18,
    fontWeight: '900',
  },
  playerInfo: {
    flex: 1,
    marginLeft: 10,
  },
  playerName: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  top3PlayerName: {
    color: '#ffd700',
    fontWeight: '900',
  },
  playerStats: {
    color: '#aaa',
    fontSize: 12,
    fontStyle: 'italic',
  },
  playerScore: {
    color: '#be68b4',
    fontWeight: 'bold',
    fontSize: 16,
    width: 80,
    textAlign: 'right',
  },
  top3PlayerScore: {
    color: '#ffd700',
    fontSize: 17,
    fontWeight: '900',
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
    backgroundColor: '#be68b4',
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
  backButton: {
    marginTop: 'auto',
  },
});

export default ClassementScreen;
