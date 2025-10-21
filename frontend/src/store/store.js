import { configureStore } from '@reduxjs/toolkit';
import parcelsReducer from './parcelsSlice';
import billsReducer from './billsSlice';
import mapReducer from './mapSlice';
import comparisonReducer from './comparisonSlice';

export const store = configureStore({
  reducer: {
    parcels: parcelsReducer,
    bills: billsReducer,
    map: mapReducer,
    comparison: comparisonReducer,
  },
});
