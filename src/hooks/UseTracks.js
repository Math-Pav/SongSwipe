import { useEffect, useState } from 'react';
import { fetchTracks } from '../services/API';

const cleanTrackName = (trackName) => {
  if (!trackName) return null;

  let name = trackName.replace(/\(.*?\)|\[.*?\]/g, '').trim();

  // On ignore uniquement les titres exactement "2000s" ou "2000's"
  if (/^2000'?s$/i.test(name)) return null;

  // On peut aussi ignorer les titres vides ou trop courts
  if (name.length < 2) return null;

  return name;
};



export const useTracks = (term = '2000s', limit = 40) => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTracks = async () => {
      setLoading(true);
      const result = await fetchTracks(term, null, limit);

      const filtered = result
        .map(track => ({ ...track, trackName: cleanTrackName(track.trackName) }))
        .filter(track => track.trackName && track.previewUrl); // garder seulement les morceaux avec preview


      setTracks(filtered);
      setLoading(false);
    };

    loadTracks();
  }, [term, limit]);

  return { tracks, loading };
};
