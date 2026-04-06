import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers/rootReducer";
import { authApi } from "./services/authApi";
import { setupListeners } from "@reduxjs/toolkit/query";
import {
	FLUSH,
	PAUSE,
	PURGE,
	PERSIST,
	REGISTER,
	REHYDRATE,
	persistStore,
	persistReducer,
} from "redux-persist";
import { authSlice } from "./slices/authSlice";
// import storage from "redux-persist/lib/storage"; // uses localStorage
import { userApi } from "./services/userApi";
import { depositsApi } from "./services/depositsApi";
import { galleryApi } from "./services/galleryApi";
import { boardApi } from "./services/boardApi";
import { messagesApi } from "./services/messagesApi";
import { settingsApi } from "./services/settingsApi";
import { rulesApi } from "./services/rulesApi";
import { notificationsApi } from "./services/notificationsApi";
import storage from "./storage";

const persistConfig = {
	key: "root",
	storage: storage,
	whitelist: [
		authSlice.name // only persist auth slice
	],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
	reducer: persistedReducer,
	devTools: process.env.NODE_ENV !== "production",
	middleware: (getDefaultMiddleware) => getDefaultMiddleware({
		serializableCheck: {
			ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
		},
	}).concat(authApi.middleware, userApi.middleware, depositsApi.middleware, galleryApi.middleware, boardApi.middleware, messagesApi.middleware, notificationsApi.middleware, settingsApi.middleware, rulesApi.middleware),
});

export const persistor = persistStore(store);

// Enables auto-refetching for background focus, reconnections, etc.
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
