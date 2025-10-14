import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchBills = createAsyncThunk('bills/fetchBills', async () => {
  const response = await axios.get(`${API_URL}/bills`);
  return response.data.data;
});

export const fetchBillById = createAsyncThunk('bills/fetchBillById', async (id) => {
  const response = await axios.get(`${API_URL}/bills/${id}`);
  return response.data.data;
});

const billsSlice = createSlice({
  name: 'bills',
  initialState: {
    items: [],
    selectedBill: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedBill: (state, action) => {
      state.selectedBill = action.payload;
    },
    clearSelectedBill: (state) => {
      state.selectedBill = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBills.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBills.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchBillById.fulfilled, (state, action) => {
        state.selectedBill = action.payload;
      });
  },
});

export const { setSelectedBill, clearSelectedBill } = billsSlice.actions;
export default billsSlice.reducer;
