import { combineReducers } from "@reduxjs/toolkit";
import { authApi } from "../services/authApi";
import { authSlice } from "../slices/authSlice";
import { userApi } from "../services/userApi";
import { depositsApi } from "../services/depositsApi";
import { galleryApi } from "../services/galleryApi";
import { boardApi } from "../services/boardApi";
import { messagesApi } from "../services/messagesApi";
import { settingsApi } from "../services/settingsApi";

export default combineReducers({
	[authSlice.name]: authSlice.reducer,
	[authApi.reducerPath]: authApi.reducer,
	[userApi.reducerPath]: userApi.reducer,
	[depositsApi.reducerPath]: depositsApi.reducer,
	[galleryApi.reducerPath]: galleryApi.reducer,
	[boardApi.reducerPath]: boardApi.reducer,
	[messagesApi.reducerPath]: messagesApi.reducer,
	[settingsApi.reducerPath]: settingsApi.reducer,
})