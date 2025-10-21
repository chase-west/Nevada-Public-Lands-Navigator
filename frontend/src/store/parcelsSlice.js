import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchParcels = createAsyncThunk(
  'parcels/fetchParcels',
  async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.county) params.append('county', filters.county);
    if (filters.bill_id) params.append('bill_id', filters.bill_id);
    if (filters.use_type) params.append('use_type', filters.use_type);
    if (filters.bounds) params.append('bounds', filters.bounds);

    const response = await axios.get(`${API_URL}/parcels?${params.toString()}`);
    return response.data.data;
  }
);

export const fetchParcelById = createAsyncThunk(
  'parcels/fetchParcelById',
  async (id) => {
    const response = await axios.get(`${API_URL}/parcels/${id}`);
    return response.data.data;
  }
);

const parcelsSlice = createSlice({
  name: 'parcels',
  initialState: {
    items: [],
    selectedParcel: null,
    loading: false,
    error: null,
    filters: {
      county: null,
      bill_id: null,
      use_type: null,
    },
  },
  reducers: {
    setSelectedParcel: (state, action) => {
      state.selectedParcel = action.payload;
    },
    clearSelectedParcel: (state) => {
      state.selectedParcel = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { county: null, bill_id: null, use_type: null };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchParcels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParcels.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchParcels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchParcelById.fulfilled, (state, action) => {
        state.selectedParcel = action.payload;
      });
  },
});

export const { setSelectedParcel, clearSelectedParcel, setFilters, clearFilters } = parcelsSlice.actions;
export default parcelsSlice.reducer;
