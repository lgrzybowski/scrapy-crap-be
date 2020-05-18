const { MongoClient } = require('mongodb')
const uri = `mongodb+srv://${process.env.DATABASE}:${process.env.PASSWORD}@cluster0-vv3n4.mongodb.net/test?retryWrites=true&w=majority`

const connectToMongo = async () => {
  return await MongoClient.connect(uri, { useNewUrlParser: true })
}

const insertNewsToDatabase = async (title, text, link, pageName) => {
  const isNoArticleInDB = await getNewsBasedOnTitle(title)

  if (isNoArticleInDB) {
    const client = await connectToMongo()

    try {
      console.log(`adding new link from page ${pageName}`)
      const db = client.db('crap')
      await db.collection('crap').insertOne({ title, text, link, pageName, date: new Date() })
    } catch (e) {
      console.log(e)
    } finally {
      await client.close()
    }
  }
}

const getNewsBasedOnTitle = async (title) => {
  const client = await connectToMongo()
  try {
    const db = client.db('crap')
    const news = await db.collection('crap').find({ title }).toArray()

    return news && Object.entries(news).length === 0
  } catch (e) {
    console.log(e)
  } finally {
    await client.close()
  }
}

const getNewsFromToday = async (pageName) => {
  const client = await connectToMongo()
  try {
    const db = client.db('crap')

    const date = new Date()
    date.setDate(date.getDate() - 2)

    const end = new Date()
    end.setHours(23, 59, 59, 999)

    const query = { pageName, date: { $gte: date, $lt: end } }
    return await db.collection('crap').find(query).sort({ date: -1 }).toArray()
  } catch (e) {
    console.log(e)
  } finally {
    await client.close()
  }
}

const getAllSites = async () => {
  const client = await connectToMongo()
  try {
    const db = client.db('crap')
    return await db.collection('crap').distinct("pageName")

  } catch (e) {
    console.log(e)
  } finally {
    await client.close()
  }
}

module.exports = {
  insertNewsToDatabase,
  getNewsFromToday,
  getAllSites
}
