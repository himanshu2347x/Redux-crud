import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import { postApi } from './api/postApi'
import type { Post, PostFormValues, PostState } from './types'

const initialState: PostState = {
  items: [],
  status: 'idle',
  error: null,
  activeRequest: 'idle',
}

export const fetchPosts = createAsyncThunk('post/fetchPosts', async () => {
  const posts = await postApi.getPosts()
  return posts
})

export const searchPostById = createAsyncThunk(
  'post/searchPostById',
  async (id: number, { rejectWithValue }) => {
    try {
      const post = await postApi.getPostById(id)
      return [post]
    } catch {
      return rejectWithValue(`Post with id ${id} was not found.`)
    }
  },
)

export const addPost = createAsyncThunk(
  'post/addPost',
  async (payload: PostFormValues) => {
    const createdPost = await postApi.createPost(payload)
    return createdPost
  },
)

export const updatePost = createAsyncThunk(
  'post/updatePost',
  async ({ id, changes }: { id: number; changes: PostFormValues }) => {
    const updatedPost = await postApi.updatePost(id, changes)
    return {
      ...updatedPost,
      id,
    }
  },
)

export const deletePost = createAsyncThunk('post/deletePost', async (id: number) => {
  await postApi.deletePost(id)
  return id
})

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading'
        state.error = null
        state.activeRequest = 'fetch'
      })
      .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
        state.status = 'succeeded'
        state.items = action.payload
        state.activeRequest = 'idle'    
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Failed to fetch posts.'
        state.activeRequest = 'idle'
      })
      .addCase(searchPostById.pending, (state) => {
        state.status = 'loading'
        state.error = null
        state.activeRequest = 'search'
      })
      .addCase(searchPostById.fulfilled, (state, action: PayloadAction<Post[]>) => {
        state.status = 'succeeded'
        state.items = action.payload
        state.activeRequest = 'idle'
      })
      .addCase(searchPostById.rejected, (state, action) => {
        state.status = 'failed'
        state.items = []
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : action.error.message ?? 'Failed to search post.'
        state.activeRequest = 'idle'
      })
      .addCase(addPost.pending, (state) => {
        state.error = null
        state.activeRequest = 'create'
      })
      .addCase(addPost.fulfilled, (state, action: PayloadAction<Post>) => {
        state.items.unshift(action.payload)
        state.activeRequest = 'idle'
      })
      .addCase(addPost.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed to create post.'
        state.activeRequest = 'idle'
      })
      .addCase(updatePost.pending, (state) => {
        state.error = null
        state.activeRequest = 'update'
      })
      .addCase(updatePost.fulfilled, (state, action: PayloadAction<Post>) => {
        state.items = state.items.map((post) =>
          post.id === action.payload.id ? action.payload : post,
        )
        state.activeRequest = 'idle'
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed to update post.'
        state.activeRequest = 'idle'
      })
      .addCase(deletePost.pending, (state) => {
        state.error = null
        state.activeRequest = 'delete'
      })
      .addCase(deletePost.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter((post) => post.id !== action.payload)
        state.activeRequest = 'idle'
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed to delete post.'
        state.activeRequest = 'idle'
      })
  },
})

export const selectPostState = (state: RootState) => state.post

export default postSlice.reducer
