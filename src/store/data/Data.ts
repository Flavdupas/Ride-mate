import { Parking } from './../../models/Parking';
import { Activite } from './../../models/Activite';
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Data } from '@/src/models/Data';

const initialState: Data = {
    activite: [],
    parking: [],
};

const dataSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        updateActivite: (state, action: PayloadAction<Activite[]>) => {
            state.activite = action.payload;
        },
        updateParking: (state, action: PayloadAction<Parking[]>) => {
            state.parking = action.payload;
        }
    }
});

export const { updateActivite,updateParking } = dataSlice.actions;
export default dataSlice.reducer;