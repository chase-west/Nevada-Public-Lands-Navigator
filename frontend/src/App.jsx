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
    <div className="flex flex-col lg:flex-row h-screen w-screen overflow-hidden">
      <Sidebar />

      <div className="flex-1 relative">
        <Map />

        <SearchBar />

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="absolute top-4 right-4 z-10 btn-primary shadow-lg text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-2"
        >
          {showFilters ? '✕ Close' : '🔍 Filters'}
        </button>

        {showFilters && <Filters onClose={() => setShowFilters(false)} />}

        {/* Loading Indicator */}
        {loading && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow-lg z-10">
            <div className="flex items-center gap-3">
              <div className="animate-spin h-5 w-5 border-2 border-nevada-600 border-t-transparent rounded-full"></div>
              <span className="text-nevada-800 font-medium">Loading parcels...</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-100 border-2 border-red-400 px-6 py-3 rounded-lg shadow-lg z-10 max-w-md">
            <div className="flex items-start gap-3">
              <span className="text-red-600 text-xl">⚠️</span>
              <div>
                <p className="text-red-800 font-semibold">Error Loading Data</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
