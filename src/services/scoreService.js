import AsyncStorage from '@react-native-async-storage/async-storage';

const SCORES_KEY = 'songswipe_scores';

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
