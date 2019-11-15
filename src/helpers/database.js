const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: 5432,
    ssl: true,
    sslfactory: 'org.postgresql.ssl.NonValidatingFactory',
});


const insertNewsToDatabase = async (title, text, link, pageName) => {
    const query = {
        text: 'INSERT INTO pages(title, text, link, pagename, date) VALUES($1, $2, $3, $4, $5) ON CONFLICT (title) DO NOTHING',
        values: [title.trim(), text, link, pageName, new Date()]
    };
    await pool.query(query);
};

const getNewsFromToday = async (pageName) => {
    const query = {
        text: "SELECT * FROM pages WHERE pagename = $1 AND date <= now() AND date >= now() - interval '2 days' ORDER BY date DESC",
        values: [pageName.toString()]
    };

    const news = await pool.query(query);
    return news.rows;
};

const endPool = async () =>{
    await pool.end();
};

module.exports = {
    insertNewsToDatabase,
    getNewsFromToday,
    endPool,
};
