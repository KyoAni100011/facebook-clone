import { createSlice } from "@reduxjs/toolkit";

const Post = createSlice({
  name: "Post",
  initialState: {
    content: "",
    image: "",
  },
  reducers: {
    addPost: (state, action) => {
      state.content = action.payload.payload.content;
      state.image = action.payload.payload.image;
    },
  },
});

export const postAction = Post.actions;

export default Post;
