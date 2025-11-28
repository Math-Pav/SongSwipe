// src/services/itunesAPI.js
export const fetchTracks = async (term = '2000s', country = 'fr', limit = 10) => {
  try {
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&country=${country}&limit=${limit}&media=music&entity=song`
    );
    const data = await response.json();

    if (data.results && Array.isArray(data.results)) {
      return data.results.map(track => ({
        trackName: track.trackName,
        artistName: track.artistName,
        previewUrl: track.previewUrl,
        collectionName: track.collectionName,
      }));
    }

    return [];
  } catch (error) {
    console.error('Erreur fetchTracks:', error);
    return [];
  }
};
