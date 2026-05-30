import { createJsonPath } from './jsonSearch'

const emptyStats = {
  totalNodes: 0,
  objects: 0,
  arrays: 0,
  keys: 0,
  primitives: 0,
  maxDepth: 0,
  largestArray: null,
}

export const getJsonStats = (value) => {
  if (value === null || value === undefined) return emptyStats

  const stats = { ...emptyStats }

  const visit = (currentValue, pathSegments, depth) => {
    stats.totalNodes += 1
    stats.maxDepth = Math.max(stats.maxDepth, depth)

    if (Array.isArray(currentValue)) {
      stats.arrays += 1

      if (!stats.largestArray || currentValue.length > stats.largestArray.size) {
        stats.largestArray = {
          path: createJsonPath(pathSegments),
          size: currentValue.length,
        }
      }

      currentValue.forEach((item, index) => {
        visit(item, [...pathSegments, index], depth + 1)
      })

      return
    }

    if (currentValue && typeof currentValue === 'object') {
      const entries = Object.entries(currentValue)

      stats.objects += 1
      stats.keys += entries.length

      entries.forEach(([key, childValue]) => {
        visit(childValue, [...pathSegments, key], depth + 1)
      })

      return
    }

    stats.primitives += 1
  }

  visit(value, [], 0)

  return stats
}
