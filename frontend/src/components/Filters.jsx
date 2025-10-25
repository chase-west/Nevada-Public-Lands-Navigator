import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setFilters, clearFilters, fetchParcels } from '../store/parcelsSlice';
import { fetchBills } from '../store/billsSlice';

function Filters({ onClose }) {
  const dispatch = useDispatch();
  const { filters, items } = useSelector((state) => state.parcels);
  const { items: bills } = useSelector((state) => state.bills);

  useEffect(() => {
    dispatch(fetchBills());
  }, [dispatch]);

  const counties = ['Clark', 'Douglas', 'Elko', 'Lyon', 'Pershing', 'Washoe'];
  const useTypes = ['Conservation', 'Economic Development', 'Housing Development', 'Recreation'];

  const handleFilterChange = (filterType, value) => {
    const newValue = value === '' ? null : value;
    dispatch(setFilters({ [filterType]: newValue }));
    dispatch(fetchParcels({ ...filters, [filterType]: newValue }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    dispatch(fetchParcels());
  };

  const activeFilterCount = Object.values(filters).filter(v => v !== null).length;

  return (
    <div className="absolute top-16 lg:top-20 left-4 right-4 sm:left-4 sm:right-auto z-20 sm:w-full sm:max-w-sm animate-slide-up">
      <div className="bg-white rounded-2xl shadow-hard border-2 border-nevada-900 overflow-hidden max-h-[calc(100vh-5rem)] flex flex-col">
        {/* Header */}
        <div className="bg-nevada-900 text-white px-6 py-5 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg tracking-tight">Filters</h3>
            <p className="text-xs text-white/70 mt-0.5">
              {items.length} parcel{items.length !== 1 ? 's' : ''} shown
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 hover:rotate-90"
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M11 3L3 11M3 3L11 11" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Filter Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Quick Filter - Washoe County */}
          <div className="pb-4 border-b border-nevada-200">
            <label className="block text-xs font-semibold text-nevada-500 uppercase tracking-wider mb-2.5">
              Quick Filter
            </label>
            <button
              onClick={() => {
                if (filters.county === 'Washoe') {
                  handleFilterChange('county', '');
                } else {
                  handleFilterChange('county', 'Washoe');
                }
              }}
              className={`w-full transition-all duration-200 ${
                filters.county === 'Washoe'
                  ? 'btn-primary'
                  : 'btn-secondary'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 14C8 14 13 10 13 6C13 3.23858 10.7614 1 8 1C5.23858 1 3 3.23858 3 6C3 10 8 14 8 14Z" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="8" cy="6" r="1.5" fill="currentColor"/>
                </svg>
                <span>Washoe County</span>
              </div>
            </button>
          </div>

          {/* County Filter */}
          <div>
            <label className="block text-xs font-semibold text-nevada-500 uppercase tracking-wider mb-2.5">
              County
            </label>
            <select
              value={filters.county || ''}
              onChange={(e) => handleFilterChange('county', e.target.value)}
              className="select-modern"
            >
              <option value="">All Counties ({counties.length})</option>
              {counties.map((county) => (
                <option key={county} value={county}>
                  {county}
                </option>
              ))}
            </select>
          </div>

          {/* Proposed Use Filter */}
          <div>
            <label className="block text-xs font-semibold text-nevada-500 uppercase tracking-wider mb-2.5">
              Proposed Use
            </label>
            <select
              value={filters.use_type || ''}
              onChange={(e) => handleFilterChange('use_type', e.target.value)}
              className="select-modern"
            >
              <option value="">All Use Types ({useTypes.length})</option>
              {useTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Related Bill Filter */}
          <div>
            <label className="block text-xs font-semibold text-nevada-500 uppercase tracking-wider mb-2.5">
              Related Bill
            </label>
            <select
              value={filters.bill_id || ''}
              onChange={(e) => handleFilterChange('bill_id', e.target.value)}
              className="select-modern"
            >
              <option value="">All Bills</option>
              {bills.map((bill) => (
                <option key={bill.id} value={bill.id}>
                  {bill.number}
                </option>
              ))}
            </select>
          </div>

          {/* Active Filters Badge & Clear Button */}
          {activeFilterCount > 0 && (
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3">
                <span className="badge badge-primary">
                  {activeFilterCount} Active Filter{activeFilterCount > 1 ? 's' : ''}
                </span>
              </div>
              <button
                onClick={handleClearFilters}
                className="w-full btn-secondary"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Filters;
