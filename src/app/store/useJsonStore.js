import { create } from 'zustand'

const initialJson = `{
  "name": "JSON Forge",
  "version": 1,
  "id": 2
}`

export const useJsonStore = create((set) => ({
  json: initialJson,

  parsedJson: JSON.parse(initialJson),

  searchQuery: '',

  searchFocusRequest: 0,

  isCommandPaletteOpen: false,

  selectedNode: null,


  setSearchQuery: (value) => set({ searchQuery: value }),

  openCommandPalette: () => set({ isCommandPaletteOpen: true }),

  closeCommandPalette: () => set({ isCommandPaletteOpen: false }),

  requestSearchFocus: () =>
    set((state) => ({
      searchFocusRequest: state.searchFocusRequest + 1,
    })),

  setSelectedNode: (value) => set({ selectedNode: value }),



  setJson: (value) =>
    set(() => {
      try {
        return {
          json: value,
          parsedJson: JSON.parse(value),
          selectedNode: null,
        }
      } catch {
        return {
          json: value,
          parsedJson: null,
          selectedNode: null,
        }
      }
    }),
}))
