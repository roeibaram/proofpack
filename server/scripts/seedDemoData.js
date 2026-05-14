import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { connectDatabase } from '../db.js'
import Case from '../models/Case.js'
import User from '../models/User.js'

dotenv.config()

const demoCredentials = {
  name: 'Demo Reviewer',
  email: 'demo@proofpack.local',
  password: 'ProofPack123'
}

const demoCases = [
  {
    title: 'Family-based immigration folder',
    caseType: 'Immigration package',
    status: 'collecting',
    description: 'Track identity records, relationship evidence, and filing forms for the submission packet.',
    dueDate: '2026-05-19',
    documents: [
      {
        label: 'Passport copy',
        category: 'Identity',
        status: 'received',
        note: 'Biographic page scanned and ready to attach.',
        dueDate: '2026-05-16',
        required: true
      },
      {
        label: 'Marriage certificate',
        category: 'Supporting evidence',
        status: 'requested',
        note: 'Waiting on a clearer certified copy from records office.',
        dueDate: '2026-05-17',
        required: true
      },
      {
        label: 'I-130 package',
        category: 'Forms',
        status: 'missing',
        note: 'Draft is started but supporting attachments still need review.',
        dueDate: '2026-05-19',
        required: true
      }
    ]
  },
  {
    title: 'Insurance claim support file',
    caseType: 'Insurance claim',
    status: 'ready',
    description: 'Collect repair photos, receipts, and timeline notes before final carrier upload.',
    dueDate: '2026-05-22',
    documents: [
      {
        label: 'Damage photos',
        category: 'Supporting evidence',
        status: 'received',
        note: 'Exterior and interior photos uploaded from mobile.',
        dueDate: '2026-05-15',
        required: true
      },
      {
        label: 'Police report',
        category: 'Timeline',
        status: 'requested',
        note: 'Requested from the city portal; expected within two business days.',
        dueDate: '2026-05-18',
        required: true
      },
      {
        label: 'Repair estimate',
        category: 'Income',
        status: 'received',
        note: 'Body shop estimate approved and ready to attach.',
        dueDate: '',
        required: false
      }
    ]
  },
  {
    title: 'Apartment application packet',
    caseType: 'Apartment application',
    status: 'draft',
    description: 'Prepare ID, income proof, and references for the leasing office review packet.',
    dueDate: '2026-05-20',
    documents: [
      {
        label: 'Pay stubs',
        category: 'Income',
        status: 'received',
        note: 'Last two pay stubs exported from payroll portal.',
        dueDate: '2026-05-18',
        required: true
      },
      {
        label: 'Landlord reference',
        category: 'Supporting evidence',
        status: 'missing',
        note: 'Need signed note with phone number and tenancy dates.',
        dueDate: '2026-05-20',
        required: true
      }
    ]
  }
]

async function seedDemoData() {
  await connectDatabase(process.env.MONGODB_URI)

  const passwordHash = await bcrypt.hash(demoCredentials.password, 10)
  const user = await User.findOneAndUpdate(
    { email: demoCredentials.email },
    {
      name: demoCredentials.name,
      email: demoCredentials.email,
      passwordHash
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    }
  )

  await Case.deleteMany({ owner: user._id })

  await Case.insertMany(
    demoCases.map((caseItem) => ({
      owner: user._id,
      ...caseItem
    }))
  )

  console.log('Demo data is ready.')
  console.log(`Email: ${demoCredentials.email}`)
  console.log(`Password: ${demoCredentials.password}`)
  console.log(`Seeded folders: ${demoCases.length}`)
}

seedDemoData()
  .catch((error) => {
    console.error('Unable to seed demo data.')
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await mongoose.disconnect()
  })
