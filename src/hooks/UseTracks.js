import { useEffect, useState } from 'react';
import { fetchTracks } from '../services/API';

const cleanTrackName = (trackName) => {
  if (!trackName) return null;

  // Supprime tout ce qui est entre parenthèses ou crochets
  let name = trackName.replace(/\(.*?\)|\[.*?\]/g, '').trim();

  // Ne garder que les titres "significatifs"
  if (
    name.length <= 2 ||                // trop court
    /^\d{4}s?$/.test(name) ||          // 2000 ou 2000s
    /^20\d{2}.*$/.test(name)           // exemple: 2000's ou 2023 remix
  ) {
    return null;
  }

  return name;
};


export const useTracks = (term = '2000s', limit = 10) => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTracks = async () => {
      setLoading(true);
      const result = await fetchTracks(term, 'fr', limit);

      // Nettoie et filtre les tracks
      const filtered = result
        .map(track => ({ ...track, trackName: cleanTrackName(track.trackName) }))
        .filter(track => track.trackName); // ne garder que les titres valides


      setTracks(filtered);
      setLoading(false);
    };

    loadTracks();
  }, [term, limit]);

  return { tracks, loading };
};
