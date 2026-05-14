import mongoose from 'mongoose'

export async function connectDatabase(connectionString) {
  if (!connectionString) {
    throw new Error('MONGODB_URI is missing. Add it to the root .env file.')
  }

  await mongoose.connect(connectionString)
}
