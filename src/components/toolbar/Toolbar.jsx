import {
  FiCheckCircle,
  FiAlertCircle,
  FiCopy,
  FiDownload,
  FiUpload,
  FiChevronDown,
} from 'react-icons/fi'
import SearchBar from '../search/SearchBar'
import ToolbarButton from '../ui/ToolbarButton'
import Toast from '../ui/Toast'
import useToolbarActions from './useToolbarActions'
import ExportDropdown from './ExportDropdown'

function Toolbar() {
  const {
    isExportOpen,
    setIsExportOpen,
    toast,
    exportDropdownRef,
    handleFormat,
    handleMinify,
    handleCopy,
    handleExport,
    handleImport,
    isValid,
  } = useToolbarActions()

  return (
    <>
      <div className="grid h-auto grid-cols-1 items-center gap-3 border-b border-zinc-800 bg-zinc-900 px-3 py-3 md:grid-cols-[1fr_minmax(280px,560px)_1fr] md:h-14 md:gap-4 md:px-4 md:py-0">

        {/* Left */}
        <div className="flex flex-wrap items-center gap-2 justify-self-start">
          <ToolbarButton
            onClick={handleFormat}
            disabled={!isValid}
            className="px-3 h-9 bg-zinc-800 text-xs font-semibold select-none"
            title="Format JSON structure"
            icon={null}
          >
            Format
          </ToolbarButton>
          <ToolbarButton
            onClick={handleMinify}
            disabled={!isValid}
            className="px-3 h-9 bg-zinc-800 text-xs font-semibold select-none"
            title="Minify JSON structure"
            icon={null}
          >
            Minify
          </ToolbarButton>
        </div>

        <div className="w-full justify-self-center">
          <SearchBar />
        </div>

        {/* Right */}
        <div className="flex flex-wrap items-center gap-2 justify-self-end">
          <ToolbarButton
            onClick={handleCopy}
            className="w-9 h-9 bg-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white"
            title="Copy Editor JSON"
            icon={FiCopy}
          />

          <ToolbarButton
            as="label"
            className="w-9 h-9 bg-zinc-800 flex items-center justify-center"
            title="Import JSON/TXT file"
            icon={FiUpload}
          >
            <input
              type="file"
              accept=".json,.txt"
              hidden
              onChange={handleImport}
            />
          </ToolbarButton>

          {/* Export Dropdown */}
          <ExportDropdown
            isOpen={isExportOpen}
            onToggle={() => setIsExportOpen(!isExportOpen)}
            onExport={handleExport}
            exportDropdownRef={exportDropdownRef}
          />

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
      <Toast message={toast?.message} type={toast?.type} />
    </>
  )
}

export default Toolbar
