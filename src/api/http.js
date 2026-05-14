const apiBaseUrl = import.meta.env.VITE_API_URL?.trim()

function resolveUrl(pathname) {
  return apiBaseUrl ? `${apiBaseUrl}${pathname}` : pathname
}

export async function request(pathname, options = {}) {
  const { body, token, ...restOptions } = options

  const headers = {
    ...(body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...restOptions.headers
  }

  const response = await fetch(resolveUrl(pathname), {
    ...restOptions,
    headers,
    body: body ? JSON.stringify(body) : undefined
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(payload?.message || 'Request failed.')
  }

  return payload
}
