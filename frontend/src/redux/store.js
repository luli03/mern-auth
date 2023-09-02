import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/authSlice'
import {appApi} from './services/appApi'


const store = configureStore({
    reducer:{
        auth: authReducer,
        [appApi.reducerPath]: appApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(appApi.middleware),
    devTools: true,
})

export default store;