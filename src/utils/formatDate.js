export function formatDate(timestamp) {
  if (!timestamp) {
    return 'just now'
  }

  const date = /^\d{4}-\d{2}-\d{2}$/.test(timestamp)
    ? new Date(`${timestamp}T12:00:00`)
    : new Date(timestamp)

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  })
}
