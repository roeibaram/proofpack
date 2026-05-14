import bcrypt from 'bcryptjs'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import { requireAuth, signToken } from './auth.js'
import { connectDatabase } from './db.js'
import Case from './models/Case.js'
import User from './models/User.js'

dotenv.config()

const port = Number(process.env.PORT) || 5002
const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

function serializeUser(userDocument) {
  return {
    id: userDocument.id,
    name: userDocument.name,
    email: userDocument.email,
    createdAt: userDocument.createdAt
  }
}

function serializeCase(caseDocument) {
  const documentCount = caseDocument.documents.length
  const requiredDocuments = caseDocument.documents.filter((document) => document.required)
  const receivedCount = requiredDocuments.filter((document) => document.status === 'received').length
  const missingCount = caseDocument.documents.filter((document) => document.status !== 'received').length
  const progress = requiredDocuments.length === 0 ? 0 : Math.round((receivedCount / requiredDocuments.length) * 100)

  return {
    id: caseDocument.id,
    title: caseDocument.title,
    caseType: caseDocument.caseType,
    status: caseDocument.status,
    description: caseDocument.description,
    dueDate: caseDocument.dueDate,
    documentCount,
    requiredDocumentCount: requiredDocuments.length,
    receivedCount,
    missingCount,
    progress,
    createdAt: caseDocument.createdAt,
    updatedAt: caseDocument.updatedAt,
    documents: caseDocument.documents.map((document) => ({
      id: document.id,
      label: document.label,
      category: document.category,
      status: document.status,
      note: document.note,
      dueDate: document.dueDate,
      required: document.required,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt
    }))
  }
}

function normalizeDateValue(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function isValidDateInput(value) {
  if (!value) {
    return true
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false
  }

  const [year, month, day] = value.split('-').map(Number)
  const parsedDate = new Date(year, month - 1, day)

  return (
    parsedDate.getFullYear() === year &&
    parsedDate.getMonth() === month - 1 &&
    parsedDate.getDate() === day
  )
}

function normalizeCasePayload(payload) {
  return {
    title: payload.title?.trim() ?? '',
    caseType: payload.caseType?.trim() ?? '',
    status: payload.status ?? 'draft',
    description: payload.description?.trim() ?? '',
    dueDate: normalizeDateValue(payload.dueDate)
  }
}

function normalizeDocumentPayload(payload) {
  return {
    label: payload.label?.trim() ?? '',
    category: payload.category?.trim() ?? '',
    status: payload.status ?? 'missing',
    note: payload.note?.trim() ?? '',
    dueDate: normalizeDateValue(payload.dueDate),
    required: payload.required ?? true
  }
}

function validateCasePayload(casePayload) {
  if (casePayload.title.length < 3) {
    return 'Package title must be at least 3 characters.'
  }

  if (!casePayload.caseType) {
    return 'Choose a case type.'
  }

  if (!isValidDateInput(casePayload.dueDate)) {
    return 'Choose a valid follow-up date.'
  }

  return ''
}

function validateDocumentPayload(documentPayload) {
  if (documentPayload.label.length < 2) {
    return 'Document label must be at least 2 characters.'
  }

  if (!documentPayload.category) {
    return 'Choose a document category.'
  }

  if (!isValidDateInput(documentPayload.dueDate)) {
    return 'Choose a valid follow-up date.'
  }

  return ''
}

app.get('/api/health', (request, response) => {
  response.json({ status: 'ok' })
})

app.post('/api/auth/register', async (request, response) => {
  const { name = '', email = '', password = '' } = request.body

  if (name.trim().length < 2) {
    response.status(400).json({ message: 'Name must be at least 2 characters.' })
    return
  }

  if (!email.includes('@')) {
    response.status(400).json({ message: 'Enter a valid email address.' })
    return
  }

  if (password.length < 8) {
    response.status(400).json({ message: 'Password must be at least 8 characters.' })
    return
  }

  const normalizedEmail = email.trim().toLowerCase()
  const existingUser = await User.findOne({ email: normalizedEmail })

  if (existingUser) {
    response.status(409).json({ message: 'An account with that email already exists.' })
    return
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash
  })

  response.status(201).json({
    token: signToken(user.id),
    user: serializeUser(user)
  })
})

app.post('/api/auth/login', async (request, response) => {
  const { email = '', password = '' } = request.body
  const normalizedEmail = email.trim().toLowerCase()
  const user = await User.findOne({ email: normalizedEmail })

  if (!user) {
    response.status(401).json({ message: 'Email or password is incorrect.' })
    return
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash)

  if (!passwordMatches) {
    response.status(401).json({ message: 'Email or password is incorrect.' })
    return
  }

  response.json({
    token: signToken(user.id),
    user: serializeUser(user)
  })
})

