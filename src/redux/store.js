import { configureStore } from "@reduxjs/toolkit";
import { flowboardSlice } from "./flowboard";

export const store = configureStore({
    reducer: {
        flowboard: flowboardSlice.reducer,
    }
});