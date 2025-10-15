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
      const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`,
        {
          params: {
            access_token: MAPBOX_TOKEN,
            country: 'US',
            bbox: '-120.0,35.0,-114.0,42.0',
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
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search locations..."
                className="input-modern pl-11 shadow-medium"
                disabled={loading}
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-nevada-400">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 12L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
            {error && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-nevada-900 text-white px-4 py-3 rounded-xl text-sm shadow-hard animate-slide-up">
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2"/>
                    <path d="M8 4V8M8 11V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}
          </div>
          <button
            type="submit"
            className="btn-primary shadow-medium px-8 whitespace-nowrap"
            disabled={loading}
          >
            {loading ? (
              <div className="spinner"></div>
            ) : (
              'Search'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SearchBar;
