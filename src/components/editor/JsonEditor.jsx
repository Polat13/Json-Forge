import Editor from '@monaco-editor/react'
import { useJsonStore } from '../../app/store/useJsonStore'

function JsonEditor() {
  const { json, setJson } = useJsonStore()

  return (
    <Editor
      height="100%"
      defaultLanguage="json"
      theme="vs-dark"
      value={json}
      onChange={(value) => setJson(value)}

      options={{
        minimap: {
          enabled: true,
        },

        fontSize: 14,

        smoothScrolling: true,

        padding: {
          top: 16,
        },

        scrollBeyondLastLine: false,

        wordWrap: 'on',

        automaticLayout: true,
      }}
    />
  )
}

export default JsonEditor