import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducer';

export const store = configureStore({
    reducer: rootReducer,
    // devTools: process.env.NODE_ENV !== 'production' // Enable DevTools in development
});

export default store;