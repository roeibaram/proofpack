import { formatDate } from './formatDate.js'

const DAY_IN_MS = 24 * 60 * 60 * 1000

export function parseDateInput(dateValue) {
  if (!dateValue) {
    return null
  }

  return new Date(`${dateValue}T12:00:00`)
}

function getDayDifference(dateValue) {
  const parsedDate = parseDateInput(dateValue)

  if (!parsedDate) {
    return null
  }

  const today = new Date()
  const localToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12)

  return Math.round((parsedDate.getTime() - localToday.getTime()) / DAY_IN_MS)
}

export function getDueTone(dateValue) {
  const dayDifference = getDayDifference(dateValue)

  if (dayDifference === null) {
    return 'none'
  }

  if (dayDifference < 0) {
    return 'overdue'
  }

  if (dayDifference <= 3) {
    return 'soon'
  }

  return 'scheduled'
}

export function getDueLabel(dateValue) {
  const dayDifference = getDayDifference(dateValue)

  if (dayDifference === null) {
    return ''
  }

  if (dayDifference < 0) {
    return 'Overdue'
  }

  if (dayDifference === 0) {
    return 'Due today'
  }

  if (dayDifference === 1) {
    return 'Due tomorrow'
  }

  if (dayDifference <= 3) {
    return `Due in ${dayDifference} days`
  }

  return `Follow up ${formatDate(dateValue)}`
}

export function getDueSortValue(dateValue) {
  const parsedDate = parseDateInput(dateValue)
  return parsedDate ? parsedDate.getTime() : Number.POSITIVE_INFINITY
}
