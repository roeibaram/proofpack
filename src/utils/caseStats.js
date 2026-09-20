import { getDueSortValue, getDueTone } from './dueDates.js'

export function getDashboardStats(cases) {
  const totals = cases.reduce(
    (summary, caseItem) => {
      summary.totalCases += 1
      summary.totalDocuments += caseItem.documentCount
      summary.receivedDocuments += caseItem.receivedCount
      summary.missingDocuments += caseItem.missingCount

      const dueTone = getDueTone(caseItem.dueDate)

      if (dueTone === 'overdue' || dueTone === 'soon') {
        summary.urgentCases += 1
      }

      if (caseItem.status === 'ready' || caseItem.status === 'submitted') {
        summary.readyCases += 1
      }

      return summary
    },
    {
      totalCases: 0,
      totalDocuments: 0,
      receivedDocuments: 0,
      missingDocuments: 0,
      readyCases: 0,
      urgentCases: 0
    }
  )
  const completionRate = totals.totalDocuments
    ? Math.round((totals.receivedDocuments / totals.totalDocuments) * 100)
    : 0

  return [
    {
      label: 'Open folders',
      value: totals.totalCases,
      detail: `${totals.readyCases} ready to file`
    },
    {
      label: 'Evidence logged',
      value: totals.totalDocuments,
      detail: `${totals.receivedDocuments} received`
    },
    {
      label: 'Urgent follow-ups',
      value: totals.urgentCases,
      detail: `${totals.missingDocuments} open evidence item${totals.missingDocuments === 1 ? '' : 's'}`
    },
    {
      label: 'Completion rate',
      value: `${completionRate}%`,
      detail: `${totals.receivedDocuments} of ${totals.totalDocuments} evidence items received`
    }
  ]
}

export function getVisibleCases(cases, searchQuery, statusFilter, caseTypeFilter, sortMode) {
  const normalizedSearchQuery = searchQuery.trim().toLowerCase()

  return cases
    .filter((caseItem) => {
      const matchesStatus = statusFilter === 'all' || caseItem.status === statusFilter
      const matchesCaseType = caseTypeFilter === 'all' || caseItem.caseType === caseTypeFilter

      if (!normalizedSearchQuery) {
        return matchesStatus && matchesCaseType
      }

      const haystack = [caseItem.title, caseItem.caseType, caseItem.description].join(' ').toLowerCase()

      return matchesStatus && matchesCaseType && haystack.includes(normalizedSearchQuery)
    })
    .sort((leftCase, rightCase) => {
      const updatedDifference = new Date(rightCase.updatedAt) - new Date(leftCase.updatedAt)

      if (sortMode === 'followUp') {
        return getDueSortValue(leftCase.dueDate) - getDueSortValue(rightCase.dueDate) || updatedDifference
      }

      if (sortMode === 'missing') {
        return rightCase.missingCount - leftCase.missingCount || updatedDifference
      }

      if (sortMode === 'progress') {
        return rightCase.progress - leftCase.progress || updatedDifference
      }

      return updatedDifference
    })
}
