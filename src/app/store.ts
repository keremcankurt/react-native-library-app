import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import bookReducer from "../features/book/bookSlice";
export const store = configureStore({
    reducer: {
        auth: authReducer,
        book: bookReducer
    },
})

export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch