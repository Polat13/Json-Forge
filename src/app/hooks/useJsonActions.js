import { useCallback } from 'react'
import { useJsonStore } from '../store/useJsonStore'

const downloadTextFile = ({ content, fileName, type }) => {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = fileName

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

const copyToClipboard = async (value) => {
  try {
    await navigator.clipboard.writeText(value)
  } catch (err) {
    console.error(err)
  }
}

export function useJsonActions() {
  const {
    json,
    parsedJson,
    setJson,
    setSearchQuery,
    setSelectedNode,
    requestSearchFocus,
  } = useJsonStore()

  const isValid = !!parsedJson

  const formatJson = useCallback(() => {
    if (!parsedJson) return

    setJson(JSON.stringify(parsedJson, null, 2))
  }, [parsedJson, setJson])

  const minifyJson = useCallback(() => {
    if (!parsedJson) return

    setJson(JSON.stringify(parsedJson))
  }, [parsedJson, setJson])

  const copyJson = useCallback(() => {
    copyToClipboard(json)
  }, [json])

  const exportJson = useCallback((format = 'json') => {
    const isTxt = format === 'txt'
    downloadTextFile({
      content: json,
      fileName: isTxt ? 'data.txt' : 'data.json',
      type: isTxt ? 'text/plain' : 'application/json',
    })
  }, [json])

  const clearSearch = useCallback(() => setSearchQuery(''), [setSearchQuery])

  const focusSearch = useCallback(() => requestSearchFocus(), [requestSearchFocus])

  const closeInspector = useCallback(() => setSelectedNode(null), [setSelectedNode])

  return {
    clearSearch,
    closeInspector,
    copyJson,
    exportJson,
    focusSearch,
    formatJson,
    isValid,
    minifyJson,
    setJson,
  }
}
