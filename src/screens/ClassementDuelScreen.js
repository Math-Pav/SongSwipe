import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getDuelStats } from '../services/scoreService';

const ClassementDuelScreen = ({ navigation }) => {
  const [classementData, setClassementData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScores();
  }, []);

  const loadScores = async () => {
    setLoading(true);
    const stats = await getDuelStats();
    setClassementData(stats);
    setLoading(false);
  };

  const renderItem = ({ item, index }) => {
    const isTop3 = item.rank <= 3;
    const winRate = item.duels > 0 ? Math.round((item.wins / item.duels) * 100) : 0;

    return (
      <LinearGradient
        colors={[
          isTop3 ? 'rgba(255, 215, 0, 0.2)' : 'rgba(0, 0, 0, 0.2)',
          isTop3 ? 'rgba(255, 165, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)'
        ]}
        style={[styles.rankItem, isTop3 && styles.top3Item]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.rankContainer}>
          {isTop3 && (
            <Ionicons 
              name={item.rank === 1 ? 'trophy' : 'medal'} 
              size={24} 
              color={item.rank === 1 ? '#ffd700' : item.rank === 2 ? '#c0c0c0' : '#cd7f32'} 
            />
          )}
          <Text style={[styles.rankNumber, isTop3 && styles.top3RankNumber]}>
            {item.rank}
          </Text>
        </View>

        <View style={styles.playerInfo}>
          <Text style={[styles.playerName, isTop3 && styles.top3PlayerName]}>
            {item.name}
          </Text>
          <Text style={styles.playerStats}>
            {item.duels} duels - {winRate}% victoires
          </Text>
        </View>

        <View style={styles.winsContainer}>
          <Text style={[styles.winsText, isTop3 && styles.top3WinsText]}>
            {item.wins}
          </Text>
          <Text style={styles.winsLabel}>victoires</Text>
        </View>
      </LinearGradient>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="people-outline" size={60} color="#666" />
      <Text style={styles.emptyText}>Aucun duel joué</Text>
      <Text style={styles.emptySubtext}>Lancez un duel local pour apparaître ici !</Text>
    </View>
  );

  return (
    <LinearGradient
      colors={['#0a014f', '#120078', '#9d00ff']}
      style={styles.wrapper}
    >
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>

        <Ionicons name="trophy" size={60} color="#ffd700" style={styles.icon} />
        <Text style={styles.title}>Classement Duels</Text>
        <Text style={styles.subtitle}>Les meilleurs duellistes</Text>

        <View style={styles.rankingContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.headerText}>Rang</Text>
            <Text style={styles.headerText}>Joueur</Text>
            <Text style={styles.headerText}>Victoires</Text>
          </View>

          {loading ? (
            <Text style={styles.loadingText}>Chargement...</Text>
          ) : (
            <FlatList
              data={classementData}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={renderEmpty}
            />
          )}
        </View>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
          style={styles.homeButton}
        >
          <LinearGradient
            colors={['#ff00c8', '#b300ff']}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Retour</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  container: { flex: 1, padding: 20, paddingTop: 60, alignItems: 'center' },
  backButton: { position: 'absolute', top: 50, left: 20, zIndex: 10, padding: 10 },
  icon: { marginBottom: 10 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  subtitle: { color: '#ccc', fontSize: 16, marginBottom: 20 },
  rankingContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 15,
    padding: 10,
  },
  headerRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.3)',
    marginBottom: 5,
  },
  headerText: { color: '#ffd700', fontWeight: 'bold', flex: 1, textAlign: 'center' },
  listContent: { paddingBottom: 10 },
  rankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 4,
    borderRadius: 10,
  },
  top3Item: { borderWidth: 1, borderColor: 'rgba(255, 215, 0, 0.5)' },
  rankContainer: { flexDirection: 'row', alignItems: 'center', width: 60 },
  rankNumber: { color: '#aaa', fontWeight: 'bold', fontSize: 16, marginLeft: 5 },
  top3RankNumber: { color: '#ffd700', fontSize: 18, fontWeight: '900' },
  playerInfo: { flex: 1, marginLeft: 10 },
  playerName: { color: '#fff', fontWeight: '600', fontSize: 16 },
  top3PlayerName: { color: '#ffd700', fontWeight: '900' },
  playerStats: { color: '#aaa', fontSize: 12 },
  winsContainer: { alignItems: 'center', minWidth: 70 },
  winsText: { color: '#f093fb', fontWeight: 'bold', fontSize: 20 },
  top3WinsText: { color: '#ffd700', fontSize: 24 },
  winsLabel: { color: '#aaa', fontSize: 10 },
  emptyContainer: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 15 },
  emptySubtext: { color: '#aaa', fontSize: 14, marginTop: 5, textAlign: 'center' },
  loadingText: { color: '#fff', textAlign: 'center', padding: 20 },
  homeButton: { marginTop: 20, borderRadius: 30, overflow: 'hidden' },
  buttonGradient: { paddingVertical: 15, paddingHorizontal: 50 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
});

export default ClassementDuelScreen;
