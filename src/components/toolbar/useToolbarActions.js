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
import ToolbarButton from '../ui/ToolbarButton'
import Toast from '../ui/Toast'

function useToolbarActions() {
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

  return {
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
  }
}

export default useToolbarActions
