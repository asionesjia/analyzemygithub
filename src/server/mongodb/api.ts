import clientPromise from '~/server/mongodb/index'
import { ObjectId } from 'mongodb'
import { GitHubUser } from '~/server/api/routers/github/types'

export const insertAnalysis = async (insertObject: {}) => {
  const client = await clientPromise
  const db = client.db('analyzemygithub').collection('analysis')

  const dbResult = await db.insertOne(insertObject)
  return dbResult.insertedId
}

// 根据 ID 查询文档
export const findAnalysisById = async (id: string) => {
  const client = await clientPromise
  const db = client.db('analyzemygithub').collection('analysis')

  try {
    const doc = await db.findOne({ _id: new ObjectId(id) })
    if (doc) {
      const { _id, ...result } = doc // 解构并删除 _id
      return result // 返回没有 _id 的数据
    }
    return null
  } catch (error) {
    console.error('Error finding document by ID:', error)
    throw error
  }
}

// 根据 login 查询文档
export const findAnalysisByLogin = async (login: string) => {
  const client = await clientPromise
  const db = client.db('analyzemygithub').collection('analysis')

  try {
    const doc = await db.findOne({ login: login })
    if (doc) {
      const { _id, ...result } = doc // 解构并删除 _id
      return result // 返回没有 _id 的数据
    }
    return null
  } catch (error) {
    console.error('Error finding document by login:', error)
    throw error
  }
}

export const findAllAnalyses = async () => {
  const client = await clientPromise
  const db = client.db('analyzemygithub').collection('analysis')

  try {
    console.log('---MongoDb---')
    const docs = await db.find({}).toArray()
    let result: GitHubUser[] = []
    for (const doc of docs) {
      const { _id, ...rest } = doc
      result.push(rest as GitHubUser)
    }
    return result
  } catch (error) {
    console.error('Error finding all documents:', error)
    throw error
  }
}
