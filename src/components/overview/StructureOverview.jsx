import { useMemo, useState } from 'react'
import {
  FiActivity,
  FiBox,
  FiChevronLeft,
  FiChevronRight,
  FiCode,
  FiCommand,
  FiGitBranch,
} from 'react-icons/fi'
import { useJsonStore } from '../../app/store/useJsonStore'
import { getJsonStats } from '../../lib/jsonStats'

const formatNumber = (value) => new Intl.NumberFormat('en-US').format(value)

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="relative overflow-hidden rounded-xl p-[1px] w-full h-full flex items-center justify-center">
      {/* Rotating border gradient */}
      <div className="absolute inset-[-300%] bg-[conic-gradient(from_0deg,transparent_40%,#818cf8_45%,#c084fc_50%,#818cf8_55%,transparent_60%)] animate-border-spin z-0" />
      <style>{`
        @keyframes borderSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-border-spin {
          animation: borderSpin 4.5s linear infinite;
        }
      `}</style>

      {/* Content box covering the center */}
      <div className="w-full h-full rounded-[11px] bg-zinc-950/95 p-3 relative z-10">
        <div className="pb-2 flex items-center gap-2 text-xs text-zinc-500">
          <Icon className="text-zinc-400" />
          <span>{label}</span>
        </div>

        <p className="text-lg font-semibold text-zinc-100">{value}</p>
      </div>
    </div>
  )
}

function StructureOverview() {
  const { openCommandPalette, parsedJson } = useJsonStore()
  const [isOpen, setIsOpen] = useState(true)

  const stats = useMemo(() => {
    if (!parsedJson) return null

    return getJsonStats(parsedJson)
  }, [parsedJson])

  return (
    <aside
      className={
        `flex shrink-0 flex-col border-zinc-800 bg-zinc-950 transition-all duration-200 ${
          isOpen
            ? 'w-full border-b px-4 py-4 md:w-64 md:border-b-0 md:border-r'
            : 'w-full border-b px-2 py-2 md:w-14 md:border-b-0 md:border-r'
        }`
      }
    >
      <div className="flex items-center justify-between gap-3">
        <div className={`${isOpen ? 'min-w-0' : 'hidden'}`}>
          <p className="text-xs font-medium uppercase tracking-wide text-indigo-300">
            JSON Forge
          </p>
          {isOpen && (
            <h1 className="mt-1 text-lg font-semibold text-zinc-100">
              Structure
            </h1>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 transition hover:border-indigo-500/40 hover:bg-zinc-800"
          aria-label={isOpen ? 'Collapse sidebar' : 'Open sidebar'}
        >
          {isOpen ? <FiChevronLeft /> : <FiChevronRight />}
        </button>
      </div>

      {isOpen && (
        <div className="min-h-0 flex-1 overflow-auto mt-4">
          {stats ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Metric icon={FiActivity} label="Nodes" value={formatNumber(stats.totalNodes)} />
                <Metric icon={FiCode} label="Keys" value={formatNumber(stats.keys)} />
                <Metric icon={FiBox} label="Objects" value={formatNumber(stats.objects)} />
                <Metric icon={FiGitBranch} label="Depth" value={stats.maxDepth} />
              </div>

              <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
                <div className="mb-3 flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Value Types</span>
                  <span className="text-zinc-400">
                    {formatNumber(stats.primitives)} values
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Arrays</span>
                    <span className="font-medium text-cyan-300">{formatNumber(stats.arrays)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Objects</span>
                    <span className="font-medium text-violet-300">{formatNumber(stats.objects)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Simple values</span>
                    <span className="font-medium text-emerald-300">{formatNumber(stats.primitives)}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
                <p className="text-xs text-zinc-500">Largest array</p>

                {stats.largestArray ? (
                  <>
                    <p className="mt-2 text-lg font-semibold text-zinc-100">
                      {formatNumber(stats.largestArray.size)} items
                    </p>
                    <p className="mt-1 truncate font-mono text-xs text-indigo-300">
                      {stats.largestArray.path}
                    </p>
                  </>
                ) : (
                  <p className="mt-2 text-sm text-zinc-500">No arrays found</p>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-zinc-800 p-4 text-sm text-zinc-500">
              Enter valid JSON to see structure metrics.
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={openCommandPalette}
        className={`mt-4 inline-flex h-9 w-full cursor-pointer items-center rounded-lg border border-zinc-800 bg-zinc-900/70 px-3 text-sm text-zinc-300 transition hover:border-indigo-500/40 hover:bg-zinc-900 hover:text-zinc-100 ${
          isOpen ? 'justify-between' : 'justify-center'
        }`}
      >
        <span className={`flex items-center gap-2 ${isOpen ? '' : 'justify-center'}`}>
          <FiCommand className="text-indigo-300" />
          {isOpen && 'Shortcuts'}
        </span>
        {isOpen && (
          <kbd className="rounded-md border border-zinc-800 bg-zinc-950 px-1.5 py-0.5 text-[10px] text-zinc-500">
            Ctrl Shift P
          </kbd>
        )}
      </button>
    </aside>
  )
}

export default StructureOverview
