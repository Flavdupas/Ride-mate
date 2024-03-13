import { configureStore } from '@reduxjs/toolkit';
import User from './user/User';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from 'redux-persist';
import Data from './data/Data';

const userPersistConfig = {
  key: 'user',
  storage: AsyncStorage,
};

const persistedLoginReducer = persistReducer(userPersistConfig, User);

const store = configureStore({
  reducer: {
    user: persistedLoginReducer,
    data: Data,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export default store;

export type RootState = ReturnType<typeof store.getState>