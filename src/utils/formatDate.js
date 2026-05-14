export function formatDate(timestamp) {
  if (!timestamp) {
    return 'just now'
  }

  return new Date(timestamp).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  })
}
