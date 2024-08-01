import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from './userSlice';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user'], // this is correct
};

const persistedReducer = persistReducer(persistConfig, userReducer);

export const store = configureStore({
    reducer: {
        user: persistedReducer
    },
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
                ignoredPaths: ['user.token']
            }
        })
});

export const persistor = persistStore(store);