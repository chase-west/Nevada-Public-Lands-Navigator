import { useSelector, useDispatch } from 'react-redux';
import { removeFromComparison, clearComparison, setIsComparing } from '../store/comparisonSlice';

const USE_TYPE_COLORS = {
  'Housing Development': '#FF6B6B',
  'Conservation': '#4ECDC4',
  'Recreation': '#45B7D1',
  'Economic Development': '#9B59B6',
  'Other': '#95E1D3',
};

function ComparisonView({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { parcels } = useSelector((state) => state.comparison);

  if (!isOpen || parcels.length === 0) return null;

  const handleRemove = (parcelId) => {
    dispatch(removeFromComparison(parcelId));
    if (parcels.length === 1) {
      // If removing the last parcel, close the view
      onClose();
    }
  };

  const handleClear = () => {
    dispatch(clearComparison());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-nevada-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-7xl max-h-[90vh] bg-white rounded-3xl shadow-hard border-2 border-nevada-900 overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="bg-nevada-900 text-white px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-1">Parcel Comparison</h2>
            <p className="text-sm text-white/70">
              Comparing {parcels.length} parcel{parcels.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleClear}
              className="btn-ghost text-white/70 hover:text-white hover:bg-white/10"
            >
              Clear All
            </button>
            <button
              onClick={onClose}
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 hover:rotate-90"
              aria-label="Close comparison"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Comparison Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] scrollbar-modern">
          <div className={`grid ${parcels.length === 1 ? 'grid-cols-1' : parcels.length === 2 ? 'grid-cols-2' : 'grid-cols-3'} divide-x divide-nevada-200`}>
            {parcels.map((parcel, index) => (
              <div key={parcel.id} className="p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-nevada-500 uppercase tracking-wider">
                        Parcel {index + 1}
                      </span>
                      <div
                        className="w-3 h-3 rounded border border-nevada-900"
                        style={{
                          backgroundColor: USE_TYPE_COLORS[parcel.use_type] || USE_TYPE_COLORS.Other,
                        }}
                      />
                    </div>
                    <h3 className="text-xl font-bold text-nevada-900 mb-1">{parcel.name}</h3>
                    <p className="text-sm text-nevada-600">{parcel.county} County</p>
                  </div>
                  <button
                    onClick={() => handleRemove(parcel.id)}
                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-nevada-400 hover:text-nevada-900 hover:bg-nevada-100 transition-all"
                    aria-label="Remove from comparison"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="card bg-nevada-50">
                      <p className="text-xs font-semibold text-nevada-500 uppercase tracking-wider mb-1">
                        Acres
                      </p>
                      <p className="text-2xl font-bold text-nevada-900">
                        {parseFloat(parcel.acres || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </p>
                    </div>

                    <div className="card bg-nevada-50">
                      <p className="text-xs font-semibold text-nevada-500 uppercase tracking-wider mb-1">
                        Use Type
                      </p>
                      <p className="text-sm font-bold text-nevada-900 leading-tight">
                        {parcel.use_type || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  {parcel.description && (
                    <div className="card">
                      <p className="text-xs font-semibold text-nevada-500 uppercase tracking-wider mb-2">
                        Description
                      </p>
                      <p className="text-sm text-nevada-700 leading-relaxed line-clamp-3">
                        {parcel.description}
                      </p>
                    </div>
                  )}

                  {/* Bill Info */}
                  {parcel.bill_name && (
                    <div className="card border-2 border-accent-blue bg-accent-blue/5">
                      <p className="text-xs font-semibold text-nevada-500 uppercase tracking-wider mb-2">
                        Related Bill
                      </p>
                      <p className="font-bold text-nevada-900 text-sm mb-1">{parcel.bill_name}</p>
                      {parcel.bill_number && (
                        <p className="text-xs text-nevada-600 font-mono">{parcel.bill_number}</p>
                      )}
                      {parcel.bill_status && (
                        <span className="badge badge-secondary mt-2 inline-block">
                          {parcel.bill_status}
                        </span>
                      )}
                    </div>
                  )}

                  {/* PLSS Info */}
                  {parcel.township && parcel.range && parcel.section && (
                    <div className="card bg-nevada-50">
                      <p className="text-xs font-semibold text-nevada-500 uppercase tracking-wider mb-2">
                        Location (PLSS)
                      </p>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <p className="text-nevada-600">Township</p>
                          <p className="font-semibold text-nevada-900">{parcel.township}</p>
                        </div>
                        <div>
                          <p className="text-nevada-600">Range</p>
                          <p className="font-semibold text-nevada-900">{parcel.range}</p>
                        </div>
                        <div>
                          <p className="text-nevada-600">Section</p>
                          <p className="font-semibold text-nevada-900">{parcel.section}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Empty Slots */}
            {[...Array(3 - parcels.length)].map((_, index) => (
              <div key={`empty-${index}`} className="p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-nevada-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-nevada-400">
                      <path d="M16 10V22M10 16H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <rect x="4" y="4" width="24" height="24" rx="4" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <p className="text-sm text-nevada-600">
                    Add {parcels.length === 0 ? 'a' : 'another'} parcel
                  </p>
                  <p className="text-xs text-nevada-500 mt-1">
                    Click "Compare" on any parcel
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Tip */}
        <div className="border-t border-nevada-200 px-8 py-4 bg-nevada-50">
          <p className="text-xs text-nevada-600 text-center">
            💡 <span className="font-semibold">Tip:</span> You can compare up to 3 parcels side-by-side. Click on parcels in the map and select "Add to Compare".
          </p>
        </div>
      </div>
    </div>
  );
}

export default ComparisonView;
