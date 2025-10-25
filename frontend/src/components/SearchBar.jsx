import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setMapCenter, setMapZoom } from '../store/mapSlice';
import axios from 'axios';

function SearchBar({ compact = false }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dispatch = useDispatch();
  const wrapperRef = useRef(null);
  const suggestionsTimeoutRef = useRef(null);

  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
  const NEVADA_BOUNDS = {
    west: -120.1,
    south: 34.9,
    east: -114.0,
    north: 42.1
  };

  // Check if coordinates are within Nevada
  const isInNevada = (lng, lat) => {
    return lng >= NEVADA_BOUNDS.west &&
           lng <= NEVADA_BOUNDS.east &&
           lat >= NEVADA_BOUNDS.south &&
           lat <= NEVADA_BOUNDS.north;
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions as user types
  useEffect(() => {
    if (suggestionsTimeoutRef.current) {
      clearTimeout(suggestionsTimeoutRef.current);
    }

    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    suggestionsTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`,
          {
            params: {
              access_token: MAPBOX_TOKEN,
              country: 'US',
              bbox: `${NEVADA_BOUNDS.west},${NEVADA_BOUNDS.south},${NEVADA_BOUNDS.east},${NEVADA_BOUNDS.north}`,
              limit: 5,
              types: 'place,locality,neighborhood,address,poi'
            },
          }
        );

        if (response.data.features && response.data.features.length > 0) {
          // Filter to only Nevada results - strict filtering
          const nevadaResults = response.data.features.filter(feature => {
            const [lng, lat] = feature.center;
            const inBounds = isInNevada(lng, lat);

            // Also check if "Nevada" appears in the place name or context
            const placeName = feature.place_name?.toLowerCase() || '';
            const hasNevada = placeName.includes('nevada') || placeName.includes(', nv');

            // Check context array for Nevada
            const context = feature.context || [];
            const contextHasNevada = context.some(ctx =>
              ctx.text?.toLowerCase().includes('nevada') ||
              ctx.short_code === 'US-NV'
            );

            return inBounds && (hasNevada || contextHasNevada);
          });

          setSuggestions(nevadaResults);
          setShowSuggestions(nevadaResults.length > 0);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (err) {
        console.error('Autocomplete error:', err);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300); // Debounce for 300ms

    return () => {
      if (suggestionsTimeoutRef.current) {
        clearTimeout(suggestionsTimeoutRef.current);
      }
    };
  }, [query, MAPBOX_TOKEN]);

  const handleSelect = (suggestion) => {
    const [lng, lat] = suggestion.center;

    // Strict Nevada validation
    const inBounds = isInNevada(lng, lat);
    const placeName = suggestion.place_name?.toLowerCase() || '';
    const hasNevada = placeName.includes('nevada') || placeName.includes(', nv');
    const context = suggestion.context || [];
    const contextHasNevada = context.some(ctx =>
      ctx.text?.toLowerCase().includes('nevada') ||
      ctx.short_code === 'US-NV'
    );

    if (!inBounds || (!hasNevada && !contextHasNevada)) {
      setError('Location is outside Nevada');
      setTimeout(() => setError(null), 3000);
      return;
    }

    dispatch(setMapCenter([lng, lat]));
    dispatch(setMapZoom(12));
    setQuery(suggestion.place_name);
    setShowSuggestions(false);
    setSuggestions([]);
    setSelectedIndex(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    // If there's a selected suggestion, use it
    if (selectedIndex >= 0 && suggestions[selectedIndex]) {
      handleSelect(suggestions[selectedIndex]);
      return;
    }

    // Otherwise perform a search
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`,
        {
          params: {
            access_token: MAPBOX_TOKEN,
            country: 'US',
            bbox: `${NEVADA_BOUNDS.west},${NEVADA_BOUNDS.south},${NEVADA_BOUNDS.east},${NEVADA_BOUNDS.north}`,
            limit: 1,
          },
        }
      );

      if (response.data.features && response.data.features.length > 0) {
        const feature = response.data.features[0];
        const [lng, lat] = feature.center;

        // Strict Nevada validation
        const inBounds = isInNevada(lng, lat);
        const placeName = feature.place_name?.toLowerCase() || '';
        const hasNevada = placeName.includes('nevada') || placeName.includes(', nv');
        const context = feature.context || [];
        const contextHasNevada = context.some(ctx =>
          ctx.text?.toLowerCase().includes('nevada') ||
          ctx.short_code === 'US-NV'
        );

        if (!inBounds || (!hasNevada && !contextHasNevada)) {
          setError('Please search for locations within Nevada only');
          setTimeout(() => setError(null), 3000);
          return;
        }

        dispatch(setMapCenter([lng, lat]));
        dispatch(setMapZoom(12));
        setQuery('');
        setShowSuggestions(false);
        setSuggestions([]);
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

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelect(suggestions[selectedIndex]);
        } else {
          handleSubmit(e);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  if (compact) {
    return (
      <div className="relative w-full" ref={wrapperRef}>
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(-1);
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              placeholder="Search..."
              className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border-2 border-nevada-200 text-nevada-900 text-sm focus:outline-none focus:border-nevada-900 shadow-medium"
              disabled={loading}
              autoComplete="off"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-nevada-400">
              {loading ? (
                <div className="spinner w-4 h-4"></div>
              ) : (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M9 9L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              )}
            </div>
          </div>

          {/* Compact Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl border-2 border-nevada-900 shadow-hard overflow-hidden animate-slide-up max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.id}
                  type="button"
                  onClick={() => handleSelect(suggestion)}
                  className={`w-full px-3 py-2 text-left transition-colors flex items-start gap-2 text-sm ${
                    index === selectedIndex
                      ? 'bg-nevada-900 text-white'
                      : 'hover:bg-nevada-50 text-nevada-900'
                  } ${index > 0 ? 'border-t border-nevada-200' : ''}`}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="flex-shrink-0 mt-0.5">
                    <path d="M6 11C6 11 10 8 10 5C10 3 8.5 1 6 1C3.5 1 2 3 2 5C2 8 6 11 6 11Z" stroke="currentColor" strokeWidth="1.2"/>
                    <circle cx="6" cy="5" r="1" stroke="currentColor" strokeWidth="1"/>
                  </svg>
                  <div className="flex-1 min-w-0 truncate">
                    {suggestion.text}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Compact Error */}
          {error && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-nevada-900 text-white px-3 py-2 rounded-xl text-xs shadow-hard animate-slide-up">
              {error}
            </div>
          )}
        </form>
      </div>
    );
  }

  return (
    <div className="absolute top-20 sm:top-4 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-md px-4 sm:px-0" ref={wrapperRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(-1);
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
                placeholder="Search Nevada locations..."
                className="input-modern pl-11 shadow-medium"
                disabled={loading}
                autoComplete="off"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-nevada-400">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 12L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>

            {/* Autocomplete Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl border-2 border-nevada-900 shadow-hard overflow-hidden animate-slide-up">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion.id}
                    type="button"
                    onClick={() => handleSelect(suggestion)}
                    className={`w-full px-4 py-3 text-left transition-colors flex items-start gap-3 ${
                      index === selectedIndex
                        ? 'bg-nevada-900 text-white'
                        : 'hover:bg-nevada-50 text-nevada-900'
                    } ${index > 0 ? 'border-t border-nevada-200' : ''}`}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="flex-shrink-0 mt-0.5"
                    >
                      <path
                        d="M8 14C8 14 13 10 13 6C13 3.23858 10.7614 1 8 1C5.23858 1 3 3.23858 3 6C3 10 8 14 8 14Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {suggestion.text}
                      </div>
                      <div className={`text-xs truncate ${
                        index === selectedIndex ? 'text-white/70' : 'text-nevada-500'
                      }`}>
                        {suggestion.place_name}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Error Message */}
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
            className="btn-primary shadow-medium px-4 sm:px-8 whitespace-nowrap"
            disabled={loading}
            aria-label="Search"
          >
            {loading ? (
              <div className="spinner"></div>
            ) : (
              <>
                <span className="hidden sm:inline">Search</span>
                <svg className="sm:hidden" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 12L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SearchBar;
