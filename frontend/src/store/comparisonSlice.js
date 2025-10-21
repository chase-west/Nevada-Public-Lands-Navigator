import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  parcels: [], // Array of parcel IDs to compare
  isComparing: false,
};

const comparisonSlice = createSlice({
  name: 'comparison',
  initialState,
  reducers: {
    addToComparison: (state, action) => {
      const parcel = action.payload;
      // Limit to 3 parcels
      if (state.parcels.length < 3 && !state.parcels.find(p => p.id === parcel.id)) {
        state.parcels.push(parcel);
      }
    },
    removeFromComparison: (state, action) => {
      const parcelId = action.payload;
      state.parcels = state.parcels.filter(p => p.id !== parcelId);
    },
    clearComparison: (state) => {
      state.parcels = [];
      state.isComparing = false;
    },
    setIsComparing: (state, action) => {
      state.isComparing = action.payload;
    },
  },
});

export const { addToComparison, removeFromComparison, clearComparison, setIsComparing } = comparisonSlice.actions;
export default comparisonSlice.reducer;
