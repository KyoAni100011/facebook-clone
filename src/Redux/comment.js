import { createSlice } from "@reduxjs/toolkit";

const Comment = createSlice({
  name: "Post",
  initialState: {
    content: "",
    image: "",
  },
  reducers: {
    addComment: (state, action) => {
      state.content = action.payload.payload.content;
      state.image = action.payload.payload.image;
    },
  },
});

export const commentAction = Comment.actions;

export default Comment;
