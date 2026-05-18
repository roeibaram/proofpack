import { CASE_STATUS_LABELS, DOCUMENT_STATUS_LABELS } from '../constants/caseOptions.js'
import { formatDate } from './formatDate.js'

function sanitizeFileName(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function downloadCaseSummary(caseItem) {
  const lines = [
    'ProofPack folder summary',
    '',
    `Title: ${caseItem.title}`,
    `Folder type: ${caseItem.caseType}`,
    `Stage: ${CASE_STATUS_LABELS[caseItem.status]}`,
    `Opened: ${formatDate(caseItem.createdAt)}`,
    `Last activity: ${formatDate(caseItem.updatedAt)}`,
    `Next follow-up: ${caseItem.dueDate ? formatDate(caseItem.dueDate) : 'Not scheduled'}`,
    `Progress: ${caseItem.progress}%`,
    '',
    'Cover note:',
    caseItem.description || 'No cover note added yet.',
    '',
    'Evidence slips:'
  ]

  caseItem.documents.forEach((document, index) => {
    lines.push(
      '',
      `${String(index + 1).padStart(2, '0')}. ${document.label}`,
      `Status: ${DOCUMENT_STATUS_LABELS[document.status]}`,
      `Category: ${document.category}`,
      `Required: ${document.required ? 'Yes' : 'No'}`,
      `Follow-up: ${document.dueDate ? formatDate(document.dueDate) : 'Not scheduled'}`,
      `Notes: ${document.note || 'No notes added yet.'}`
    )
  })

  const fileContents = `${lines.join('\n')}\n`
  const fileBlob = new Blob([fileContents], { type: 'text/plain;charset=utf-8' })
  const fileUrl = URL.createObjectURL(fileBlob)
  const link = document.createElement('a')

  link.href = fileUrl
  link.download = `${sanitizeFileName(caseItem.title) || 'proofpack-folder'}-summary.txt`
  link.click()

  URL.revokeObjectURL(fileUrl)
}
