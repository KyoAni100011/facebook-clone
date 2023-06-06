import { configureStore } from "@reduxjs/toolkit";
import Post from "./Post";
import Comment from "./comment";

export const store = configureStore({
  reducer: {
    post: Post.reducer,
    comment: Comment.reducer,
  },
});
