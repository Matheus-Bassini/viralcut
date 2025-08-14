import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';

// Slices
import authSlice from './slices/authSlice';
import uiSlice from './slices/uiSlice';
import videoSlice from './slices/videoSlice';
import paymentSlice from './slices/paymentSlice';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'ui'], // Only persist auth and ui state
  blacklist: ['video', 'payment'], // Don't persist video and payment state
};

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'isAuthenticated', 'tokens'], // Only persist essential auth data
};

const uiPersistConfig = {
  key: 'ui',
  storage,
  whitelist: ['darkMode', 'language'], // Only persist UI preferences
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authSlice),
  ui: persistReducer(uiPersistConfig, uiSlice),
  video: videoSlice,
  payment: paymentSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER',
        ],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

// Export types for TypeScript usage (commented out for JS)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
