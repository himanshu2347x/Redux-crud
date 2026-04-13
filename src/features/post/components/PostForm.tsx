import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import type { Post, PostFormValues } from '../types'

type PostFormProps = {
  mode: 'create' | 'edit'
  initialValues?: Partial<Post>
  isSaving: boolean
  onCancel: () => void
  onSubmit: (values: PostFormValues) => Promise<void>
}

const defaultValues: PostFormValues = {
  userId: 1,
  title: '',
  body: '',
}

export function PostForm({
  mode,
  initialValues,
  isSaving,
  onCancel,
  onSubmit,
}: PostFormProps) {
  const [formValues, setFormValues] = useState<PostFormValues>({
    userId: initialValues?.userId ?? 1,
    title: initialValues?.title ?? '',
    body: initialValues?.body ?? '',
  })
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target

    setFormValues((current) => ({
      ...current,
      [name]: name === 'userId' ? Number(value) : value,
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError(null)

    if (!formValues.title.trim() || !formValues.body.trim()) {
      setSubmitError('Title and body are required.')
      return
    }

    try {
      await onSubmit({
        userId: formValues.userId,
        title: formValues.title.trim(),
        body: formValues.body.trim(),
      })

      if (mode === 'create') {
        setFormValues(defaultValues)
      }
    } catch {
      setSubmitError('Request failed. Please try again.')
    }
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-950/50 p-6 shadow-xl backdrop-blur">
      <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">
        {mode === 'create' ? 'Create Post' : 'Edit Post'}
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-white">
        {mode === 'create' ? 'Add a new post' : 'Update selected post'}
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-300">
        Keep the form logic local and the async CRUD logic inside Redux Toolkit.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">
            User ID
          </span>
          <input
            className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300"
            type="number"
            min="1"
            name="userId"
            value={formValues.userId}
            onChange={handleChange}
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">
            Title
          </span>
          <input
            className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300"
            type="text"
            name="title"
            placeholder="Write a short title"
            value={formValues.title}
            onChange={handleChange}
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">
            Body
          </span>
          <textarea
            className="min-h-40 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300"
            name="body"
            placeholder="Write the post content"
            value={formValues.body}
            onChange={handleChange}
          />
        </label>

        {submitError ? (
          <p className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {submitError}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSaving}
          >
            {isSaving
              ? 'Saving...'
              : mode === 'create'
                ? 'Create post'
                : 'Save changes'}
          </button>

          {mode === 'edit' ? (
            <button
              type="button"
              className="rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-white/30 hover:bg-white/5"
              onClick={onCancel}
            >
              Cancel edit
            </button>
          ) : null}
        </div>
      </form>
    </section>
  )
}
