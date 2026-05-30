import { useState, useRef, useEffect } from 'react'
import {
  FiCheckCircle,
  FiAlertCircle,
  FiCopy,
  FiDownload,
  FiUpload,
  FiChevronDown,
} from 'react-icons/fi'

import { useJsonActions } from '../../app/hooks/useJsonActions'
import SearchBar from '../search/SearchBar'

function Toolbar() {
  const {
    copyJson,
    exportJson,
    formatJson,
    isValid,
    minifyJson,
    setJson,
  } = useJsonActions()


  const [isExportOpen, setIsExportOpen] = useState(false)
  const [toast, setToast] = useState(null)

  const exportDropdownRef = useRef(null)
  const toastTimeoutRef = useRef(null)

  const showToast = (message, type = 'success') => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current)
    }
    setToast({ message, type })
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null)
    }, 3000)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target)) {
        setIsExportOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current)
      }
    }
  }, [])

  const handleFormat = () => {
    if (!isValid) return
    formatJson()
    showToast('JSON formatted successfully!', 'success')
  }

  const handleMinify = () => {
    if (!isValid) return
    minifyJson()
    showToast('JSON minified successfully!', 'success')
  }

  const handleCopy = () => {
    copyJson()
    showToast('Editor JSON copied to clipboard!', 'success')
  }

  const handleExport = (format) => {
    exportJson(format)
    showToast(`Exported as ${format.toUpperCase()} successfully!`, 'success')
    setIsExportOpen(false)
  }

  const handleImport = (event) => {
    const file = event.target.files?.[0]

    if (!file) return

    const reader = new FileReader()

    reader.onload = (e) => {
      const content = e.target?.result

      if (typeof content === 'string') {
        setJson(content)
        showToast(`Imported ${file.name} successfully!`, 'success')
      }
    }

    reader.readAsText(file)
  }

  return (
    <>
      <div className="grid h-auto grid-cols-1 items-center gap-3 border-b border-zinc-800 bg-zinc-900 px-3 py-3 md:grid-cols-[1fr_minmax(280px,560px)_1fr] md:h-14 md:gap-4 md:px-4 md:py-0">

        {/* Left */}
        <div className="flex flex-wrap items-center gap-2 justify-self-start">
          <button
            onClick={handleFormat}
            disabled={!isValid}
            className="px-3 h-9 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 transition-all active:scale-95 duration-100 cursor-pointer text-xs font-semibold select-none"
            title="Format JSON structure"
          >
            Format
          </button>

          <button
            onClick={handleMinify}
            disabled={!isValid}
            className="px-3 h-9 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 transition-all active:scale-95 duration-100 cursor-pointer text-xs font-semibold select-none"
            title="Minify JSON structure"
          >
            Minify
          </button>
        </div>

        <div className="w-full justify-self-center">
          <SearchBar />
        </div>

        {/* Right */}
        <div className="flex flex-wrap items-center gap-2 justify-self-end">

          <button
            onClick={handleCopy}
            className="w-9 h-9 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-all active:scale-95 duration-100 flex items-center justify-center cursor-pointer text-zinc-300 hover:text-white"
            title="Copy Editor JSON"
          >
            <FiCopy />
          </button>

          <label className="w-9 h-9 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-all active:scale-95 duration-100 flex items-center justify-center cursor-pointer" title="Import JSON/TXT file">
            <FiUpload />
            <input
              type="file"
              accept=".json,.txt"
              hidden
              onChange={handleImport}
            />
          </label>

          {/* Export Dropdown */}
          <div className="relative flex items-center" ref={exportDropdownRef}>
            <button
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="flex items-center gap-1.5 h-9 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-all active:scale-95 duration-100 text-zinc-300 hover:text-white cursor-pointer select-none"
              title="Export Options"
            >
              <FiDownload className="w-4 h-4" />
              <FiChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            {isExportOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 rounded-xl bg-zinc-950 border border-zinc-800 shadow-2xl p-1.5 z-50 flex flex-col gap-1 animate-dropdown-in origin-top-right">
                <style>{`
                  @keyframes dropdownSlideIn {
                    from {
                      transform: translateY(-0.5rem) scale(0.95);
                      opacity: 0;
                    }
                    to {
                      transform: translateY(0) scale(1);
                      opacity: 1;
                    }
                  }
                  .animate-dropdown-in {
                    animation: dropdownSlideIn 0.15s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                  }
                `}</style>
                <button
                  onClick={() => handleExport('json')}
                  className="flex items-center justify-between px-3 py-2 text-xs text-left rounded-lg text-zinc-300 hover:bg-zinc-900 hover:text-white transition cursor-pointer"
                >
                  <span>Export JSON</span>
                  <span className="text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-1.5 py-0.5 rounded font-mono font-medium">.json</span>
                </button>
                <button
                  onClick={() => handleExport('txt')}
                  className="flex items-center justify-between px-3 py-2 text-xs text-left rounded-lg text-zinc-300 hover:bg-zinc-900 hover:text-white transition cursor-pointer"
                >
                  <span>Export TXT</span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono font-medium">.txt</span>
                </button>
              </div>
            )}
          </div>

          {/* Dynamic Status */}
          <div
            className={`
              flex items-center gap-2 px-3 h-9 rounded-xl border text-sm transition
              ${
                isValid
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-red-500/10 text-red-400 border-red-500/20'
              }
            `}
          >
            {isValid ? (
              <>
                <FiCheckCircle />
                <span className="hidden sm:inline">Valid JSON</span>
              </>
            ) : (
              <>
                <FiAlertCircle />
                <span className="hidden sm:inline">Invalid JSON</span>
              </>
            )}
          </div>

        </div>
      </div>

      {/* Premium Toast Notification overlay */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-zinc-950/90 border border-zinc-805 backdrop-blur-md px-4 py-3 rounded-2xl shadow-2xl text-zinc-100 max-w-sm animate-toast-in ring-1 ring-zinc-800">
          <style>{`
            @keyframes toastSlideIn {
              from {
                transform: translateY(1rem) scale(0.95);
                opacity: 0;
              }
              to {
                transform: translateY(0) scale(1);
                opacity: 1;
              }
            }
            .animate-toast-in {
              animation: toastSlideIn 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
          `}</style>
          <div className={`p-1.5 rounded-xl flex items-center justify-center ${
            toast.type === 'error'
              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
              : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
          }`}>
            {toast.type === 'error' ? (
              <FiAlertCircle className="w-4 h-4" />
            ) : (
              <FiCheckCircle className="w-4 h-4" />
            )}
          </div>
          <div className="text-sm font-semibold pr-1 select-none">
            {toast.message}
          </div>
        </div>
      )}
    </>
  )
}

export default Toolbar
