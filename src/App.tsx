import { useEffect, useState } from 'react'
import { PostForm } from './features/post/components/PostForm'
import { PostList } from './features/post/components/PostList'
import {
  addPost,
  deletePost,
  fetchPosts,
  selectPostState,
  updatePost,
} from './features/post/postSlice'
import type { Post, PostFormValues } from './features/post/types'
import { useAppDispatch, useAppSelector } from './app/hooks'

function App() {
  const dispatch = useAppDispatch()
  const { items, status, error, activeRequest } = useAppSelector(selectPostState)
  const [editingPost, setEditingPost] = useState<Post | null>(null)

  useEffect(() => {
    if (status === 'idle') {
      void dispatch(fetchPosts())
    }
  }, [dispatch, status])

  const handleCreateOrUpdate = async (values: PostFormValues) => {
    if (editingPost) {
      await dispatch(
        updatePost({
          id: editingPost.id,
          changes: values,
        }),
      ).unwrap()
      setEditingPost(null)
      return
    }

    await dispatch(addPost(values)).unwrap()
  }

  const handleEdit = (post: Post) => {
    setEditingPost(post)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: number) => {
    await dispatch(deletePost(id)).unwrap()

    if (editingPost?.id === id) {
      setEditingPost(null)
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#1e293b,_#020617_55%)] text-slate-50">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <header className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">
            Redux Toolkit CRUD
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
            Manage JSONPlaceholder posts with a clean production-ready structure
          </h1>
        </header>

        <section className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
          <PostForm
            key={editingPost?.id ?? 'create'}
            mode={editingPost ? 'edit' : 'create'}
            initialValues={editingPost ?? undefined}
            isSaving={activeRequest === 'create' || activeRequest === 'update'}
            onCancel={() => setEditingPost(null)}
            onSubmit={handleCreateOrUpdate}
          />

          <div className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-5 shadow-xl backdrop-blur">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">
                    Posts Dashboard
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold text-white">
                    {items.length} posts loaded
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => void dispatch(fetchPosts())}
                  className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:border-cyan-300 hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'Refreshing...' : 'Refresh posts'}
                </button>
              </div>

              {error ? (
                <p className="mt-4 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                  {error}
                </p>
              ) : null}
            </div>

            <PostList
              posts={items}
              isLoading={status === 'loading'}
              activeRequest={activeRequest}
              editingPostId={editingPost?.id ?? null}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          </div>
        </section>
      </div>
    </main>
  )
}

export default App
