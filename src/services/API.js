const POPULAR_ARTISTS = [
  // Internationaux
  'Michael Jackson',
  'Queen',
  'ABBA',
  'The Beatles',
  'Madonna',
  'Daft Punk',
  'David Guetta',
  'Rihanna',
  'Beyonce',
  'Bruno Mars',
  'Katy Perry',
  'Lady Gaga',
  'Adele',
  'Ed Sheeran',
  'The Weeknd',
  'Shakira',
  'Coldplay',
  'Maroon 5',
  'Black Eyed Peas',
  'Justin Timberlake',

  // Rap FR
  'Jul',
  'Ninho',
  'PNL',
  'Nekfeu',
  'Orelsan',
  'Booba',
  'Soprano',
  'Aya Nakamura',
  'Dadju',
  'Gims',
  'Bigflo et Oli',
  'Vald',
  'SCH',
  'Niska',
  'Lacrim',
  'Kaaris',
  'Damso',
  'Gazo',
  'Tiakola',
  'Werenoi',

  // Variété FR
  'Stromae',
  'Angèle',
  'Indila',
  'Amir',
  'Kendji Girac',
  'Louane',
  'Slimane',
  'Zaz',
  'Christophe Mae',
  'Patrick Bruel',
  'Jean-Jacques Goldman',
  'Francis Cabrel',
  'Renaud',
  'Johnny Hallyday',
  'Céline Dion',
  'Mylène Farmer',
];

export const fetchTracks = async (term = '2000s', limit = 40) => {
  try {
    const randomArtist = POPULAR_ARTISTS[Math.floor(Math.random() * POPULAR_ARTISTS.length)];
    const searchTerm = `${randomArtist}`;
    
    const response = await fetch(
      `https://api.deezer.com/search?q=${encodeURIComponent(searchTerm)}&limit=${limit}&order=RANKING`
    );

    const data = await response.json();

    if (data.data && Array.isArray(data.data)) {
      return data.data
        .filter(track => track.preview)
        .map(track => ({
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

export const fetchPopularTracks = async (limit = 40) => {
  try {
    const allTracks = [];
    
    const selectedArtists = POPULAR_ARTISTS
      .sort(() => Math.random() - 0.5)
      .slice(0, 8);

    for (const artist of selectedArtists) {
      const response = await fetch(
        `https://api.deezer.com/search?q=${encodeURIComponent(artist)}&limit=8&order=RANKING`
      );
      const data = await response.json();

      if (data.data && Array.isArray(data.data)) {
        const tracks = data.data
          .filter(track => track.preview && track.rank > 100000)
          .map(track => ({
            trackName: track.title,
            artistName: track.artist?.name || '',
            previewUrl: track.preview,
            collectionName: track.album?.title || '',
            albumCover: track.album?.cover_medium,
            rank: track.rank,
          }));
        allTracks.push(...tracks);
      }
    }

    return allTracks
      .sort((a, b) => b.rank - a.rank)
      .slice(0, limit);
  } catch (error) {
    console.error('Erreur fetchPopularTracks:', error);
    return [];
  }
};
