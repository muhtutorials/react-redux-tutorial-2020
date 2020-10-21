import { createSlice, createAsyncThunk, createSelector, createEntityAdapter } from '@reduxjs/toolkit'
import { client } from '../../api/client'

const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date)
})

const initialState = postsAdapter.getInitialState({
  status: 'idle',
  error: null
})

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await client.get('/fakeApi/posts')
  return response.posts
})

export const addNewPost = createAsyncThunk(
  'posts/addNewPost',
  async initialPost => {
    const response = await client.post('/fakeApi/posts', { post: initialPost })
    return response.post
  }
)

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postUpdated(state, action) {
      const { id, title, content } = action.payload
      // const existingPost = state.posts.find(post => post.id === id)
      const existingPost = state.entities[id]
      if (existingPost) {
        existingPost.title = title
        existingPost.content = content
      }
    },

    reactionAdded(state, action) {
      const { id, reaction } = action.payload
      // const existingPost = state.posts.find(post => post.id === id)
      const existingPost = state.entities[id]
      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    }
  },

  extraReducers: {
    // https://immerjs.github.io/immer/docs/return#inline-shortcuts-using-void
    [fetchPosts.pending]: state => void (state.status = 'loading'),

    [fetchPosts.fulfilled]: (state, action) => {
      state.status = 'succeeded'
      // state.posts = state.posts.concat(action.payload)
      postsAdapter.upsertMany(state, action.payload)
    },

    [fetchPosts.rejected]: (state, action) => {
      state.status = 'failed'
      state.error = action.error.message
    },

    // [addNewPost.fulfilled]: (state, action) => {
    //   state.posts.push(action.payload)
    // }
    [addNewPost.fulfilled]: postsAdapter.addOne
  }
})

export const { postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer

// export const selectAllPosts = state => state.posts.posts
//
// export const selectPostById = (state, postId) => state.posts.posts.find(post => post.id === postId)
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds
} = postsAdapter.getSelectors(state => state.posts)

// https://redux.js.org/tutorials/essentials/part-6-performance-normalization#memoizing-selector-functions
export const selectPostsByUser = createSelector(
  [selectAllPosts, (state, userId) => userId],
  (posts, userId) => posts.filter(post => post.user === userId)
)