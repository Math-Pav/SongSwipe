import AsyncStorage from '@react-native-async-storage/async-storage';

const SCORES_KEY = 'songswipe_scores';
const DUEL_SCORES_KEY = 'songswipe_duel_scores';

export const saveScore = async (playerName, score, gamesPlayed = 1) => {
  try {
    const existingScores = await getScores();
    const existingPlayerIndex = existingScores.findIndex(s => s.name === playerName);

    if (existingPlayerIndex !== -1) {
      const existing = existingScores[existingPlayerIndex];
      existingScores[existingPlayerIndex] = {
        ...existing,
        score: Math.max(existing.score, score),
        games: existing.games + 1,
      };
    } else {
      existingScores.push({
        id: Date.now().toString(),
        name: playerName,
        score: score,
        games: gamesPlayed,
      });
    }

    existingScores.sort((a, b) => b.score - a.score);

    existingScores.forEach((player, index) => {
      player.rank = index + 1;
    });

    await AsyncStorage.setItem(SCORES_KEY, JSON.stringify(existingScores));
    return existingScores;
  } catch (error) {
    console.error('Erreur saveScore:', error);
    return [];
  }
};

export const getScores = async () => {
  try {
    const scoresJson = await AsyncStorage.getItem(SCORES_KEY);
    if (scoresJson) {
      return JSON.parse(scoresJson);
    }
    return [];
  } catch (error) {
    console.error('Erreur getScores:', error);
    return [];
  }
};

export const clearScores = async () => {
  try {
    await AsyncStorage.removeItem(SCORES_KEY);
  } catch (error) {
    console.error('Erreur clearScores:', error);
  }
};

export const saveDuelScore = async (player1Name, player1Score, player2Name, player2Score) => {
  try {
    const existingDuels = await getDuelScores();
    
    const winner = player1Score > player2Score ? player1Name : 
                   player2Score > player1Score ? player2Name : 'Égalité';
    
    existingDuels.push({
      id: Date.now().toString(),
      player1: { name: player1Name, score: player1Score },
      player2: { name: player2Name, score: player2Score },
      winner: winner,
      date: new Date().toISOString(),
    });

    const updatePlayerStats = (scores, playerName, won) => {
      const playerIndex = scores.findIndex(s => s.name === playerName);
      if (playerIndex !== -1) {
        scores[playerIndex].duels = (scores[playerIndex].duels || 0) + 1;
        scores[playerIndex].wins = (scores[playerIndex].wins || 0) + (won ? 1 : 0);
      } else {
        scores.push({
          id: Date.now().toString() + playerName,
          name: playerName,
          duels: 1,
          wins: won ? 1 : 0,
        });
      }
    };

    const duelStats = await getDuelStats();
    updatePlayerStats(duelStats, player1Name, player1Score > player2Score);
    updatePlayerStats(duelStats, player2Name, player2Score > player1Score);
    
    duelStats.sort((a, b) => b.wins - a.wins);
    duelStats.forEach((player, index) => {
      player.rank = index + 1;
    });

    await AsyncStorage.setItem(DUEL_SCORES_KEY, JSON.stringify(existingDuels));
    await AsyncStorage.setItem('songswipe_duel_stats', JSON.stringify(duelStats));
    
    return existingDuels;
  } catch (error) {
    console.error('Erreur saveDuelScore:', error);
    return [];
  }
};

export const getDuelScores = async () => {
  try {
    const scoresJson = await AsyncStorage.getItem(DUEL_SCORES_KEY);
    if (scoresJson) {
      return JSON.parse(scoresJson);
    }
    return [];
  } catch (error) {
    console.error('Erreur getDuelScores:', error);
    return [];
  }
};

export const getDuelStats = async () => {
  try {
    const statsJson = await AsyncStorage.getItem('songswipe_duel_stats');
    if (statsJson) {
      return JSON.parse(statsJson);
    }
    return [];
  } catch (error) {
    console.error('Erreur getDuelStats:', error);
    return [];
  }
};

export const clearDuelScores = async () => {
  try {
    await AsyncStorage.removeItem(DUEL_SCORES_KEY);
    await AsyncStorage.removeItem('songswipe_duel_stats');
  } catch (error) {
    console.error('Erreur clearDuelScores:', error);
  }
};
