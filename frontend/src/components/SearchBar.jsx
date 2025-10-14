import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setMapCenter, setMapZoom } from '../store/mapSlice';
import axios from 'axios';

function SearchBar() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Use Mapbox Geocoding API (free tier)
      const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`,
        {
          params: {
            access_token: MAPBOX_TOKEN,
            country: 'US',
            bbox: '-120.0,35.0,-114.0,42.0', // Nevada bounding box
            limit: 1,
          },
        }
      );

      if (response.data.features && response.data.features.length > 0) {
        const [lng, lat] = response.data.features[0].center;
        dispatch(setMapCenter([lng, lat]));
        dispatch(setMapZoom(10));
        setQuery('');
      } else {
        setError('Location not found in Nevada');
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      console.error('Geocoding error:', err);
      setError('Search failed. Try again.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-md px-4 sm:px-0">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search: Reno, Las Vegas, Elko..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-nevada-500 text-sm sm:text-base"
            disabled={loading}
          />
          {error && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm shadow-lg">
              {error}
            </div>
          )}
        </div>
        <button
          type="submit"
          className="btn-primary shadow-md px-4 sm:px-6 whitespace-nowrap"
          disabled={loading}
        >
          {loading ? '...' : 'Search'}
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
