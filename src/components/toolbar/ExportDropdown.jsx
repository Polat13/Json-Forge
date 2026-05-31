import ToolbarButton from '../ui/ToolbarButton'
import { FiDownload, FiChevronDown } from 'react-icons/fi'

function ExportDropdown({
  isOpen,
  onToggle,
  onExport,
  exportDropdownRef,
}) {
  return (
    <div className="relative flex items-center" ref={exportDropdownRef}>
      <ToolbarButton
        onClick={onToggle}
        className="flex items-center gap-1.5 h-9 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white select-none"
        title="Export Options"
      >
        <FiDownload className="w-4 h-4" />
        <FiChevronDown className="w-3.5 h-3.5 opacity-60" />
      </ToolbarButton>
      {isOpen && (
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
          <ToolbarButton
            onClick={() => onExport('json')}
            className="flex items-center justify-between px-3 py-2 text-xs text-left rounded-lg text-zinc-300 hover:bg-zinc-900 hover:text-white"
          >
            <span>Export JSON</span>
            <span className="text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-1.5 py-0.5 rounded font-mono font-medium">.json</span>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => onExport('txt')}
            className="flex items-center justify-between px-3 py-2 text-xs text-left rounded-lg text-zinc-300 hover:bg-zinc-900 hover:text-white"
          >
            <span>Export TXT</span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono font-medium">.txt</span>
          </ToolbarButton>
        </div>
      )}
    </div>
  )
}

export default ExportDropdown
