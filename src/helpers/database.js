
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://test:qw12qw12@cluster0-cnpfs.mongodb.net/test?retryWrites=true&w=majority";

const insertNewsToDatabase = async (title, text, link, pageName) => {
    const isNoArticleInDB = await getNewsBasedOnTitle(title);

    if(isNoArticleInDB) {
        const client = await MongoClient.connect(uri, {useNewUrlParser: true});
        const db = client.db('crap');
        await db.collection('crap').insertOne({title, text, link, pageName, date: new Date()});

        await client.close();
    }

};

const getNewsBasedOnTitle = async(title) =>{
    const client = await MongoClient.connect(uri, { useNewUrlParser: true });
    try {

        const db = client.db('crap');
        const news = await db.collection('crap').find({title}).toArray();

        return news && Object.entries(news).length === 0;
    }

    finally {
        await client.close();
    }
};

const getNewsFromToday = async (pageName) => {
    const client = await MongoClient.connect(uri, { useNewUrlParser: true });
    try {
        const db = client.db('crap');

        const start = new Date();
        start.setHours(0,0,0,0);

        const end = new Date();
        end.setHours(23,59,59,999);

        const query = {pageName, date: { $gte: start, $lt: end }};
        return await db.collection('crap').find(query).toArray();
    }

    finally {
        await client.close();
    }
};

module.exports = {
    insertNewsToDatabase,
    getNewsFromToday,
};
