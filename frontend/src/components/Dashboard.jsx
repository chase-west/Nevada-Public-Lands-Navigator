import { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { setFilters, fetchParcels } from '../store/parcelsSlice';

const USE_TYPE_COLORS = {
  'Housing Development': '#FF6B6B',
  'Conservation': '#4ECDC4',
  'Recreation': '#45B7D1',
  'Economic Development': '#9B59B6',
  'Other': '#95E1D3',
};

function Dashboard() {
  const dispatch = useDispatch();
  const { items: parcels } = useSelector((state) => state.parcels);

  const handleWashoeFilter = () => {
    dispatch(setFilters({ county: 'Washoe' }));
    dispatch(fetchParcels({ county: 'Washoe' }));
  };

  // Calculate statistics
  const stats = useMemo(() => {
    if (!parcels || parcels.length === 0) {
      return {
        totalParcels: 0,
        totalAcres: 0,
        counties: 0,
        activeBills: 0,
        washoeAcres: 0,
        washoeParcels: 0,
      };
    }

    const totalAcres = parcels.reduce((sum, p) => sum + parseFloat(p.acres || 0), 0);
    const uniqueCounties = new Set(parcels.map(p => p.county)).size;

    // Count unique bills by trying multiple fields (bill_id, bill_number, or bill_name)
    const uniqueBills = new Set(
      parcels
        .map(p => p.bill_id || p.bill_number || p.bill_name)
        .filter(Boolean)
    ).size;

    const washoeParcels = parcels.filter(p => p.county?.toLowerCase().includes('washoe'));
    const washoeAcres = washoeParcels.reduce((sum, p) => sum + parseFloat(p.acres || 0), 0);

    return {
      totalParcels: parcels.length,
      totalAcres,
      counties: uniqueCounties,
      activeBills: uniqueBills,
      washoeAcres,
      washoeParcels: washoeParcels.length,
    };
  }, [parcels]);

  // Data for use type pie chart
  const useTypeData = useMemo(() => {
    if (!parcels || parcels.length === 0) return [];

    const grouped = parcels.reduce((acc, parcel) => {
      const type = parcel.use_type || 'Other';
      const acres = parseFloat(parcel.acres || 0);

      if (!acc[type]) {
        acc[type] = { name: type, value: 0, count: 0 };
      }
      acc[type].value += acres;
      acc[type].count += 1;

      return acc;
    }, {});

    return Object.values(grouped).sort((a, b) => b.value - a.value);
  }, [parcels]);

  // Data for county bar chart
  const countyData = useMemo(() => {
    if (!parcels || parcels.length === 0) return [];

    const grouped = parcels.reduce((acc, parcel) => {
      const county = parcel.county || 'Unknown';
      const acres = parseFloat(parcel.acres || 0);

      if (!acc[county]) {
        acc[county] = { name: county, acres: 0, count: 0 };
      }
      acc[county].acres += acres;
      acc[county].count += 1;

      return acc;
    }, {});

    return Object.values(grouped).sort((a, b) => b.acres - a.acres);
  }, [parcels]);

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="space-y-3">
        <h2 className="text-3xl font-bold text-nevada-900 tracking-tight">
          Nevada Public Lands Navigator
        </h2>
        <p className="text-nevada-600 text-sm leading-relaxed">
          Interactive visualization of proposed federal land transfers across Nevada
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card-elevated group hover:scale-105 transition-transform duration-300">
          <div className="flex items-start justify-between mb-2">
            <p className="text-xs font-semibold text-nevada-500 uppercase tracking-wider">
              Total Parcels
            </p>
            <div className="w-8 h-8 rounded-lg bg-accent-blue/10 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-accent-blue">
                <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M2 6H14M6 2V14" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-nevada-900">
            {stats.totalParcels.toLocaleString()}
          </p>
        </div>

        <div className="card-elevated group hover:scale-105 transition-transform duration-300">
          <div className="flex items-start justify-between mb-2">
            <p className="text-xs font-semibold text-nevada-500 uppercase tracking-wider">
              Total Acres
            </p>
            <div className="w-8 h-8 rounded-lg bg-[#4ECDC4]/10 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#4ECDC4]">
                <path d="M8 2L14 6V12L8 14L2 12V6L8 2Z" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-nevada-900">
            {stats.totalAcres.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>

        <div className="card-elevated group hover:scale-105 transition-transform duration-300">
          <div className="flex items-start justify-between mb-2">
            <p className="text-xs font-semibold text-nevada-500 uppercase tracking-wider">
              Counties
            </p>
            <div className="w-8 h-8 rounded-lg bg-[#9B59B6]/10 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#9B59B6]">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 2V8L12 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-nevada-900">
            {stats.counties}
          </p>
        </div>

        <div className="card-elevated group hover:scale-105 transition-transform duration-300">
          <div className="flex items-start justify-between mb-2">
            <p className="text-xs font-semibold text-nevada-500 uppercase tracking-wider">
              Active Bills
            </p>
            <div className="w-8 h-8 rounded-lg bg-[#FF6B6B]/10 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#FF6B6B]">
                <path d="M4 2H10L12 4V14H4V2Z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M6 6H10M6 9H10M6 12H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-nevada-900">
            {stats.activeBills}
          </p>
        </div>
      </div>

      {/* Washoe County Highlight */}
      {stats.washoeParcels > 0 && (
        <div className="card border-2 border-accent-blue bg-accent-blue/5 animate-in">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-accent-blue flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-white">
                <path d="M10 18C10 18 16 13 16 8C16 4.68629 13.3137 2 10 2C6.68629 2 4 4.68629 4 8C4 13 10 18 10 18Z" stroke="currentColor" strokeWidth="2"/>
                <circle cx="10" cy="8" r="2" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-nevada-900 mb-1">
                Washoe County Impact
              </h3>
              <p className="text-sm text-nevada-700 mb-3">
                Your local area has <span className="font-bold text-accent-blue">{stats.washoeParcels}</span> proposed parcels affecting{' '}
                <span className="font-bold text-accent-blue">
                  {stats.washoeAcres.toLocaleString(undefined, { maximumFractionDigits: 0 })} acres
                </span>
              </p>
              <button
                onClick={handleWashoeFilter}
                className="text-sm font-semibold text-accent-blue hover:text-nevada-900 transition-colors flex items-center gap-2 group"
              >
                View Washoe Parcels
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform group-hover:translate-x-1">
                  <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Land Use Distribution */}
      {useTypeData.length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-lg mb-4 text-nevada-900">Land Use Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={useTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {useTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={USE_TYPE_COLORS[entry.name] || USE_TYPE_COLORS.Other} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value.toLocaleString()} acres`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {useTypeData.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-sm">
                <div
                  className="w-3 h-3 rounded border border-nevada-900"
                  style={{ backgroundColor: USE_TYPE_COLORS[item.name] || USE_TYPE_COLORS.Other }}
                />
                <span className="text-nevada-700">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* County Breakdown */}
      {countyData.length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-lg mb-4 text-nevada-900">Acres by County</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={countyData}>
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => `${value.toLocaleString()} acres`} />
                <Bar dataKey="acres" fill="#0066FF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* About Section */}
      <div className="card-elevated">
        <h3 className="font-semibold text-lg mb-3 text-nevada-900">About This Project</h3>
        <p className="text-sm text-nevada-700 leading-relaxed mb-4">
          This tool provides an interactive view of proposed federal land transfers in Nevada, including data from the Northern Nevada Economic Development and Conservation Act.
        </p>
        <p className="text-sm text-nevada-700 leading-relaxed">
          <span className="font-semibold text-nevada-900">Click on any parcel</span> on the map to view detailed information, AI-powered analysis, and take action on issues that matter to your community.
        </p>
      </div>

      {/* Legend */}
      <div className="card border-2 border-nevada-900">
        <h3 className="font-semibold text-lg mb-4 text-nevada-900">Land Use Types</h3>
        <div className="space-y-3">
          {Object.entries(USE_TYPE_COLORS).filter(([key]) => key !== 'Other').map(([type, color]) => (
            <div key={type} className="group flex items-center gap-3 p-2 -m-2 rounded-xl transition-all hover:bg-nevada-50">
              <div
                className="w-10 h-10 rounded-lg border-2 border-nevada-900 flex-shrink-0 transition-transform group-hover:scale-110"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm font-medium text-nevada-900">{type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
