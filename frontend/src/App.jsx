import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Map from './components/Map';
import Sidebar from './components/Sidebar';
import SearchBar from './components/SearchBar';
import Filters from './components/Filters';
import WelcomeTutorial from './components/WelcomeTutorial';
import Glossary from './components/Glossary';
import ComparisonView from './components/ComparisonView';
import { fetchParcels, setFilters, clearFilters } from './store/parcelsSlice';
import './index.css';

function App() {
  const dispatch = useDispatch();
  const [showFilters, setShowFilters] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const { loading, error, filters } = useSelector((state) => state.parcels);
  const { parcels: comparisonParcels } = useSelector((state) => state.comparison);

  useEffect(() => {
    dispatch(fetchParcels());
  }, [dispatch]);

  // Define handleWashoeFilter before it's used in keyboard shortcuts
  const handleWashoeFilter = () => {
    if (filters.county === 'Washoe') {
      // If already filtered by Washoe, clear the filter
      dispatch(clearFilters());
      dispatch(fetchParcels());
    } else {
      // Otherwise, apply Washoe filter
      dispatch(setFilters({ county: 'Washoe' }));
      dispatch(fetchParcels({ county: 'Washoe' }));
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ignore if user is typing in an input/textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        // Allow Escape even in inputs
        if (e.key === 'Escape') {
          e.target.blur();
          if (showFilters) setShowFilters(false);
          if (showGlossary) setShowGlossary(false);
        }
        return;
      }

      switch (e.key) {
        case 'Escape':
          // Close any open panels
          if (showFilters) setShowFilters(false);
          if (showGlossary) setShowGlossary(false);
          break;
        case '/':
          // Focus search bar
          e.preventDefault();
          const searchInput = document.querySelector('input[type="text"]');
          if (searchInput) searchInput.focus();
          break;
        case 'f':
        case 'F':
          // Toggle filters
          if (!showGlossary) {
            e.preventDefault();
            setShowFilters(!showFilters);
          }
          break;
        case 'g':
        case 'G':
          // Open glossary
          if (!showFilters) {
            e.preventDefault();
            setShowGlossary(true);
          }
          break;
        case 'w':
        case 'W':
          // Toggle Washoe filter
          if (!showFilters && !showGlossary) {
            e.preventDefault();
            handleWashoeFilter();
          }
          break;
        case '?':
          // Show keyboard shortcuts help
          e.preventDefault();
          setShowGlossary(true);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showFilters, showGlossary, handleWashoeFilter]);

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen overflow-hidden bg-nevada-50">
      <WelcomeTutorial />
      <Glossary isOpen={showGlossary} onClose={() => setShowGlossary(false)} />
      <ComparisonView isOpen={showComparison} onClose={() => setShowComparison(false)} />
      <Sidebar />

      <div className="flex-1 relative">
        <Map />

        <SearchBar />

        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-primary shadow-medium"
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

          <button
            onClick={handleWashoeFilter}
            className={`shadow-medium transition-all duration-200 ${
              filters.county === 'Washoe'
                ? 'btn-primary'
                : 'btn-secondary'
            }`}
          >
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 14C8 14 13 10 13 6C13 3.23858 10.7614 1 8 1C5.23858 1 3 3.23858 3 6C3 10 8 14 8 14Z" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="8" cy="6" r="1.5" fill="currentColor"/>
              </svg>
              <span className="hidden sm:inline">Washoe County</span>
            </div>
          </button>
        </div>

        {showFilters && <Filters onClose={() => setShowFilters(false)} />}

        {/* Comparison Floating Bar */}
        {comparisonParcels.length > 0 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 animate-slide-up">
            <div className="bg-nevada-900 text-white px-6 py-4 rounded-2xl shadow-hard border-2 border-nevada-900 flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent-blue rounded-xl flex items-center justify-center font-bold">
                  {comparisonParcels.length}
                </div>
                <div>
                  <p className="font-semibold text-sm">
                    {comparisonParcels.length} parcel{comparisonParcels.length !== 1 ? 's' : ''} selected
                  </p>
                  <p className="text-xs text-white/70">
                    {comparisonParcels.length < 3 ? `Add ${3 - comparisonParcels.length} more to compare` : 'Ready to compare'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowComparison(true)}
                className="btn-primary bg-white text-nevada-900 hover:bg-nevada-100"
              >
                Compare
              </button>
            </div>
          </div>
        )}

        {/* Glossary Button */}
        <button
          onClick={() => setShowGlossary(true)}
          className="absolute bottom-6 right-6 z-10 w-14 h-14 bg-nevada-900 text-white rounded-2xl shadow-hard hover:shadow-brutal hover:-translate-y-1 transition-all duration-200 flex items-center justify-center group"
          aria-label="Open glossary"
          title="Glossary of Terms"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:scale-110">
            <path d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 7H15M9 11H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

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
