const bro = require('../src/crawler/browser');
const pageURL = 'https://www.gram.pl';
const textHelper = require('./../src/helpers/text');
const databaseHelper = require('./../src/helpers/database');

(async () => {
    const browser = await bro.browser();
    const page = await browser.newPage();
    const pageName = 'grampl';

    try {
        console.log(`!!! STARTING CRAWLING PAGE ${pageName}`);
        await page.goto(pageURL, { timeout: 120000 });
        await page.waitForSelector('.news-room');
        let news = await page.evaluate(() => {
            let newsResults = [];
            let newsOnPage = document.querySelectorAll('.news-room .article a');

            newsOnPage.forEach(async (singleNews) => {
                const link = await singleNews.getAttribute('href');
                newsResults.push(link);
            });

            return newsResults;
        });

        for (let i = 0; i < news.length - 1; i++) {
            await page.goto(pageURL + news[i], { timeout: 120000 });

            let title = await textHelper.singleSelectorReadText(page, 'article h1');
            let text = await textHelper.multipleSelectorsReadText(page, '#content-root p');
            let link = pageURL + news[i];

            await databaseHelper.insertNewsToDatabase(title, text, link, pageName);
        }
    } catch (e) {
        console.log(e);
    }
    finally {
        console.log(`!!! FINISHED CRAWLING PAGE ${pageName}`);
        await databaseHelper.endPool();
        browser.close();
    }
})();
