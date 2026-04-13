import type { Post, PostFormValues } from '../types'
import postSeedData from '../../../../utils/post.json'

let postsCache: Post[] | null = null

const clonePost = (post: Post): Post => ({ ...post })

async function ensurePostsLoaded(): Promise<Post[]> {
  if (postsCache) {
    return postsCache
  }

  postsCache = (postSeedData as Post[]).map(clonePost)
  return postsCache
}

export const postApi = {
  async getPosts() {
    const posts = await ensurePostsLoaded()
    return posts.map(clonePost)
  },

  async createPost(payload: PostFormValues) {
    const posts = await ensurePostsLoaded()
    const maxId = posts.reduce((currentMax, post) => Math.max(currentMax, post.id), 0)

    const createdPost: Post = {
      id: maxId + 1,
      userId: payload.userId,
      title: payload.title,
      body: payload.body,
    }

    postsCache = [createdPost, ...posts]
    return clonePost(createdPost)
  },

  async updatePost(id: number, payload: PostFormValues) {
    const posts = await ensurePostsLoaded()
    const targetIndex = posts.findIndex((post) => post.id === id)

    if (targetIndex === -1) {
      throw new Error(`Post with id ${id} not found.`)
    }

    const updatedPost: Post = {
      id,
      userId: payload.userId,
      title: payload.title,
      body: payload.body,
    }

    const nextPosts = [...posts]
    nextPosts[targetIndex] = updatedPost
    postsCache = nextPosts
    return clonePost(updatedPost)
  },

  async deletePost(id: number) {
    const posts = await ensurePostsLoaded()
    postsCache = posts.filter((post) => post.id !== id)
    return id
  },
}
