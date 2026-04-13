export type Post = {
  userId: number
  id: number
  title: string
  body: string
}

export type PostFormValues = Omit<Post, 'id'>

export type PostState = {
  items: Post[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  activeRequest: 'idle' | 'fetch' | 'create' | 'update' | 'delete'
}
