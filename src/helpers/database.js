const { MongoClient } = require('mongodb')
const uri = `mongodb+srv://${process.env.DATABASE}:${process.env.PASSWORD}@cluster0-cnpfs.mongodb.net/test?retryWrites=true&w=majority`

const connectToMongo =  async () => {
  return await MongoClient.connect(uri, { useNewUrlParser: true })
}

const insertNewsToDatabase = async (title, text, link, pageName) => {
  const isNoArticleInDB = await getNewsBasedOnTitle(title)

  if (isNoArticleInDB) {
    const client = await connectToMongo();
    const db = client.db('crap')
    await db.collection('crap').insertOne({ title, text, link, pageName, date: new Date() })

    await client.close()
  }
}

const getNewsBasedOnTitle = async (title) => {
  const client = await connectToMongo();
  try {
    const db = client.db('crap')
    const news = await db.collection('crap').find({ title }).toArray()

    return news && Object.entries(news).length === 0
  } finally {
    await client.close()
  }
}

const getNewsFromToday = async (pageName) => {
  const client = await connectToMongo();
  try {
    const db = client.db('crap')

    const date = new Date()
    date.setDate(date.getDate() - 2)

    const end = new Date()
    end.setHours(23, 59, 59, 999)

    const query = { pageName, date: { $gte: date, $lt: end } }
    return await db.collection('crap').find(query).sort({ date: -1 }).toArray()
  } finally {
    await client.close()
  }
}

module.exports = {
  insertNewsToDatabase,
  getNewsFromToday
}
