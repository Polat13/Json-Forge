import { FiCopy, FiX } from 'react-icons/fi'
import { useJsonStore } from '../../app/store/useJsonStore'

const copyToClipboard = async (value) => {
  try {
    await navigator.clipboard.writeText(value)
  } catch (err) {
    console.error(err)
  }
}

function JsonInspector() {
  const { selectedNode, setSelectedNode } = useJsonStore()

  if (!selectedNode) return null

  return (
    <aside className="border-b border-zinc-800 bg-zinc-950/60 px-4 py-3">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Inspector
          </p>
          <h2 className="mt-1 truncate text-sm font-medium text-zinc-100">
            {selectedNode.key}
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setSelectedNode(null)}
          className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-zinc-500 transition hover:bg-zinc-800 hover:text-zinc-100"
          aria-label="Close inspector"
          title="Close inspector"
        >
          <FiX />
        </button>
      </div>

      <div className="grid grid-cols-[72px_1fr_auto] items-center gap-2 text-xs">
        <span className="text-zinc-500">Path</span>
        <code className="truncate rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 font-mono text-indigo-300">
          {selectedNode.path}
        </code>
        <button
          type="button"
          onClick={() => copyToClipboard(selectedNode.path)}
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-zinc-500 transition hover:bg-zinc-800 hover:text-zinc-100"
          aria-label="Copy selected path"
          title="Copy path"
        >
          <FiCopy />
        </button>

        <span className="text-zinc-500">Type</span>
        <span className="col-span-2 rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 text-zinc-300">
          {selectedNode.type}
        </span>

        <span className="text-zinc-500">Value</span>
        <span className="col-span-2 truncate rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 text-zinc-300">
          {selectedNode.preview}
        </span>
      </div>
    </aside>
  )
}

export default JsonInspector
