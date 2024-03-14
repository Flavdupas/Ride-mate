import { User } from "@/src/models/UserModel";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: User = {
  isRegister: false,
  favoriteSports: [],
  favoriteIndexSport: null,
  favoriteIndexEquip:null,
  favoriteTypeParking:null,
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
    },
    updateFavoriteIndexSport: (state, action: PayloadAction<number | null>) => {
      state.favoriteIndexSport = action.payload;
    },
    updateFavoriteIndexEquip: (state, action: PayloadAction<number | null>) => {
      state.favoriteIndexEquip = action.payload;
    },
    updateFavoriteTypeParking: (state, action: PayloadAction<number | null>) => {
      state.favoriteTypeParking = action.payload;
    },
  }
});

export const { updateRegister, updateFavoriteSports, updateFavoriteIndexSport,updateFavoriteIndexEquip,updateFavoriteTypeParking } = userSlice.actions;
export default userSlice.reducer;