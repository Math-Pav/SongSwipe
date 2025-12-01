export const fetchTracks = async (term = '2000s', limit = 40) => {
  try {
    const response = await fetch(
      `https://api.deezer.com/search?q=${encodeURIComponent(term)}&limit=${limit}`
    );

    const data = await response.json();

    if (data.data && Array.isArray(data.data)) {
      return data.data.map(track => ({
        trackName: track.title,
        artistName: track.artist?.name || '',
        previewUrl: track.preview,
        collectionName: track.album?.title || '',
        albumCover: track.album?.cover_medium,
      }));
    }

    return [];
  } catch (error) {
    console.error('Erreur fetchTracks (Deezer):', error);
    return [];
  }
};
