import { User } from "@/src/models/UserModel";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: User = {
  isRegister: false,
  favoriteSports: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateRegister: (state, action: PayloadAction<boolean>) => {
      state.isRegister = action.payload;
    },
    updateFavoriteSports: (state, action: PayloadAction<number[]>) => {
      state.favoriteSports = action.payload;
    }
  }
});

export const { updateRegister, updateFavoriteSports } = userSlice.actions;
export default userSlice.reducer;