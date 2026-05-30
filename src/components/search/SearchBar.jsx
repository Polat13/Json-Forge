import { useEffect, useRef } from 'react'
import { FiSearch, FiX } from 'react-icons/fi'
import { useJsonStore } from '../../app/store/useJsonStore'

function SearchBar() {
  const inputRef = useRef(null)
  const { searchFocusRequest, searchQuery, setSearchQuery } = useJsonStore()

  useEffect(() => {
    if (searchFocusRequest === 0) return

    inputRef.current?.focus()
  }, [searchFocusRequest])

  return (
    <div className="relative w-full">
      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />

      <input
        ref={inputRef}
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        placeholder="Search keys, values, paths..."
        className="h-9 w-full rounded-lg border border-zinc-800 bg-zinc-950/80 pl-9 pr-20 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-indigo-500/70 focus:bg-zinc-950"
      />

      {searchQuery ? (
        <button
          type="button"
          onClick={() => setSearchQuery('')}
          className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-zinc-500 transition hover:bg-zinc-800 hover:text-zinc-200"
          aria-label="Clear search"
          title="Clear search"
        >
          <FiX />
        </button>
      ) : (
        <kbd className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-md border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 sm:block">
          Ctrl K
        </kbd>
      )}
    </div>
  )
}

export default SearchBar
