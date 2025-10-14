import { configureStore } from '@reduxjs/toolkit';
import parcelsReducer from './parcelsSlice';
import billsReducer from './billsSlice';
import mapReducer from './mapSlice';

export const store = configureStore({
  reducer: {
    parcels: parcelsReducer,
    bills: billsReducer,
    map: mapReducer,
  },
});
