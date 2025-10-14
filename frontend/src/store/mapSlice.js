import { createSlice } from '@reduxjs/toolkit';

const mapSlice = createSlice({
  name: 'map',
  initialState: {
    center: [-117.0, 38.8], // Nevada center
    zoom: 5.5,
    bounds: null,
    hoveredParcelId: null,
  },
  reducers: {
    setMapCenter: (state, action) => {
      state.center = action.payload;
    },
    setMapZoom: (state, action) => {
      state.zoom = action.payload;
    },
    setMapBounds: (state, action) => {
      state.bounds = action.payload;
    },
    setHoveredParcel: (state, action) => {
      state.hoveredParcelId = action.payload;
    },
  },
});

export const { setMapCenter, setMapZoom, setMapBounds, setHoveredParcel } = mapSlice.actions;
export default mapSlice.reducer;
