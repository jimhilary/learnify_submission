import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { combineReducers } from '@reduxjs/toolkit'
import coursesSlice from './slices/coursesSlice'
import lessonsSlice from './slices/lessonsSlice'
import progressSlice from './slices/progressSlice'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['progress'], // Only persist progress data
}

const rootReducer = combineReducers({
  courses: coursesSlice,
  lessons: lessonsSlice,
  progress: progressSlice,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
