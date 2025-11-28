import { use, useEffect, useState } from 'react';
import { fetchTracks } from '../services/itunesAPI';

export const useTracks = (term = '2000s', limit = 10) => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTracks = async () => {
      setLoading(true);
      const result = await fetchTracks(term, 'fr', limit);
      setTracks(result);
      setLoading(false);
    };
    loadTracks();
  }, [term]);

  return { tracks, loading };
};