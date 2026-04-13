import type { Post } from '../types'

type PostListProps = {
  posts: Post[]
  isLoading: boolean
  activeRequest: 'idle' | 'fetch' | 'create' | 'update' | 'delete'
  editingPostId: number | null
  onDelete: (id: number) => Promise<void>
  onEdit: (post: Post) => void
}

export function PostList({
  posts,
  isLoading,
  activeRequest,
  editingPostId,
  onDelete,
  onEdit,
}: PostListProps) {
  if (isLoading && posts.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-8 text-center text-slate-300 shadow-xl backdrop-blur">
        Loading posts from local post.json...
      </div>
    )
  }

  return (
    <section className="grid gap-4">
      {posts.map((post) => (
        <article
          key={post.id}
          className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur transition hover:border-cyan-300/30 hover:bg-white/8"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-cyan-200">
                <span className="rounded-full bg-cyan-400/10 px-3 py-1">
                  Post #{post.id}
                </span>
                <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-emerald-200">
                  User {post.userId}
                </span>
                {editingPostId === post.id ? (
                  <span className="rounded-full bg-amber-400/10 px-3 py-1 text-amber-200">
                    Editing
                  </span>
                ) : null}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">{post.title}</h3>
                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-300">
                  {post.body}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 gap-3">
              <button
                type="button"
                className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-100 transition hover:bg-emerald-400/20"
                onClick={() => onEdit(post)}
              >
                Edit
              </button>

              <button
                type="button"
                className="rounded-full border border-rose-400/30 bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-100 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={() => void onDelete(post.id)}
                disabled={activeRequest === 'delete'}
              >
                {activeRequest === 'delete' ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </article>
      ))}
    </section>
  )
}
