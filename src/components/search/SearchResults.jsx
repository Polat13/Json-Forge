import { useMemo } from 'react'
import { FiCopy } from 'react-icons/fi'
import { useJsonStore } from '../../app/store/useJsonStore'
import { searchJson } from '../../lib/jsonSearch'

const typeStyles = {
  array: 'border-cyan-500/20 bg-cyan-500/10 text-cyan-300',
  object: 'border-violet-500/20 bg-violet-500/10 text-violet-300',
  string: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
  number: 'border-amber-500/20 bg-amber-500/10 text-amber-300',
  boolean: 'border-sky-500/20 bg-sky-500/10 text-sky-300',
  null: 'border-rose-500/20 bg-rose-500/10 text-rose-300',
}

const copyToClipboard = async (value) => {
  try {
    await navigator.clipboard.writeText(value)
  } catch (err) {
    console.error(err)
  }
}

function SearchResults() {
  const { parsedJson, searchQuery, selectedNode, setSelectedNode } = useJsonStore()

  const results = useMemo(() => {
    if (!parsedJson) return []

    return searchJson(parsedJson, searchQuery)
  }, [parsedJson, searchQuery])

  if (!searchQuery.trim()) return null

  return (
    <section className="border-b border-zinc-800 bg-zinc-950/40">
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <h2 className="text-sm font-medium text-zinc-100">Search Results</h2>
          <p className="text-xs text-zinc-500">
            {results.length} match{results.length === 1 ? '' : 'es'} for "{searchQuery}"
          </p>
        </div>

        <span className="rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs text-zinc-400">
          Path aware
        </span>
      </div>

      <div className="max-h-64 overflow-auto px-2 pb-3">
        {results.length > 0 ? (
          <div className="space-y-1">
            {results.map((result) => (
              <div
                role="button"
                tabIndex={0}
                key={result.id}
                onClick={() => setSelectedNode(result)}
                onKeyDown={(event) => {
                  if (event.key !== 'Enter' && event.key !== ' ') return

                  event.preventDefault()
                  setSelectedNode(result)
                }}
                className={`group grid w-full cursor-pointer grid-cols-[1fr_auto] gap-3 rounded-lg border px-2 py-2 text-left transition ${
                  selectedNode?.path === result.path
                    ? 'border-indigo-500/30 bg-indigo-500/10'
                    : 'border-transparent hover:border-zinc-800 hover:bg-zinc-900/80'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-md border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                        typeStyles[result.type] || 'border-zinc-700 bg-zinc-800 text-zinc-300'
                      }`}
                    >
                      {result.type}
                    </span>

                    <span className="truncate text-sm font-medium text-zinc-200">
                      {result.key}
                    </span>
                  </div>

                  <p className="mt-1 truncate font-mono text-xs text-indigo-300">
                    {result.path}
                  </p>

                  <p className="mt-1 truncate text-xs text-zinc-500">
                    {result.preview}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    copyToClipboard(result.path)
                  }}
                  className="mt-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-zinc-500 opacity-100 transition hover:bg-zinc-800 hover:text-zinc-100 sm:opacity-0 sm:group-hover:opacity-100"
                  aria-label={`Copy path ${result.path}`}
                  title="Copy path"
                >
                  <FiCopy />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-zinc-800 px-4 py-6 text-center text-sm text-zinc-500">
            No matching keys, values, or paths.
          </div>
        )}
      </div>
    </section>
  )
}

export default SearchResults
