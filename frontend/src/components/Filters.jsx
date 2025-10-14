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
    <div className="absolute top-16 right-2 sm:right-4 z-20 w-full max-w-xs sm:w-80 bg-white rounded-lg shadow-2xl border-2 border-nevada-200">
      <div className="flex justify-between items-center p-4 bg-nevada-600 text-white rounded-t-lg">
        <div>
          <h3 className="font-bold text-lg">Filters</h3>
          <p className="text-xs text-nevada-100">{items.length} parcels shown</p>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:bg-nevada-700 rounded-full w-8 h-8 flex items-center justify-center text-2xl leading-none"
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <div className="p-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              County
            </label>
            <select
              value={filters.county || ''}
              onChange={(e) => handleFilterChange('county', e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nevada-500 focus:border-nevada-500"
            >
              <option value="">All Counties ({counties.length})</option>
              {counties.map((county) => (
                <option key={county} value={county}>
                  {county}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Proposed Use
            </label>
            <select
              value={filters.use_type || ''}
              onChange={(e) => handleFilterChange('use_type', e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nevada-500 focus:border-nevada-500"
            >
              <option value="">All Use Types ({useTypes.length})</option>
              {useTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Related Bill
            </label>
            <select
              value={filters.bill_id || ''}
              onChange={(e) => handleFilterChange('bill_id', e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nevada-500 focus:border-nevada-500"
            >
              <option value="">All Bills</option>
              {bills.map((bill) => (
                <option key={bill.id} value={bill.id}>
                  {bill.number}
                </option>
              ))}
            </select>
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={handleClearFilters}
              className="w-full mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-semibold transition-colors"
            >
              Clear {activeFilterCount} Filter{activeFilterCount > 1 ? 's' : ''}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Filters;
