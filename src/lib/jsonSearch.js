const MAX_RESULTS = 100

export const getJsonValueType = (value) => {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'

  return typeof value
}

const formatPathSegment = (segment, index) => {
  if (typeof segment === 'number') {
    return `[${segment}]`
  }

  if (index === 0) {
    return segment
  }

  if (/^[A-Za-z_$][\w$]*$/.test(segment)) {
    return `.${segment}`
  }

  return `[${JSON.stringify(segment)}]`
}

export const createJsonPath = (segments) => {
  if (segments.length === 0) return '$'

  return segments.map(formatPathSegment).join('')
}

export const createJsonPreview = (value) => {
  const type = getJsonValueType(value)

  if (type === 'string') return value
  if (type === 'number' || type === 'boolean' || type === 'null') {
    return String(value)
  }

  if (type === 'array') {
    return `Array(${value.length})`
  }

  return `Object(${Object.keys(value).length})`
}

export const createJsonNodeMeta = ({ key, pathSegments, value }) => ({
  key: String(key),
  path: createJsonPath(pathSegments),
  pathSegments,
  preview: createJsonPreview(value),
  type: getJsonValueType(value),
  value,
})

const matchesQuery = ({ key, path, preview, type }, query) => {
  const searchableText = `${key} ${path} ${preview} ${type}`.toLowerCase()

  return searchableText.includes(query)
}

export const searchJson = (value, query) => {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) return []

  const results = []

  const visit = (currentValue, pathSegments, key = 'root') => {
    if (results.length >= MAX_RESULTS) return

    const entry = createJsonNodeMeta({
      key,
      pathSegments,
      value: currentValue,
    })

    const result = {
      ...entry,
      id: `${entry.path}-${results.length}`,
    }

    if (pathSegments.length > 0 && matchesQuery(result, normalizedQuery)) {
      results.push(result)
    }

    if (currentValue === null || typeof currentValue !== 'object') return

    const entries = Array.isArray(currentValue)
      ? currentValue.map((item, index) => [index, item])
      : Object.entries(currentValue)

    entries.forEach(([childKey, childValue]) => {
      visit(childValue, [...pathSegments, childKey], childKey)
    })
  }

  visit(value, [])

  return results
}
