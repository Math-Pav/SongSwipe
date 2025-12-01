export const fetchTracksPop = async (limit = 10) => {
  try {
    const response = await fetch(
      `https://itunes.apple.com/search?term=pop&country=fr&limit=${limit}&media=music&entity=song`
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
    console.error('Erreur fetchTracksPop:', error);
    return [];
  }
};
