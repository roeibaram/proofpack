export const CASE_TYPE_OPTIONS = [
  'Immigration package',
  'Divorce paperwork',
  'Insurance claim',
  'Apartment application',
  'Tax documents',
  'Benefits appeal',
  'General case'
]

export const CASE_STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'collecting', label: 'Collecting evidence' },
  { value: 'ready', label: 'Ready to submit' },
  { value: 'submitted', label: 'Submitted' }
]

export const DOCUMENT_CATEGORY_OPTIONS = [
  'Identity',
  'Proof of address',
  'Income',
  'Forms',
  'Supporting evidence',
  'Timeline',
  'Payment',
  'Custom'
]

export const DOCUMENT_STATUS_OPTIONS = [
  { value: 'missing', label: 'Missing' },
  { value: 'requested', label: 'Requested' },
  { value: 'received', label: 'Received' }
]

export const CASE_STATUS_LABELS = Object.fromEntries(
  CASE_STATUS_OPTIONS.map((option) => [option.value, option.label])
)

export const DOCUMENT_STATUS_LABELS = Object.fromEntries(
  DOCUMENT_STATUS_OPTIONS.map((option) => [option.value, option.label])
)
