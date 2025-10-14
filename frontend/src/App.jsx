import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Map from './components/Map';
import Sidebar from './components/Sidebar';
import SearchBar from './components/SearchBar';
import Filters from './components/Filters';
import { fetchParcels } from './store/parcelsSlice';
import './index.css';

function App() {
  const dispatch = useDispatch();
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchParcels());
  }, [dispatch]);

  const handleSearch = (query) => {
    console.log('Search query:', query);
    // Implement search functionality
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar />

      <div className="flex-1 relative">
        <Map />

        <SearchBar onSearch={handleSearch} />

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="absolute top-4 right-4 z-10 btn-primary shadow-lg"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        {showFilters && <Filters />}
      </div>
    </div>
  );
}

export default App;
