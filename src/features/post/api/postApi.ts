import axios from 'axios'
import type { Post, PostFormValues } from '../types'

const postsApi = axios.create({
  baseURL:  'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const postApi = {
  async getPosts() {
    const response = await postsApi.get<Post[]>('/posts', {
      params: {
        _sort: 'id',
        _order: 'desc',
      },
    })
    return response.data
  },

  async getPostById(id: number) {
    const response = await postsApi.get<Post>(`/posts/${id}`)
    return response.data
  },

  async createPost(payload: PostFormValues) {
    const response = await postsApi.post<Post>('/posts', payload)
    return response.data
  },

  async updatePost(id: number, payload: PostFormValues) {
    const response = await postsApi.put<Post>(`/posts/${id}`, {
      id,
      ...payload,
    })
    return response.data
  },

  async deletePost(id: number) {
    await postsApi.delete(`/posts/${id}`)
    return id
  },
}
