import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setFilters, clearFilters, fetchParcels } from '../store/parcelsSlice';
import { fetchBills } from '../store/billsSlice';

function Filters() {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.parcels);
  const { items: bills } = useSelector((state) => state.bills);

  useEffect(() => {
    dispatch(fetchBills());
  }, [dispatch]);

  const counties = ['Elko', 'Douglas', 'Pershing', 'Washoe', 'Clark', 'Lyon'];
  const useTypes = ['Housing Development', 'Conservation', 'Recreation', 'Economic Development'];

  const handleFilterChange = (filterType, value) => {
    const newValue = value === '' ? null : value;
    dispatch(setFilters({ [filterType]: newValue }));
    dispatch(fetchParcels({ ...filters, [filterType]: newValue }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    dispatch(fetchParcels());
  };

  return (
    <div className="absolute top-20 right-4 z-10 w-80 bg-white rounded-lg shadow-xl p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-nevada-800">Filters</h3>
        <button
          onClick={handleClearFilters}
          className="text-sm text-nevada-600 hover:text-nevada-800 underline"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            County
          </label>
          <select
            value={filters.county || ''}
            onChange={(e) => handleFilterChange('county', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nevada-500"
          >
            <option value="">All Counties</option>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nevada-500"
          >
            <option value="">All Use Types</option>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nevada-500"
          >
            <option value="">All Bills</option>
            {bills.map((bill) => (
              <option key={bill.id} value={bill.id}>
                {bill.number} - {bill.name.substring(0, 40)}...
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default Filters;