app.get('/api/auth/me', requireAuth, async (request, response) => {
  const user = await User.findById(request.userId)

  if (!user) {
    response.status(404).json({ message: 'User not found.' })
    return
  }

  response.json({ user: serializeUser(user) })
})

app.get('/api/cases', requireAuth, async (request, response) => {
  const cases = await Case.find({ owner: request.userId }).sort({ updatedAt: -1 })
  response.json({ cases: cases.map(serializeCase) })
})

app.post('/api/cases', requireAuth, async (request, response) => {
  const casePayload = normalizeCasePayload(request.body)
  const validationMessage = validateCasePayload(casePayload)

  if (validationMessage) {
    response.status(400).json({ message: validationMessage })
    return
  }

  const caseDocument = await Case.create({
    owner: request.userId,
    ...casePayload
  })

  response.status(201).json({ case: serializeCase(caseDocument) })
})

app.put('/api/cases/:caseId', requireAuth, async (request, response) => {
  const casePayload = normalizeCasePayload(request.body)
  const validationMessage = validateCasePayload(casePayload)

  if (validationMessage) {
    response.status(400).json({ message: validationMessage })
    return
  }

  const caseDocument = await Case.findOneAndUpdate(
    { _id: request.params.caseId, owner: request.userId },
    casePayload,
    { new: true, runValidators: true }
  )

  if (!caseDocument) {
    response.status(404).json({ message: 'Package not found.' })
    return
  }

  response.json({ case: serializeCase(caseDocument) })
})

app.delete('/api/cases/:caseId', requireAuth, async (request, response) => {
  const caseDocument = await Case.findOneAndDelete({
    _id: request.params.caseId,
    owner: request.userId
  })

  if (!caseDocument) {
    response.status(404).json({ message: 'Package not found.' })
    return
  }

  response.json({ deletedCaseId: request.params.caseId })
})

app.post('/api/cases/:caseId/documents', requireAuth, async (request, response) => {
  const caseDocument = await Case.findOne({ _id: request.params.caseId, owner: request.userId })

  if (!caseDocument) {
    response.status(404).json({ message: 'Package not found.' })
    return
  }

  const documentPayload = normalizeDocumentPayload(request.body)
  const validationMessage = validateDocumentPayload(documentPayload)

  if (validationMessage) {
    response.status(400).json({ message: validationMessage })
    return
  }

  caseDocument.documents.push(documentPayload)
  await caseDocument.save()

  response.status(201).json({ case: serializeCase(caseDocument) })
})

app.put('/api/cases/:caseId/documents/:documentId', requireAuth, async (request, response) => {
  const caseDocument = await Case.findOne({ _id: request.params.caseId, owner: request.userId })

  if (!caseDocument) {
    response.status(404).json({ message: 'Package not found.' })
    return
  }

  const document = caseDocument.documents.id(request.params.documentId)

  if (!document) {
    response.status(404).json({ message: 'Document item not found.' })
    return
  }

  const documentPayload = normalizeDocumentPayload(request.body)
  const validationMessage = validateDocumentPayload(documentPayload)

  if (validationMessage) {
    response.status(400).json({ message: validationMessage })
    return
  }

  document.set(documentPayload)
  await caseDocument.save()

  response.json({ case: serializeCase(caseDocument) })
})

app.delete('/api/cases/:caseId/documents/:documentId', requireAuth, async (request, response) => {
  const caseDocument = await Case.findOne({ _id: request.params.caseId, owner: request.userId })

  if (!caseDocument) {
    response.status(404).json({ message: 'Package not found.' })
    return
  }

  const document = caseDocument.documents.id(request.params.documentId)

  if (!document) {
    response.status(404).json({ message: 'Document item not found.' })
    return
  }

  document.deleteOne()
  await caseDocument.save()

  response.json({ case: serializeCase(caseDocument) })
})

app.use((request, response) => {
  response.status(404).json({ message: 'Route not found.' })
})

app.use((error, request, response, next) => {
  void next
  console.error(error)

  if (error?.name === 'CastError') {
    response.status(400).json({ message: 'That id is not valid.' })
    return
  }

  if (error?.code === 11000) {
    response.status(409).json({ message: 'That record already exists.' })
    return
  }

  response.status(500).json({ message: 'Something went wrong on the server.' })
})

async function startServer() {
  await connectDatabase(process.env.MONGODB_URI)

  app.listen(port, () => {
    console.log(`ProofPack API running on http://localhost:${port}`)
  })
}

startServer().catch((error) => {
  console.error('Unable to start ProofPack API.')
  console.error(error)
  process.exit(1)
})
