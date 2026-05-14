export function getDashboardStats(cases) {
  const totals = cases.reduce(
    (summary, caseItem) => {
      summary.totalCases += 1
      summary.totalDocuments += caseItem.documentCount
      summary.receivedDocuments += caseItem.receivedCount
      summary.missingDocuments += caseItem.missingCount

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
      readyCases: 0
    }
  )

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
      label: 'Missing items',
      value: totals.missingDocuments,
      detail: 'Still needs follow-up'
    }
  ]
}

export function getVisibleCases(cases, searchQuery, statusFilter, caseTypeFilter) {
  const normalizedSearchQuery = searchQuery.trim().toLowerCase()

  return cases.filter((caseItem) => {
    const matchesStatus = statusFilter === 'all' || caseItem.status === statusFilter
    const matchesCaseType = caseTypeFilter === 'all' || caseItem.caseType === caseTypeFilter

    if (!normalizedSearchQuery) {
      return matchesStatus && matchesCaseType
    }

    const haystack = [caseItem.title, caseItem.caseType, caseItem.description].join(' ').toLowerCase()

    return matchesStatus && matchesCaseType && haystack.includes(normalizedSearchQuery)
  })
}
