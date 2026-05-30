import { useEffect, useRef, useState } from 'react'
import CommandPalette from './components/command/CommandPalette'
import JsonEditor from './components/editor/JsonEditor'
import JsonInspector from './components/inspector/JsonInspector'
import StructureOverview from './components/overview/StructureOverview'
import SearchResults from './components/search/SearchResults'
import JsonTree from './components/tree/JsonTree'
import Toolbar from './components/toolbar/Toolbar'

function App() {
  const [leftWidth, setLeftWidth] = useState(50)
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef(null)
  const isResizing = useRef(false)

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (!isResizing.current || !containerRef.current || isMobile) return

      const rect = containerRef.current.getBoundingClientRect()
      const nextWidth = ((event.clientX - rect.left) / rect.width) * 100
      if (nextWidth < 20 || nextWidth > 80) return
      setLeftWidth(nextWidth)
    }

    const handleMouseUp = () => {
      isResizing.current = false
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isMobile])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const startResize = () => {
    if (!isMobile) {
      isResizing.current = true
    }
  }

  return (
    <div className="h-screen bg-zinc-950 text-zinc-100">
      <div className={`flex h-full ${isMobile ? 'flex-col' : ''}`}>

        <StructureOverview />

        {/* Main */}
        <main className="flex-1 flex flex-col">

          <Toolbar />

          <div
            ref={containerRef}
            className={`flex-1 flex min-h-0 ${isMobile ? 'flex-col' : ''}`}
          >
            <div
              className={`min-h-0 ${isMobile ? 'flex-1 border-b border-zinc-800' : 'border-r border-zinc-800'}`}
              style={{ width: isMobile ? '100%' : `${leftWidth}%` }}
            >
              <JsonEditor />
            </div>

            <div
              className={`w-1 bg-zinc-800 cursor-col-resize hover:bg-zinc-700 ${isMobile ? 'hidden' : ''}`}
              onMouseDown={startResize}
            />

            <div className="min-h-0 flex-1 w-full bg-zinc-900 flex flex-col">
              <SearchResults />

              <JsonInspector />

              <div className="min-h-0 flex-1 overflow-auto">
                <JsonTree />
              </div>
            </div>
          </div>

        </main>

        <CommandPalette />
      </div>
    </div>
  )
}

export default App
