import { MongoClient } from 'mongodb'
import { envServer } from '~/env/server'

const client = new MongoClient(envServer.MONGODB_URI || '')

let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable to persist the MongoClient across hot reloading
  let globalClient: MongoClient | undefined = (global as any)._mongoClient
  if (!globalClient) {
    globalClient = client
    ;(global as any)._mongoClient = globalClient
  }
  clientPromise = Promise.resolve(globalClient)
} else {
  // In production mode, it's safe to use a new MongoClient each time
  clientPromise = client.connect()
}

export default clientPromise
