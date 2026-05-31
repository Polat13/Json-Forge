import JsonView from '@uiw/react-json-view'
import { vscodeTheme } from '@uiw/react-json-view/vscode'
import { useJsonStore } from '../../app/store/useJsonStore'
import { createJsonNodeMeta, createJsonPath } from '../../lib/jsonSearch'

function JsonTree() {
  const { parsedJson, selectedNode, setSelectedNode } = useJsonStore()

  if (!parsedJson) {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="max-w-sm rounded-2xl border border-red-500/20 bg-red-500/5 p-6">

        <div className="pb-3 text-2xl">
          ⚠
        </div>

        <h2 className="text-lg font-semibold text-red-400">
          Invalid JSON
        </h2>

        <p className="pt-2 pb-2 text-sm text-zinc-400">
          Fix syntax errors in the editor to preview
          the JSON structure.
        </p>

        <div className="pt-4 rounded-xl bg-zinc-900 p-3 text-xs text-zinc-500">
          Common issues:
          <br />
          • Missing comma
          <br />
          • Missing quotation mark
          <br />
          • Unexpected bracket
        </div>

      </div>
    </div>
  )
}

  return (
    <div className="h-full overflow-auto p-4">

      <JsonView
        value={parsedJson}
        style={vscodeTheme}
        displayDataTypes={false}
        displayObjectSize={false}
        enableClipboard={false}
      >
        <JsonView.KeyName
          render={(props, { keyName, keys = [], value }) => {
            const path = createJsonPath(keys)
            const isSelected = selectedNode?.path === path

            return (
              <span
                {...props}
                onClick={(event) => {
                  event.stopPropagation()
                  setSelectedNode(createJsonNodeMeta({
                    key: keyName,
                    pathSegments: keys,
                    value,
                  }))
                }}
                className={`cursor-pointer rounded px-1 transition ${
                  isSelected
                    ? 'bg-indigo-500/20 text-indigo-200 ring-1 ring-indigo-400/30'
                    : 'hover:bg-zinc-800/80'
                }`}
              />
            )
          }}
        />
      </JsonView>

    </div>
  )
}

export default JsonTree
