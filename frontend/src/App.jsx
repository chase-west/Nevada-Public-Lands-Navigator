import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Map from './components/Map';
import Sidebar from './components/Sidebar';
import SearchBar from './components/SearchBar';
import Filters from './components/Filters';
import { fetchParcels } from './store/parcelsSlice';
import './index.css';

function App() {
  const dispatch = useDispatch();
  const [showFilters, setShowFilters] = useState(false);
  const { loading, error } = useSelector((state) => state.parcels);

  useEffect(() => {
    dispatch(fetchParcels());
  }, [dispatch]);

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen overflow-hidden bg-nevada-50">
      <Sidebar />

      <div className="flex-1 relative">
        <Map />

        <SearchBar />

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="absolute top-4 left-4 z-10 btn-primary shadow-medium"
        >
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 4H14M4 8H12M6 12H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="hidden sm:inline">
              {showFilters ? 'Close' : 'Filters'}
            </span>
          </div>
        </button>

        {showFilters && <Filters onClose={() => setShowFilters(false)} />}

        {/* Loading Indicator */}
        {loading && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 animate-slide-up">
            <div className="bg-white px-6 py-4 rounded-2xl shadow-hard border-2 border-nevada-900">
              <div className="flex items-center gap-3">
                <div className="spinner"></div>
                <span className="text-nevada-900 font-medium text-sm">Loading parcels...</span>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 max-w-md w-full px-4 animate-slide-up">
            <div className="bg-nevada-900 text-white px-6 py-4 rounded-2xl shadow-hard border-2 border-nevada-900">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2"/>
                    <path d="M10 6V10M10 13V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm mb-1">Error Loading Data</p>
                  <p className="text-sm opacity-90">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
