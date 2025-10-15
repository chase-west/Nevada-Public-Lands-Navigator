import { useSelector, useDispatch } from 'react-redux';
import { clearSelectedParcel } from '../store/parcelsSlice';

function Sidebar() {
  const dispatch = useDispatch();
  const { selectedParcel } = useSelector((state) => state.parcels);

  if (!selectedParcel) {
    return (
      <div className="w-full lg:w-[480px] bg-white border-r border-nevada-200 p-8 overflow-y-auto max-h-64 lg:max-h-full scrollbar-modern">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-nevada-900 mb-2 tracking-tight">
            Nevada Public Lands Navigator
          </h2>
          <p className="text-nevada-600 text-sm leading-relaxed">
            Interactive visualization of proposed federal land transfers across Nevada
          </p>
        </div>

        <div className="space-y-6">
          <div className="card-elevated animate-in">
            <h3 className="font-semibold text-lg mb-3 text-nevada-900">About This Project</h3>
            <p className="text-sm text-nevada-700 leading-relaxed">
              This tool provides an interactive view of proposed federal land transfers in
              Nevada, including data from the Northern Nevada Economic Development and
              Conservation Act.
            </p>
          </div>

          <div className="card border-2 border-nevada-900 animate-in" style={{ animationDelay: '0.1s' }}>
            <h3 className="font-semibold text-lg mb-4 text-nevada-900">Land Use Types</h3>
            <div className="space-y-3">
              <div className="group flex items-center gap-3 p-2 -m-2 rounded-xl transition-all hover:bg-nevada-50">
                <div className="w-10 h-10 bg-[#FF6B6B] rounded-lg border-2 border-nevada-900 flex-shrink-0 transition-transform group-hover:scale-110"></div>
                <span className="text-sm font-medium text-nevada-900">Housing Development</span>
              </div>
              <div className="group flex items-center gap-3 p-2 -m-2 rounded-xl transition-all hover:bg-nevada-50">
                <div className="w-10 h-10 bg-[#4ECDC4] rounded-lg border-2 border-nevada-900 flex-shrink-0 transition-transform group-hover:scale-110"></div>
                <span className="text-sm font-medium text-nevada-900">Conservation</span>
              </div>
              <div className="group flex items-center gap-3 p-2 -m-2 rounded-xl transition-all hover:bg-nevada-50">
                <div className="w-10 h-10 bg-[#45B7D1] rounded-lg border-2 border-nevada-900 flex-shrink-0 transition-transform group-hover:scale-110"></div>
                <span className="text-sm font-medium text-nevada-900">Recreation</span>
              </div>
              <div className="group flex items-center gap-3 p-2 -m-2 rounded-xl transition-all hover:bg-nevada-50">
                <div className="w-10 h-10 bg-[#9B59B6] rounded-lg border-2 border-nevada-900 flex-shrink-0 transition-transform group-hover:scale-110"></div>
                <span className="text-sm font-medium text-nevada-900">Economic Development</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-nevada-900 text-white rounded-2xl animate-in" style={{ animationDelay: '0.2s' }}>
            <p className="text-sm leading-relaxed opacity-90">
              Click on any parcel on the map to view detailed information about the proposed land transfer.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-[480px] bg-white border-r border-nevada-200 p-8 overflow-y-auto max-h-96 lg:max-h-full scrollbar-modern">
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="section-header mb-1">Parcel Details</p>
          <h2 className="text-2xl font-bold text-nevada-900 tracking-tight">
            {selectedParcel.name}
          </h2>
        </div>
        <button
          onClick={() => dispatch(clearSelectedParcel())}
          className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl border-2 border-nevada-200 text-nevada-600 hover:border-nevada-900 hover:text-nevada-900 transition-all duration-200 hover:rotate-90"
          aria-label="Close"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="card">
            <p className="text-xs font-semibold text-nevada-500 uppercase tracking-wider mb-2">
              County
            </p>
            <p className="text-xl font-bold text-nevada-900">
              {selectedParcel.county}
            </p>
          </div>

          <div className="card">
            <p className="text-xs font-semibold text-nevada-500 uppercase tracking-wider mb-2">
              Acreage
            </p>
            <p className="text-xl font-bold text-nevada-900">
              {parseFloat(selectedParcel.acres).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="card-elevated">
          <p className="text-xs font-semibold text-nevada-500 uppercase tracking-wider mb-3">
            Proposed Use
          </p>
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl border-2 border-nevada-900 flex-shrink-0"
              style={{
                backgroundColor:
                  selectedParcel.use_type === 'Housing Development' ? '#FF6B6B' :
                  selectedParcel.use_type === 'Conservation' ? '#4ECDC4' :
                  selectedParcel.use_type === 'Recreation' ? '#45B7D1' :
                  selectedParcel.use_type === 'Economic Development' ? '#9B59B6' :
                  '#95E1D3'
              }}
            ></div>
            <p className="text-lg font-semibold text-nevada-900">
              {selectedParcel.use_type || 'Not specified'}
            </p>
          </div>
        </div>

        {selectedParcel.description && (
          <div className="card">
            <p className="text-xs font-semibold text-nevada-500 uppercase tracking-wider mb-3">
              Description
            </p>
            <p className="text-sm text-nevada-700 leading-relaxed">
              {selectedParcel.description}
            </p>
          </div>
        )}

        {selectedParcel.bill_name && (
          <div className="card border-2 border-accent-blue bg-accent-blue/5">
            <p className="text-xs font-semibold text-nevada-500 uppercase tracking-wider mb-3">
              Related Legislation
            </p>
            <p className="text-lg font-bold text-nevada-900 mb-2">
              {selectedParcel.bill_name}
            </p>
            {selectedParcel.bill_number && (
              <p className="text-sm text-nevada-600 mb-3 font-mono">
                {selectedParcel.bill_number}
              </p>
            )}
            {selectedParcel.bill_status && (
              <div className="mb-3">
                <span className="badge badge-secondary">
                  {selectedParcel.bill_status}
                </span>
              </div>
            )}
            {selectedParcel.bill_url && (
              <a
                href={selectedParcel.bill_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-accent-blue hover:text-nevada-900 transition-colors group"
              >
                View on Congress.gov
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            )}
          </div>
        )}

        {selectedParcel.township && selectedParcel.range && selectedParcel.section && (
          <div className="card bg-nevada-50">
            <p className="text-xs font-semibold text-nevada-500 uppercase tracking-wider mb-3">
              Public Land Survey System
            </p>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-nevada-600 mb-1">Township</p>
                <p className="font-semibold text-nevada-900">{selectedParcel.township}</p>
              </div>
              <div>
                <p className="text-nevada-600 mb-1">Range</p>
                <p className="font-semibold text-nevada-900">{selectedParcel.range}</p>
              </div>
              <div>
                <p className="text-nevada-600 mb-1">Section</p>
                <p className="font-semibold text-nevada-900">{selectedParcel.section}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
