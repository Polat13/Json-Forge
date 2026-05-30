import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  FiCommand,
  FiCopy,
  FiDownload,
  FiMinimize2,
  FiSearch,
  FiX,
} from 'react-icons/fi'
import { useJsonActions } from '../../app/hooks/useJsonActions'
import { useJsonStore } from '../../app/store/useJsonStore'

const isModKey = (event) => event.metaKey || event.ctrlKey

function CommandPalette() {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const {
    closeCommandPalette,
    isCommandPaletteOpen,
    openCommandPalette,
    searchQuery,
    selectedNode,
  } = useJsonStore()

  const {
    clearSearch,
    closeInspector,
    copyJson,
    exportJson,
    focusSearch,
    formatJson,
    isValid,
    minifyJson,
  } = useJsonActions()

  const commands = useMemo(() => [
    {
      id: 'format-json',
      label: 'Format JSON',
      shortcut: 'Ctrl Shift F',
      icon: FiCommand,
      disabled: !isValid,
      action: formatJson,
    },
    {
      id: 'minify-json',
      label: 'Minify JSON',
      shortcut: 'Ctrl Shift M',
      icon: FiMinimize2,
      disabled: !isValid,
      action: minifyJson,
    },
    {
      id: 'copy-json',
      label: 'Copy JSON',
      shortcut: 'Ctrl Shift C',
      icon: FiCopy,
      action: copyJson,
    },
    {
      id: 'export-json',
      label: 'Export JSON',
      shortcut: 'Ctrl Shift E',
      icon: FiDownload,
      action: () => exportJson('json'),
    },
    {
      id: 'export-txt',
      label: 'Export TXT',
      shortcut: 'Ctrl Shift T',
      icon: FiDownload,
      action: () => exportJson('txt'),
    },
    {
      id: 'focus-search',
      label: 'Focus Search',
      shortcut: 'Ctrl K',
      icon: FiSearch,
      action: focusSearch,
    },
    {
      id: 'clear-search',
      label: 'Clear Search',
      shortcut: '',
      icon: FiX,
      action: clearSearch,
    },
    {
      id: 'close-inspector',
      label: 'Close Inspector',
      shortcut: 'Esc',
      icon: FiX,
      action: closeInspector,
    },
  ], [
    clearSearch,
    closeInspector,
    copyJson,
    exportJson,
    focusSearch,
    formatJson,
    isValid,
    minifyJson,
  ])

  const filteredCommands = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) return commands

    return commands.filter((command) =>
      command.label.toLowerCase().includes(normalizedQuery)
    )
  }, [commands, query])

  const openPalette = useCallback(() => {
    setQuery('')
    setActiveIndex(0)
    openCommandPalette()
  }, [openCommandPalette])

  const closePalette = useCallback(() => {
    setQuery('')
    closeCommandPalette()
  }, [closeCommandPalette])

  const runCommand = useCallback((command) => {
    if (!command || command.disabled) return

    command.action()
    closePalette()
  }, [closePalette])

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase()

      if (isModKey(event) && event.shiftKey && key === 'p') {
        event.preventDefault()
        openPalette()
        return
      }

      if (event.key === 'Escape') {
        if (isCommandPaletteOpen) {
          event.preventDefault()
          closePalette()
          return
        }

        if (selectedNode) {
          event.preventDefault()
          closeInspector()
          return
        }

        if (searchQuery) {
          event.preventDefault()
          clearSearch()
          return
        }

        return
      }

      if (isCommandPaletteOpen) return

      if (isModKey(event) && !event.shiftKey && key === 'k') {
        event.preventDefault()
        focusSearch()
        return
      }

      if (isModKey(event) && event.shiftKey && key === 'f') {
        event.preventDefault()
        formatJson()
        return
      }

      if (isModKey(event) && event.shiftKey && key === 'm') {
        event.preventDefault()
        minifyJson()
        return
      }

      if (isModKey(event) && event.shiftKey && key === 'c') {
        event.preventDefault()
        copyJson()
        return
      }

      if (isModKey(event) && event.shiftKey && key === 'e') {
        event.preventDefault()
        exportJson('json')
      }

      if (isModKey(event) && event.shiftKey && key === 't') {
        event.preventDefault()
        exportJson('txt')
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [
    clearSearch,
    closeInspector,
    closePalette,
    copyJson,
    exportJson,
    focusSearch,
    formatJson,
    isCommandPaletteOpen,
    minifyJson,
    openPalette,
    searchQuery,
    selectedNode,
  ])

  useEffect(() => {
    if (!isCommandPaletteOpen) return

    const handlePaletteKeys = (event) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setActiveIndex((index) =>
          Math.min(index + 1, filteredCommands.length - 1)
        )
        return
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        setActiveIndex((index) => Math.max(index - 1, 0))
        return
      }

      if (event.key === 'Enter') {
        event.preventDefault()
        runCommand(filteredCommands[activeIndex])
      }
    }

    window.addEventListener('keydown', handlePaletteKeys)

    return () => {
      window.removeEventListener('keydown', handlePaletteKeys)
    }
  }, [activeIndex, filteredCommands, isCommandPaletteOpen, runCommand])

  if (!isCommandPaletteOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-950/70 px-4 pt-24 backdrop-blur-sm">
      <div className="w-full max-w-xl overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/40">
        <div className="flex h-12 items-center gap-3 border-b border-zinc-800 px-4">
          <FiCommand className="text-indigo-300" />

          <input
            autoFocus
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setActiveIndex(0)
            }}
            placeholder="Run a command..."
            className="h-full flex-1 bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
          />

          <kbd className="rounded-md border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500">
            Esc
          </kbd>
        </div>

        <div className="max-h-80 overflow-auto p-2">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((command, index) => {
              const Icon = command.icon
              const isActive = index === activeIndex

              return (
                <button
                  key={command.id}
                  type="button"
                  disabled={command.disabled}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => runCommand(command)}
                  className={`grid w-full cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg px-3 py-2 text-left transition disabled:cursor-not-allowed disabled:opacity-40 ${
                    isActive
                      ? 'bg-indigo-500/10 text-zinc-100'
                      : 'text-zinc-300 hover:bg-zinc-900'
                  }`}
                >
                  <Icon className={isActive ? 'text-indigo-300' : 'text-zinc-500'} />
                  <span className="text-sm font-medium">{command.label}</span>
                  {command.shortcut ? (
                    <span className="text-xs text-zinc-500">{command.shortcut}</span>
                  ) : null}
                </button>
              )
            })
          ) : (
            <div className="px-4 py-8 text-center text-sm text-zinc-500">
              No commands found.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CommandPalette
