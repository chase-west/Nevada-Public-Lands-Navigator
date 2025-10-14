import { useSelector, useDispatch } from 'react-redux';
import { clearSelectedParcel } from '../store/parcelsSlice';

function Sidebar() {
  const dispatch = useDispatch();
  const { selectedParcel } = useSelector((state) => state.parcels);

  if (!selectedParcel) {
    return (
      <div className="w-full lg:w-96 bg-white shadow-xl p-4 sm:p-6 overflow-y-auto max-h-64 lg:max-h-full">
        <h2 className="text-xl sm:text-2xl font-bold text-nevada-800 mb-4">
          Nevada Public Lands Navigator
        </h2>
        <p className="text-gray-600 mb-4">
          Click on any parcel on the map to view detailed information about proposed federal
          land transfers in Nevada.
        </p>
        <div className="space-y-4">
          <div className="card">
            <h3 className="font-semibold text-lg mb-2">About This Project</h3>
            <p className="text-sm text-gray-700">
              This tool provides an interactive view of proposed federal land transfers in
              Nevada, including data from the Northern Nevada Economic Development and
              Conservation Act.
            </p>
          </div>
          <div className="card bg-nevada-50">
            <h3 className="font-semibold text-lg mb-2">Legend</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#FF6B6B] border-2 border-black rounded"></div>
                <span>Housing Development</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#4ECDC4] border-2 border-black rounded"></div>
                <span>Conservation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#45B7D1] border-2 border-black rounded"></div>
                <span>Recreation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#9B59B6] border-2 border-black rounded"></div>
                <span>Economic Development</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-96 bg-white shadow-xl p-4 sm:p-6 overflow-y-auto max-h-96 lg:max-h-full">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-nevada-800">Parcel Details</h2>
        <button
          onClick={() => dispatch(clearSelectedParcel())}
          className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          aria-label="Close"
        >
          &times;
        </button>
      </div>

      <div className="space-y-4">
        <div className="card bg-nevada-50">
          <h3 className="font-bold text-lg text-nevada-900">{selectedParcel.name}</h3>
        </div>

        <div className="card">
          <h4 className="font-semibold text-sm text-gray-600 mb-2">Location</h4>
          <p className="text-lg">{selectedParcel.county} County, Nevada</p>
        </div>

        <div className="card">
          <h4 className="font-semibold text-sm text-gray-600 mb-2">Acreage</h4>
          <p className="text-lg">{parseFloat(selectedParcel.acres).toFixed(2)} acres</p>
        </div>

        <div className="card">
          <h4 className="font-semibold text-sm text-gray-600 mb-2">Proposed Use</h4>
          <p className="text-lg">{selectedParcel.use_type || 'Not specified'}</p>
        </div>

        {selectedParcel.description && (
          <div className="card">
            <h4 className="font-semibold text-sm text-gray-600 mb-2">Description</h4>
            <p className="text-sm text-gray-700">{selectedParcel.description}</p>
          </div>
        )}

        {selectedParcel.bill_name && (
          <div className="card bg-blue-50">
            <h4 className="font-semibold text-sm text-gray-600 mb-2">Related Legislation</h4>
            <p className="text-lg font-semibold text-blue-900 mb-2">
              {selectedParcel.bill_name}
            </p>
            {selectedParcel.bill_number && (
              <p className="text-sm text-gray-600 mb-2">{selectedParcel.bill_number}</p>
            )}
            {selectedParcel.bill_status && (
              <p className="text-sm">
                <span className="font-semibold">Status:</span> {selectedParcel.bill_status}
              </p>
            )}
            {selectedParcel.bill_url && (
              <a
                href={selectedParcel.bill_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm underline block mt-2"
              >
                View on Congress.gov →
              </a>
            )}
          </div>
        )}

        {selectedParcel.township && selectedParcel.range && selectedParcel.section && (
          <div className="card">
            <h4 className="font-semibold text-sm text-gray-600 mb-2">
              Public Land Survey System (PLSS)
            </h4>
            <p className="text-sm">
              Township: {selectedParcel.township}<br />
              Range: {selectedParcel.range}<br />
              Section: {selectedParcel.section}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
