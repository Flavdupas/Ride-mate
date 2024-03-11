import { User } from "@/src/models/UserModel";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: User = {
  isRegister: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateRegister: (state, action: PayloadAction<boolean>) => {
      state.isRegister = action.payload;
    },
  }
});

export const { updateRegister } = userSlice.actions;
export default userSlice.reducer;