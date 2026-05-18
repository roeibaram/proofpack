const STARTER_PACKETS = {
  'Immigration package': [
    {
      label: 'Passport copy',
      category: 'Identity',
      status: 'missing',
      note: 'Scan the biographic page and confirm the name matches the filing forms.',
      required: true
    },
    {
      label: 'Birth certificate',
      category: 'Identity',
      status: 'missing',
      note: 'Keep the certified copy details in the note if a translation is also needed.',
      required: true
    },
    {
      label: 'Proof of address',
      category: 'Proof of address',
      status: 'missing',
      note: 'Add the strongest current address proof for the household file.',
      required: true
    },
    {
      label: 'Primary filing forms',
      category: 'Forms',
      status: 'missing',
      note: 'Track the main package forms and note which sections still need review.',
      required: true
    },
    {
      label: 'Relationship evidence',
      category: 'Supporting evidence',
      status: 'missing',
      note: 'Use this slip for photos, shared records, and other supporting proof.',
      required: true
    }
  ],
  'Insurance claim': [
    {
      label: 'Claim form',
      category: 'Forms',
      status: 'missing',
      note: 'Record the carrier claim number once it is assigned.',
      required: true
    },
    {
      label: 'Damage photos',
      category: 'Supporting evidence',
      status: 'missing',
      note: 'Capture wide and close shots and note the upload date.',
      required: true
    },
    {
      label: 'Repair estimate',
      category: 'Payment',
      status: 'missing',
      note: 'Include the most recent estimate and whether it is preliminary or final.',
      required: true
    },
    {
      label: 'Timeline notes',
      category: 'Timeline',
      status: 'missing',
      note: 'Log when the incident happened, when it was reported, and each follow-up call.',
      required: true
    }
  ],
  'Apartment application': [
    {
      label: 'Government ID copy',
      category: 'Identity',
      status: 'missing',
      note: 'Use the clearest copy that matches the application name.',
      required: true
    },
    {
      label: 'Recent pay stubs',
      category: 'Income',
      status: 'missing',
      note: 'Track the most recent 2-3 income records requested by leasing.',
      required: true
    },
    {
      label: 'Proof of address',
      category: 'Proof of address',
      status: 'missing',
      note: 'Add the latest statement or utility bill that confirms current residence.',
      required: true
    },
    {
      label: 'Landlord reference',
      category: 'Supporting evidence',
      status: 'missing',
      note: 'Keep the contact name and phone number in the notes field.',
      required: true
    }
  ],
  'Tax documents': [
    {
      label: 'Income statements',
      category: 'Income',
      status: 'missing',
      note: 'Use one slip to track W-2, 1099, or payroll records still missing.',
      required: true
    },
    {
      label: 'Identity verification',
      category: 'Identity',
      status: 'missing',
      note: 'Record which ID was used and whether a spouse copy is also needed.',
      required: true
    },
    {
      label: 'Deduction support',
      category: 'Supporting evidence',
      status: 'missing',
      note: 'Track receipts, donation letters, or expense logs here.',
      required: true
    },
    {
      label: 'Payment record',
      category: 'Payment',
      status: 'missing',
      note: 'Use for prior payment confirmations or refund tracking notes.',
      required: false
    }
  ]
}

export function getStarterPacket(caseType) {
  return STARTER_PACKETS[caseType] ?? []
}

export function hasStarterPacket(caseType) {
  return getStarterPacket(caseType).length > 0
}
